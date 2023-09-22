import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  Box,
  FlatList,
  HStack,
  Image,
  Modal,
  Button,
  Center,
  VStack,
  Pressable,
} from "native-base";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { CustomIcon } from "../Components/CustomIcon";
import { INotification } from "../interfaces/INotification";
import { PageInfo } from "../interfaces/IIncident";
import { RootState } from "../Redux/reducers/rootReducer";
import {
  DeleteAllNotifications,
  GetNotifications,
} from "../Services/Notifications";
import {
  deleteAllNotifications,
  setNotifications,
} from "../Redux/reducers/notifications/notificationsSlice";
import { Loading } from "../Components/Loading";
import { ScreenNames } from "../Helpers/ScreenNames";
import * as RootNavigation from "../Navigator/RootNavigation";

const BackIcon = (props: any) => (
  <CustomIcon {...props} iconName="arrow-back" />
);

export const NotificationsModal = ({ navigation }: any) => {
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
  const [startNormalDate, setStartNormalDate] = useState(new Date());
  const [endNormalDate, setEndNormalDate] = useState(new Date());
  const [startDate, setStartDate] = useState(moment().startOf("month"));
  const [endDate, setEndDate] = useState(moment());
  const dispatch = useDispatch();
  const notifications: INotification[] = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const deleteAll = async () => {
    try {
      const res = await DeleteAllNotifications();
      console.log(res);
      if (res.result) {
        dispatch(deleteAllNotifications());
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
        StartDate: startDate.format("YYYY-MM-DD"),
        EndDate: endDate.format("YYYY-MM-DD"),
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
        StartDate: startDate.format("YYYY-MM-DD"),
        EndDate: endDate.format("YYYY-MM-DD"),
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

  useEffect(() => {
    fetchRequests();
  }, [page]);

  const renderNotification = ({ item }: any) => {
    return (
      <Pressable
        onPress={() => {
          if (
            item.screenName === ScreenNames.LIST_PENDING_APPROVAL_REQUESTS ||
            item.screenName === ScreenNames.LIST_REQUESTS
          ) {
            RootNavigation.navigate(ScreenNames.MAIN, {
              screen: ScreenNames.RRHH,
              params: {
                screen: item.screenName,
              },
            });
          } else if (item.screenName === ScreenNames.NEWS_DETAIL_STACK) {
            RootNavigation.navigate(ScreenNames.NEWS_DETAIL_STACK, {
              news: null,
              newsId: item.intScreenParam,
            });
          } else if (item.screenName === ScreenNames.WEBVIEWSCREEN) {
            RootNavigation.navigate(ScreenNames.RRHH, {
              screen: ScreenNames.WEBVIEWSCREEN,
              params: {
                url: item.stringScreenParam,
              },
            });
          }
        }}
      >
        <HStack
          bg="#fff"
          mb={2}
          borderRadius={10}
          mx={5}
          p={2}
          alignItems="center"
        >
          <Image size="xs" source={require("../../assets/fuego.png")} alt="notificacion"/>
          <VStack maxWidth="85%">
            <Text bold>{item.title}</Text>
            <Text>{item.description}</Text>
          </VStack>
        </HStack>
      </Pressable>
    );
  };

  return (
    <Box flex={1} safeArea>
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
            <Center>
              <Text color="#fff" fontSize={18}>
                No hay notificaciones por el momento
              </Text>
            </Center>
          }
          ListHeaderComponent={
            <Box alignItems="center" justifyContent="center">
              <Text color="#fff" bold fontSize={18}>
                Notificaciones
              </Text>
            </Box>
          }
          ListHeaderComponentStyle={{
            marginVertical: 20,
          }}
          ListFooterComponent={
            <>
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
            </>
          }
        />
      )}
    </Box>
  );

  // return (
  //   <Modal isOpen={true} size="xl">
  //     <Modal.Content maxWidth="400px" bg={colors.primary}>
  //       <Modal.CloseButton />
  //       <Modal.Header borderBottomWidth={0}>
  //         <Box alignItems="center" justifyContent="center">
  //           <Text color="#fff" bold fontSize={18}>
  //             Notificaciones
  //           </Text>
  //         </Box>
  //       </Modal.Header>
  //       <Modal.Body>
  //         {isLoading ? (
  //           <Loading />
  //         ) : (
  //           <FlatList
  //             data={notifications}
  //             renderItem={renderNotification}
  //             keyExtractor={(item, i) => i.toString()}
  //             // onRefresh={onRefresh}
  //             onEndReached={() => {
  //               if (pagedInfo.currentPage < pagedInfo.totalPages) {
  //                 setPage(page + 1);
  //               }
  //             }}
  //             refreshing={refreshing}
  //             ListEmptyComponent={
  //               <Box justifyContent="center" alignItems="center">
  //                 <Text color="#fff" fontSize={18}>
  //                   No hay notificaciones por el momento
  //                 </Text>
  //               </Box>
  //             }
  //           />
  //         )}
  //       </Modal.Body>
  //       <Modal.Footer bg={colors.primary} alignItems="center" justifyContent="center">
  //         {notifications.length > 0 && (
  //           <Button
  //             onPress={async () => {
  //               await deleteAll();
  //             }}
  //             bg="transparent"
  //           >
  //             Borrar Notificaciones
  //           </Button>
  //         )}
  //       </Modal.Footer>
  //     </Modal.Content>
  //   </Modal>
  // );
};
