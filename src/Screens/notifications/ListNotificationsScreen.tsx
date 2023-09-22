import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import moment from 'moment';
import { Box, Button, Pressable, Text, FlatList, ArrowBackIcon, HStack, VStack } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import SwipeableRow from '../../Components/SwipeableRow';
import { Badge, ListItem } from 'react-native-elements';
import { PageInfo } from '../../interfaces/IIncident';
import { INotification } from '../../interfaces/INotification';
import { DeleteNotification, GetNotifications, UpdateStatus } from '../../Services/Notifications';
import { NoData } from '../../Components/NoData';
import { ScreenNames } from '../../Helpers/ScreenNames';
import { Loading } from '../../Components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications } from '../../Redux/reducers/notifications/notificationsSlice';
import { RootState } from '../../Redux/reducers/rootReducer';

interface IProps extends NativeStackScreenProps<any, any> {}

const ListNotificationsScreen = ({ navigation }: IProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pagedInfo, setPagedInfo] = useState<PageInfo>({
    count: 20,
    totalCount: 20,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
    totalPages: 1,
  });
  const [startNormalDate, setStartNormalDate] = useState(new Date());
  const [endNormalDate, setEndNormalDate] = useState(new Date());
  const [startDate, setStartDate] = useState(moment().startOf('month'));
  const [endDate, setEndDate] = useState(moment());
  const [search, setSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [notifications, setNotifications] = useState<INotification[]>([]);
  const notifications: INotification[] = useSelector((state: RootState) => state.notifications.notifications);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const res = await GetNotifications({
        Page: page,
        Limit: 10,
        StartDate: startDate.format('YYYY-MM-DD'),
        EndDate: endDate.format('YYYY-MM-DD'),
      });
      if (page > 1) {
        dispatch(setNotifications([...notifications, ...res.rows]));
        // setNotifications([...notifications, ...res.rows]);
      } else {
        dispatch(setNotifications([...res.rows]));
        // setNotifications([...res.rows]);
      }
      setPagedInfo(res.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    // setNotifications([]);
    dispatch(setNotifications([]));

    try {
      const res = await GetNotifications({
        Page: 1,
        Limit: 10,
        StartDate: startDate.format('YYYY-MM-DD'),
        EndDate: endDate.format('YYYY-MM-DD'),
      });
      // console.log(res);
      dispatch(setNotifications([...res.rows]));

      setPagedInfo(res.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const deleteNotification = async (notificationId: number) => {
    const res = await DeleteNotification(notificationId);
    const newData = [...notifications];
    const prevIndex = notifications.findIndex((item) => item.id === notificationId);
    newData.splice(prevIndex, 1);
    setNotifications(newData);
  };

  useEffect(() => {
    setStartDate(moment(startNormalDate));
    setEndDate(moment(endNormalDate));
  }, [startNormalDate, endNormalDate]);

  useEffect(() => {
    setIsLoading(true);
    fetchRequests();
  }, [search, page]);

  //   useEffect(
  //     () =>
  //       navigation.addListener('beforeRemove', (e) => {
  //         e.preventDefault();

  //         navigation.navigate(ScreenNames.MAIN_MENU);
  //       }),
  //     [navigation]
  //   );

  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction
        icon={<ArrowBackIcon size="4" />}
        onPress={() => navigation.navigate(ScreenNames.MAIN_MENU)}
      />
      {/* <TopNavigationAction icon={MenuIcon} onPress={() => navigation.toggleDrawer()} /> */}
      {/* <Button
        onPress={() => {
          //  onOpen();
        }}
        disabled={isLoading}
        variant="ghost"
        _pressed={{ bg: 'coolGray.100' }}
        endIcon={<MaterialIcons name="arrow-drop-down" size={24} color="black" />}
      >
        <Text color="coolGray.700" fontWeight="bold">
          Filtros
        </Text>
        <Text color="coolGray.700" fontWeight="bold">
          Anuncios
        </Text>
      </Button> */}
    </Box>
  );

  interface IRenderItemProps {
    item: INotification;
  }

  const renderItem = ({ item }: IRenderItemProps) => {
    return (
      <ListItem.Swipeable
        //   leftContent={
        //     <Button
        //       variant="solid"
        //       colorScheme="blue"
        //       size="lg"
        //       h="100%"
        //       borderRadius={0}
        //       onPress={() => {}}
        //       //  disabled={comentario.trim() === '' || isApproving}
        //     >
        //       Leido
        //     </Button>
        //   }
        leftStyle={{ width: 0 }}
        leftContent={undefined}
        rightContent={
          <Button
            variant="solid"
            colorScheme="red"
            size="lg"
            h="90%"
            mb={3}
            borderRadius={0}
            onPress={() => {
              deleteNotification(item.id);
            }}
            style={{ marginBottom: 2 }}
            //  disabled={comentario.trim() === '' || isApproving}
          >
            Eliminar
          </Button>
        }
        style={{
          borderColor: '#000',
          // borderWidth: 1,
          marginBottom: 2,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,

          elevation: 2,
        }}
        onPress={async () => {
          if (item.screenName === ScreenNames.DETAIL_INCIDENT) {
            navigation.navigate(ScreenNames.MAINTENANCE, {
              screen: item.screenName,
              params: { incidentId: item.intScreenParam },
            });
          } else if (item.screenName === ScreenNames.LIST_REQUESTS) {
            navigation.navigate(ScreenNames.RRHH, { screen: item.screenName });
          }
          const res = await UpdateStatus({ id: item.id, read: true });
        }}
      >
        <ListItem.Content>
          <HStack space={5} justifyContent="space-between" alignItems="center" w="100%">
            <VStack>
              <ListItem.Title>{item.title}</ListItem.Title>
              <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
            </VStack>
            <VStack>
              <HStack justifyContent="center" alignItems="center">
                {!item.read ? <Badge status="primary" /> : null}
                <Text
                  pl={2}
                  fontSize="12"
                  color="gray.700"
                  _dark={{
                    color: 'gray.300',
                  }}
                >
                  {moment(item.createdAt).fromNow()}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </ListItem.Content>
      </ListItem.Swipeable>
    );
  };

  return (
    <Box safeArea flex={1} backgroundColor="#fff">
      <TopNavigation
        alignment="center"
        title="Notificaciones"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
        // accessoryRight={renderRightActions}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={onRefresh}
          onEndReached={() => {
            if (pagedInfo.currentPage < pagedInfo.totalPages) {
              setPage(page + 1);
            }
          }}
          refreshing={refreshing}
          ListEmptyComponent={<NoData message="No hay notificaciones por el momento" />}
        />
      )}
      {/* <SwipeableRow listDatum={notifications} /> */}
    </Box>
  );
};

export default ListNotificationsScreen;
