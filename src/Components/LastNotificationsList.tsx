import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  FlatList,
  HStack,
  Text,
  VStack,
  Badge as NBBadge,
  Pressable,
  ChevronRightIcon,
} from "native-base";
import { Badge } from "react-native-elements";
import { INotification } from "../interfaces/INotification";
import moment from "moment";
import { GetLastNotifications, UpdateStatus } from "../Services/Notifications";
import { NoData } from "./NoData";
import * as RootNavigation from "../Navigator/RootNavigation";
import { ScreenNames } from "../Helpers/ScreenNames";
import { Loading } from "./Loading";
import { colors } from "../Helpers/Colors";

interface IRenderItemProps {
  item: INotification;
}
const LastNotificationsList = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await GetLastNotifications();
      setNotifications([...res]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRequests();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchRequests();
  }, []);

  const renderItem = ({ item }: IRenderItemProps) => {
    return (
      <Pressable
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p={2}
        onPress={async () => {
          if (item.screenName === ScreenNames.DETAIL_INCIDENT) {
            RootNavigation.navigate(ScreenNames.MAINTENANCE, {
              screen: item.screenName,
              params: { incidentId: item.intScreenParam },
            });
          } else if (item.screenName === ScreenNames.LIST_REQUESTS) {
            RootNavigation.navigate(ScreenNames.RRHH, {
              screen: item.screenName,
            });
          }
          if (!item.read) {
            const res = await UpdateStatus({ id: item.id, read: true });
            // console.log(res);
          }
        }}
        borderBottomWidth={1}
        borderBottomColor={"#eee"}
      >
        <VStack>
          <Text
            bold
            pl={2}
            fontSize="12"
            color="gray.700"
            _dark={{
              color: "gray.300",
            }}
          >
            {item.title}
          </Text>
          <Text
            pl={2}
            fontSize="12"
            color="gray.700"
            _dark={{
              color: "gray.300",
            }}
          >
            {item.description}
          </Text>
        </VStack>
        <VStack>
          <HStack justifyContent="center" alignItems="center">
            {!item.read ? <Badge status="primary" /> : null}
            <Text
              pl={2}
              fontSize="12"
              color="gray.700"
              _dark={{
                color: "gray.300",
              }}
            >
              {moment(item.createdAt).fromNow()}
            </Text>
          </HStack>
        </VStack>
      </Pressable>
    );
  };

  return (
    <Box p={5}>
      <HStack justifyContent="space-between" alignItems="center">
        <Text color="coolGray.600" fontWeight="bold" fontSize="18">
          🔔 Últimas Notificaciones
        </Text>
        <Pressable
          bg={colors.secondary}
          rounded="lg"
          justifyContent="center"
          alignItems="center"
          p={1}
          onPress={() => {
            RootNavigation.navigate(ScreenNames.NOTIFICATIONS);
          }}
        >
          <HStack alignItems="center">
            <Text pl={2} color="#fff" fontSize={12}>
              Ver todo
            </Text>
            <ChevronRightIcon color="#fff" />
          </HStack>
        </Pressable>
      </HStack>
      {isLoading ? (
        <Box justifyContent="center" alignItems="center">
          <Loading isFlex={false} />
        </Box>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <NoData message="No hay notificaciones por el momento" />
          }
        />
      )}
      {!isLoading && notifications.length > 0 && (
        <Pressable
          rounded="lg"
          justifyContent="center"
          alignItems="center"
          p={1}
          onPress={() => {
            RootNavigation.navigate(ScreenNames.NOTIFICATIONS);
          }}
        >
          <HStack alignItems="center">
            <Text pl={2} color="#000">
              Ver todo
            </Text>
            <ChevronRightIcon color="#000" />
          </HStack>
        </Pressable>
      )}
    </Box>
  );
};

export default LastNotificationsList;
