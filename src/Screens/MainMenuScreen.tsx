import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon, TopNavigationAction } from '@ui-kitten/components';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Box, FlatList, HStack, Pressable, Skeleton, Text, VStack, Image, View, Spacer, Button } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { QueryKeys } from '../Helpers/QueryKeys';
import * as Device from 'expo-device';
import LoadingFooter from '../Components/LoadingFooter';
import MessagesCarrousel from '../Components/MessagesCarrousel';
import NewsItem from '../Components/NewsItem';
import { NoData } from '../Components/NoData';
import TopMainBar from '../Components/TopMainBar';
import WeatherWidget from '../Components/WeatherWidget';
import { queryClient } from '../Configs/QueryClient';
import { AppPermissions, appPermissionsWeb } from '../Helpers/AppPermissions';
import { getData, storeData } from '../Helpers/AsyncStorage';
import { ScreenNames } from '../Helpers/ScreenNames';
import useIncidents from '../hooks/useIncidents';
import { usePendingNews } from '../hooks/useNews';
import { useHasPermissions } from '../hooks/usePermissions';
import { PageInfo } from '../interfaces/IIncident';
import { INews } from '../interfaces/rrhh/INews';
import { WebDrawer } from '../Navigator/WebDrawer';
import { ResetUserData } from '../Redux/actions/auth/loginActions';
import { AuthState } from '../Redux/reducers/auth/loginReducer';
import { RootState } from '../Redux/reducers/rootReducer';
import { GetLastNews } from '../Services/rrhh/News';
import { GetExtraData, SaveToken } from '../Services/User';
import { sentenceCase } from '../Helpers/FormatToSenteceCase';
import * as RootNavigation from '../Navigator/RootNavigation';
import { setExtraData } from '../Redux/reducers/auth/profileSlice';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const getPushToken = () => {
  if (!Device.isDevice) {
    return Promise.reject('Must use physical device for Push Notifications');
  }

  try {
    return Notifications.getPermissionsAsync()
      .then((statusResult) => {
        return statusResult.status !== 'granted' ? Notifications.requestPermissionsAsync() : statusResult;
      })
      .then((statusResult) => {
        if (statusResult.status !== 'granted') {
          throw 'No se ha encontrado el permiso para recibir notificaciones';
        }
        return Notifications.getExpoPushTokenAsync();
      })
      .then((tokenData) => tokenData.data);
  } catch (error) {
    return Promise.reject('No se pudieron verificar los permisos');
  }
};

let notificationsHandler: undefined | ((notification: Notifications.Notification) => void);
const pendingNotifications: Notifications.Notification[] = [];

const notificationReceivedListener = Notifications.addNotificationReceivedListener((notification) => {
  if (notificationsHandler !== undefined) {
    notificationsHandler(notification);
  } else {
    pendingNotifications.push(notification);
  }
});

const notificationResponseReceivedListener = Notifications.addNotificationResponseReceivedListener((response) => {
  if (notificationsHandler !== undefined) {
    notificationsHandler(response.notification);
  } else {
    pendingNotifications.push(response.notification);
  }
});

interface IProps extends NativeStackScreenProps<any, any> {}

export const MainMenuScreen = ({ navigation }: IProps) => {
  const insets = useSafeAreaInsets();
  const profile = useSelector((state: RootState) => state.profile);
  const user: AuthState = useSelector((state: RootState) => state.auth.login);
  // const coords = useSelector((state: RootState) => state.coords);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagedInfo, setPagedInfo] = useState<PageInfo>({
    count: 20,
    totalCount: 20,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
    totalPages: 1,
  });
  const [news, setNews] = useState<INews[]>([]);
  const dispatch = useDispatch();
  const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

  const {
    Reminders: { data: reminders },
  } = useIncidents();

  const BellIcon = (props: any) => <Icon {...props} name="bell-outline" />;
  const LogoutIcon = (props: any) => <Icon {...props} name="log-out-outline" />;

  const { pendingNews, isLoadingPendingNews } = usePendingNews({
    Page: 1,
    Limit: 10,
  });

  const isAuthorizer = useHasPermissions([
    AppPermissions.aprobar_solicitudes,
    AppPermissions.aprobar_asistencia,
    AppPermissions.aprobar_constancia,
    AppPermissions.aprobar_constancia_CBA,
    AppPermissions.aprobar_constancia_TGU,
    AppPermissions.aprobar_acciones_personal,
    AppPermissions.aprobar_planillas,
    AppPermissions.aprobar_vacaciones,
  ]);

  // const renderBackAction = () => <TopNavigationAction icon={BackIcon} />;

  const renderRightActions = () => (
    <>
      <TopNavigationAction
        icon={BellIcon}
        onPress={() => {
          navigation.navigate(ScreenNames.NOTIFICATIONS);
        }}
      />
      <TopNavigationAction icon={LogoutIcon} onPress={() => dispatch(ResetUserData())} />
    </>
  );
  const handleNotificationReceived = (res: any) => {
    const parsed = JSON.parse(res.request.trigger.remoteMessage.data.body);
    if (parsed.ScreenName === ScreenNames.DETAIL_INCIDENT) {
      navigation.navigate(ScreenNames.MAINTENANCE, {
        screen: parsed.ScreenName,
        params: parsed.ScreenParams,
      });
    } else if (parsed.ScreenName === ScreenNames.LIST_REQUESTS) {
      navigation.navigate(ScreenNames.RRHH, { screen: parsed.ScreenName });
    }
  };

  useEffect(() => {
    try {
      notificationsHandler = handleNotificationReceived;

      while (pendingNotifications.length > 0) {
        const pendingNotification = pendingNotifications.pop()!;
        notificationsHandler(pendingNotification);
      }

      notificationListener.current = notificationReceivedListener;

      responseListener.current = notificationResponseReceivedListener;
    } catch (error) {
      console.error(error);
    }

    getPushToken().then(async (pushToken) => {
      // setExpoPushToken(pushToken);
      if (pushToken) {
        const savingResponse = await SaveToken({
          token: pushToken,
          userId: user.employeeId,
        });
        const foundToken = await getData('pushToken');
        if (typeof foundToken !== 'string') {
          if (savingResponse.result) {
            await storeData('pushToken', pushToken);
          }
        }
      }
    });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
    //   console.log(response.notification);
    //   setNotification(response.notification);
    // });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const fetchExtraData = async () => {
    try {
      const res = await GetExtraData();
      if (res.result) {
        dispatch(setExtraData(res.data));
      }
    } catch (error) {
    } finally {
    }
  };

  const fetchNews = async () => {
    try {
      const res = await GetLastNews({
        Page: page,
        Limit: 10,
      });
      if (page > 1) {
        setNews([...news, ...res.rows]);
      } else {
        setNews([...res.rows]);
      }
      setPagedInfo(res.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    fetchNews();
    fetchExtraData();
  }, [page]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await queryClient.refetchQueries([QueryKeys.REMINDERS, QueryKeys.CLINIC_PENDING_APPOINTMENTS]);
    try {
      const res = await GetLastNews({
        Page: 1,
        Limit: 10,
      });
      if (page > 1) {
        setNews([...news, ...res.rows]);
      } else {
        setNews([...res.rows]);
      }
      setPagedInfo(res.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  function findCommonElement(array1, array2) {
    // Loop for array1
    for (let i = 0; i < array1.length; i++) {
      // Loop for array2
      for (let j = 0; j < array2.length; j++) {
        // Compare the element of each and
        // every element from both of the
        // arrays
        if (array1[i] === array2[j]) {
          // Return if common element found
          return true;
        }
      }
    }

    // Return if no common element exist
    return false;
  }

  const renderGreeting = () => (
    <>
      {/* <WeatherWidget /> */}
      <Box mt={3} borderRadius={15} height={200} bg={'#F5F5F5'} shadow="2" flexWrap={'wrap'}>
        <HStack mx={3}>
          <View justifyContent={'center'} m={5}>
            <Image
              size="lg"
              background="#eee"
              borderRadius={'100%'}
              alt="perfil"
              source={{ uri: user.picture }}
              fallbackSource={require('../../assets/persona.png')}
            />
          </View>
          <VStack p={3} justifyContent="center" alignItems="flex-start">
            <Text color="#0077CD" fontSize="md">
              {sentenceCase(user.username)}
            </Text>
            <Text color="#0077CD" bold fontSize={14}>
              {user?.employeePosition ?? ''}
            </Text>
            <HStack justifyContent="space-around">
              <Box
                my={5}
                mr={5}
                // backgroundColor="#000"
                alignItems="flex-start"
                justifyContent="center"
              >
                <VStack alignItems="center" justifyContent="center">
                  <Text color="#0077CD" fontSize={16}>
                    Antiguedad
                  </Text>
                  <Text color="#4BC9E3" bold fontSize={42}>
                    {profile.antiquity}
                    <Text fontSize={18}>a</Text>
                  </Text>
                </VStack>
              </Box>
              <Box
                px={5}
                my={5}
                // backgroundColor="#000"
                borderRightColor="#fff"
                borderRightWidth={1}
                borderLeftWidth={1}
                borderLeftColor="#fff"
                alignItems="center"
                justifyContent="center"
              >
                <VStack alignItems="center" justifyContent="center">
                  <Text color="#0077CD" fontSize={16} mb={3} mt={-3}>
                    {profile.gender === 'F' ? 'Voluntaria' : 'Voluntario'}
                  </Text>
                  {profile.isVolunteer ? (
                    <AntDesign name="checkcircleo" size={42} color="#4BC9E3" />
                  ) : (
                    <AntDesign name="closecircleo" size={42} color="#4BC9E3" />
                  )}
                  {/* <Image size="sm" source={require('../../../assets/persona.png')} /> */}
                </VStack>
              </Box>
              <Box my={5} ml={5} alignItems="center" justifyContent="center">
                <VStack alignItems="center" justifyContent="center">
                  <Text color="#0077CD" fontSize={16}>
                    {profile.gender === 'F' ? 'Colaboradora' : 'Colaborador'}
                  </Text>
                  <Text color="#4BC9E3" bold fontSize={42}>
                    {user.employeeId}
                  </Text>
                </VStack>
              </Box>
            </HStack>
            {/* <HStack
            justifyContent="center"
            alignItems="center"
            pl={5}
            py={5}
          ></HStack> */}
          </VStack>
          <Spacer />
          <VStack p={3} justifyContent="center">
            <Text color="#0077CD" bold fontSize={14}>
              Puntos {profile.points}
              <Image size="xs" source={require('../../assets/fuego.png')} alt="icono fuego" />
            </Text>
            <Pressable
              onPress={() => {
                RootNavigation.navigate(ScreenNames.VIRTUAL_STORE);
              }}
            >
              <HStack>
                <Text color="#0077CD" fontSize="md">
                  Canjea tus{'\n'}puntos aquí{'   '}
                  <AntDesign color={'#0077CD'} size={20} name="rightcircle" />
                </Text>
              </HStack>
            </Pressable>
            {/* {findCommonElement(user.permissions, appPermissionsWeb) && (
              <Pressable
                onPress={() => {
                  var authUser = window.localStorage.getItem('persist:root');
                  if (typeof authUser === 'string') {
                    var parsed = JSON.parse(JSON.parse(authUser)?.auth)?.login;
                    window.open(
                      `http://adminmundodiunsapu.diunsa.hn/login?token=${parsed.token}`
                    );
                  }
                }}
              >
                <Text color='#0077CD' fontSize='md'>
                  Administración{'   '}
                  <AntDesign color={'#0077CD'} size={20} name='rightcircle' />
                </Text>
              </Pressable>
            )} */}
          </VStack>
        </HStack>
      </Box>
      {/* <MessagesCarrousel data={reminders}/> */}
      {news.length > 0 ? (
        <VStack py={3}>
          <HStack justifyContent="space-between" alignItems="center">
            {/* <Pressable
              alignItems="center"
              onPress={() => {
                navigation.navigate(ScreenNames.RRHH, {
                  screen: ScreenNames.HOME_NEWS,
                });
              }}
            >
              <HStack alignItems="center" ml={2}>
                <Feather name="search" size={24} color="black" />
                <Text color="#000" fontSize="md">
                  Buscar
                </Text>
              </HStack>
            </Pressable> */}
            <Text color="#000" fontSize="2xl" alignSelf="center">
              Últimas Noticias
            </Text>
            {pendingNews.info > 0 && (
              <Pressable
                alignItems="center"
                onPress={() => {
                  navigation.navigate(ScreenNames.PENDING_READ_NEWS);
                }}
              >
                <HStack alignItems="center">
                  <Text color="#000" fontSize="md">
                    {pendingNews.info}%
                    <Text color="#000" fontSize="xs">
                      {' '}
                      por leer
                    </Text>
                  </Text>
                  <Feather name="chevron-right" size={24} color="black" />
                </HStack>
              </Pressable>
            )}
          </HStack>
        </VStack>
      ) : news.length === 0 && !isLoading ? (
        <NoData message="No hay noticias por el momento" />
      ) : (
        <></>
      )}
    </>
  );

  const renderItem = (info: ListRenderItemInfo<INews>): React.ReactElement => (
    <NewsItem news={info.item} fromMainMenu={true} />
  );

  return (
    <Box w={'full'} h={'full'}>
      <TopMainBar />
      <HStack
        flex={1}
        backgroundColor="#ECEBEB"
        pb={0}
        style={{
          paddingTop: Platform.OS === 'web' ? undefined : Math.max(insets.top, 16),
        }}
        bg={{
          linearGradient: {
            colors: ['rgba(255,255,255,1)', 'rgba(226, 230, 241, 100)'],
          },
        }}
      >
        {/* <Box
        backgroundColor="#fff"
        w={"25%"}
        borderRightWidth={1}
        borderColor="#D8D8D8"
      >
        <WebDrawer />
      </Box> */}

        <Box backgroundColor="#fff" w={'full'} flex={1}>
          <FlatList
            data={news}
            numColumns={3}
            // extraData={news}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReached={() => {
              if (pagedInfo.currentPage < pagedInfo.totalPages) {
                setPage(page + 1);
              }
            }}
            ListHeaderComponent={renderGreeting}
            renderItem={renderItem}
            ListFooterComponent={<LoadingFooter isLoading={isLoading} message="Cargando últimas noticias" />}
            keyExtractor={(item) => `noticia-home-${item.id}`}
            // onEndReachedThreshold={0.5}
            // ListEmptyComponent={<NoData />}
            _contentContainerStyle={{
              marginX: '5%',
            }}
          />
        </Box>
      </HStack>
    </Box>
  );
};
