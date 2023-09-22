import { Fontisto, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import moment from 'moment';
import { Box, FlatList, HStack, Image, Modal, Pressable, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Badge } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';

import { ScreenNames } from '../Helpers/ScreenNames';
import useIsMountedRef from '../hooks/useIsMountedRef';
import { PageInfo } from '../interfaces/IIncident';
import { INotification } from '../interfaces/INotification';
import * as RootNavigation from '../Navigator/RootNavigation';
import { setProfile } from '../Redux/reducers/auth/profileSlice';
import { deleteAllNotifications, setNotifications } from '../Redux/reducers/notifications/notificationsSlice';
import { RootState } from '../Redux/reducers/rootReducer';
import { DeleteAllNotifications, GetNotifications } from '../Services/Notifications';
import { getMyPoints } from '../Services/User';

interface IProps {
  showIconBadge?: boolean;
  showMenu?: boolean;
  showBack?: boolean;
  backToNews?: boolean;
}

const TopMainBar = ({ showIconBadge = false, showMenu = true, showBack = false, backToNews = false }: IProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [startDate, setStartDate] = useState(moment().startOf('month'));
  const [endDate, setEndDate] = useState(moment());
  const dispatch = useDispatch();
  const notifications: INotification[] = useSelector((state: RootState) => state.notifications.notifications);
  const profile = useSelector((state: RootState) => state.profile);
  const isMounted = useIsMountedRef().current;

  const deleteAll = async () => {
    try {
      const res = await DeleteAllNotifications();
      if (res.result) {
        dispatch(deleteAllNotifications());
        setShowModal(false);
      }
    } catch (error) {
    } finally {
    }
  };

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

  const fetchPoints = async () => {
    try {
      const res = await getMyPoints();
      if (res.result && isMounted) {
        dispatch(setProfile(res.data.points));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchPoints();
  }, []);

  const renderNotification = ({ item }: any) => {
    return (
      <HStack bg="#fff" mb={2} borderRadius={10} p={2} alignItems="center" w="100%">
        <Image size="xs" source={require('../../assets/fuego.png')} />
        <Text maxWidth="85%">{item.description}</Text>
      </HStack>
    );
  };

  return (
    <>
      <HStack
        // justifyContent={Platform.OS !== 'web' ? 'space-between' : 'flex-end'}
        justifyContent={'space-between'}
        alignItems="center"
        py={4}
        bgColor="#fff"
      >
        <HStack alignItems="center" ml={5}>
          {showMenu && Platform.OS !== 'web' && (
            <SimpleLineIcons name="menu" size={24} color="black" onPress={() => RootNavigation.toggleDrawer()} />
          )}
          {showBack && (
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color="black"
              onPress={() => {
                // if (backToNews) {
                //   RootNavigation.navigate(ScreenNames.HOME_NEWS);
                // }else
                // {
                // }
                RootNavigation.goBack();
              }}
            />
          )}
          {Platform.OS !== 'web' && (
            <Image
              source={require('../../assets/logo_app.png')}
              fallbackSource={require('../../assets/logo_app.png')}
              alt="Logo Diunsa"
              // size="lg"
              height={35}
              width={100}
              ml={2}
            />
          )}
        </HStack>

        <HStack justifyContent="space-between" alignItems="center" mr={3}>
          <Pressable
            onPress={() => {
              RootNavigation.navigate(ScreenNames.VIRTUAL_STORE);
            }}
          >
            <HStack pr={5}>
              <SimpleLineIcons name="diamond" size={26} color="black" />
              <Text alignSelf="flex-end" pl={1}>
                {profile.points} 🔥
              </Text>
            </HStack>
          </Pressable>
          <Box>
            <Fontisto
              name="bell"
              size={26}
              color="black"
              onPress={() => {
                RootNavigation.navigate(ScreenNames.NOTIFICATIONS_MODAL);
                // setShowModal(true);
              }}
            />
            {notifications?.length > 0 && (
              <Badge status="error" containerStyle={{ position: 'absolute', top: 0, left: 20 }} />
            )}
          </Box>
          {/* <Pressable
            onPress={() => {
              RootNavigation.navigate(ScreenNames.USER_PROFILE);
            }}
          >
            <Image
              source={require('../../assets/profile-user.png')}
              fallbackSource={require('../../assets/profile-user.png')}
              alt="usuario"
              size="xs"
              borderRadius="full"
              ml={5}
            />
          </Pressable> */}
        </HStack>
      </HStack>
      {/* <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="xl">
        <Modal.Content maxWidth="400px" bg={colors.primary}>
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0}>
            <Box alignItems="center" justifyContent="center">
              <Text color="#fff" bold fontSize={18}>
                Notificaciones
              </Text>
            </Box>
          </Modal.Header>
          <Modal.Body>
            {isLoading ? (
              <Loading />
            ) : (
              <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item, i) => i.toString()}
                onRefresh={onRefresh}
                onEndReached={() => {
                  if (pagedInfo.currentPage < pagedInfo.totalPages) {
                    setPage(page + 1);
                  }
                }}
                refreshing={refreshing}
                ListEmptyComponent={
                  <Box justifyContent="center" alignItems="center">
                    <Text color="#fff" fontSize={18}>
                      No hay notificaciones por el momento
                    </Text>
                  </Box>
                }
              />
            )}
          </Modal.Body>
          <Modal.Footer bg={colors.primary} alignItems="center" justifyContent="center">
            {notifications.length > 0 && (
              <Button
                onPress={async () => {
                  await deleteAll();
                }}
                bg="transparent"
              >
                Borrar Notificaciones
              </Button>
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal> */}
    </>
  );
};

export default TopMainBar;
