import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Box, FlatList, HStack, Pressable, ScrollView, Text, VStack } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import ClinicQueue from '../Components/ClinicQueue';
import LoadingFooter from '../Components/LoadingFooter';
import MessagesCarrousel from '../Components/MessagesCarrousel';
import NewsItem from '../Components/NewsItem';
import { NoData } from '../Components/NoData';
import TopMainBar from '../Components/TopMainBar';
import WeatherWidget from '../Components/WeatherWidget';
import { queryClient } from '../Configs/QueryClient';
import { getData, storeData } from '../Helpers/AsyncStorage';
import { colors } from '../Helpers/Colors';
import { QueryKeys } from '../Helpers/QueryKeys';
import { ScreenNames } from '../Helpers/ScreenNames';
import useIncidents from '../hooks/useIncidents';
import { usePendingNews } from '../hooks/useNews';
import { PageInfo } from '../interfaces/IIncident';
import { INews } from '../interfaces/rrhh/INews';
import { AuthState } from '../Redux/reducers/auth/loginReducer';
import { RootState } from '../Redux/reducers/rootReducer';
import { GetLastNews } from '../Services/rrhh/News';
import { SaveToken } from '../Services/User';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

Notifications.setNotificationChannelAsync('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: colors.secondary,
});

interface IProps extends NativeStackScreenProps<any, any> {}

export const MainMenuScreen = ({ navigation }: IProps) => {
  const insets = useSafeAreaInsets();
  const user: AuthState = useSelector((state: RootState) => state.auth.login);
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

  const {
    Reminders: { data: reminders },
  } = useIncidents();

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

  const { pendingNews, isLoadingPendingNews } = usePendingNews({
    Page: 1,
    Limit: 10,
  });

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

    const getPushToken = async () => {
      if (!Device.isDevice) {
        return Promise.reject('Must use physical device for Push Notifications');
      }

      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          console.log('🚀 ~ file: MainMenuScreen.native.tsx:50 ~ getPushToken ~ status:', status);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        return token;
      } catch (error) {
        return Promise.reject('No se pudieron verificar los permisos');
      }
    };

    getPushToken()
      .then(async (pushToken) => {
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
      })
      .catch((err) => {
        console.log('Ocurrio un error', err);
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
  }, [page]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries([QueryKeys.REMINDERS]);
    await queryClient.invalidateQueries([QueryKeys.CLINIC_PENDING_APPOINTMENTS]);
    setPage(1);
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

  const renderGreeting = () => (
    <>
      <WeatherWidget />
      <Box mx={3} mt={3}>
        <ClinicQueue />
      </Box>
      <MessagesCarrousel data={reminders ?? []} />
      {news.length > 0 ? (
        <VStack py={3}>
          <Box alignItems="center" justifyContent="center">
            <Text color="#000" fontSize="xl" alignSelf="center">
              Últimas Noticias
            </Text>
          </Box>
          <HStack justifyContent="space-between" alignItems="center" mt={2}>
            <Pressable
              alignItems="center"
              onPress={() => {
                navigation.navigate(ScreenNames.RRHH, {
                  screen: ScreenNames.HOME_NEWS,
                });
              }}
            >
              <HStack alignItems="center" ml={5}>
                <Feather name="search" size={24} color="black" />
                <Text color="#000" fontSize="sm">
                  Buscar
                </Text>
              </HStack>
            </Pressable>
            {pendingNews.info > 0 && (
              <Pressable
                alignItems="center"
                onPress={() => {
                  navigation.navigate(ScreenNames.PENDING_READ_NEWS);
                }}
                mr={2}
              >
                <HStack alignItems="center">
                  <Text color="#000" fontSize="sm">
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
    <Box
      flex={1}
      backgroundColor="#fff"
      pb={0}
      style={{ paddingTop: Math.max(insets.top, 16) }}
      bg={{
        linearGradient: {
          colors: ['rgba(255,255,255,1)', 'rgba(226, 230, 241, 100)'],
        },
      }}
    >
      <TopMainBar showMenu={false} />
      {/* <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {renderGreeting()}
        <FlatList
          data={news}
          // onRefresh={onRefresh}
          // refreshing={refreshing}
          onEndReached={() => {
            if (pagedInfo.currentPage < pagedInfo.totalPages) {
              setPage(page + 1);
            }
          }}
          // ListHeaderComponent={renderGreeting}
          renderItem={renderItem}
          ListFooterComponent={<LoadingFooter isLoading={isLoading} message="Cargando últimas noticias" />}
          keyExtractor={(item) => `noticia-home${Math.random() * 100}-${item.id}`}
          onEndReachedThreshold={2}
        />
      </ScrollView> */}
      <FlatList
        data={news}
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
        keyExtractor={(item) => `noticia-home${Math.random() * 100}-${item.id}`}
        onEndReachedThreshold={0.5}
      />
    </Box>
  );
};
