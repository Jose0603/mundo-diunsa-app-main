import moment from "moment";
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Image,
  Modal,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CustomIcon } from "../Components/CustomIcon";
import { Loading } from "../Components/Loading";
import { ScreenNames } from "../Helpers/ScreenNames";
import { PageInfo } from "../interfaces/IIncident";
import { INotification } from "../interfaces/INotification";
import * as RootNavigation from "../Navigator/RootNavigation";
import { WebDrawer } from "../Navigator/WebDrawer";
import {
  deleteAllNotifications,
  setNotifications,
} from "../Redux/reducers/notifications/notificationsSlice";
import { RootState } from "../Redux/reducers/rootReducer";
import {
  DeleteAllNotifications,
  GetNotifications,
} from "../Services/Notifications";

const BackIcon = (props: any) => (
  <CustomIcon {...props} iconName="arrow-back" />
);

export const NotificationsModal = ({ navigation, setVisible }: any) => {
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
          setVisible(false);
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
            const aElement = document.createElement("a");
            aElement.href = item.stringScreenParam;
            aElement.setAttribute("target", "_blank");
            aElement.click();
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
          <Image size="xs" source={require("../../assets/fuego.png")} />
          <VStack maxWidth="85%">
            <Text bold fontSize="xs">
              {item.title}
            </Text>
            <Text fontSize="xs">{item.description}</Text>
          </VStack>
        </HStack>
      </Pressable>
    );
  };

  return (
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
          <Text fontSize="sm">No hay notificaciones por el momento</Text>
        </Center>
      }
      ListHeaderComponent={
        <Box alignItems="center" justifyContent="center">
          <Text bold fontSize="sm">
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
              mb={5}
              // bg="transparent"
            >
              Borrar Notificaciones
            </Button>
          )}
        </>
      }
    />
  );
};
