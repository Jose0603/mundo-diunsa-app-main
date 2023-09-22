import {
  AntDesign,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import moment from "moment";
import {
  Box,
  CheckIcon,
  FlatList,
  HStack,
  Icon,
  Image,
  Modal,
  Pressable,
  Select,
  Text,
  VStack,
} from "native-base";
import React, { ReactElement, useEffect, useState } from "react";
import { Dimensions, Platform, TouchableOpacity, View } from "react-native";
import { Badge } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { ResetUserData } from "../Redux/actions/auth/loginActions";

import { ScreenNames } from "../Helpers/ScreenNames";
import useIsMountedRef from "../hooks/useIsMountedRef";
import { PageInfo } from "../interfaces/IIncident";
import { INotification } from "../interfaces/INotification";
import * as RootNavigation from "../Navigator/RootNavigation";
import { setProfile } from "../Redux/reducers/auth/profileSlice";
import {
  deleteAllNotifications,
  setNotifications,
} from "../Redux/reducers/notifications/notificationsSlice";
import { RootState } from "../Redux/reducers/rootReducer";
import {
  DeleteAllNotifications,
  GetNotifications,
} from "../Services/Notifications";
import { getMyPoints } from "../Services/User";
import Dropdown from "./DropDown";
import useIncidents from "../hooks/useIncidents";
import { IOption } from "../interfaces/shared/IOption";
import { AuthState } from "../Redux/reducers/auth/loginReducer";
import { appPermissionsWeb } from "../Helpers/AppPermissions";

interface IProps {
  showIconBadge?: boolean;
  showMenu?: boolean;
  showBack?: boolean;
  backToNews?: boolean;
}

const TopMainBar = ({
  showIconBadge = false,
  showMenu = true,
  showBack = false,
  backToNews = false,
}: IProps) => {
  const user: AuthState = useSelector((state: RootState) => state.auth.login);
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
  const [startDate, setStartDate] = useState(moment().startOf("month"));
  const [endDate, setEndDate] = useState(moment());
  const dispatch = useDispatch();
  const notifications: INotification[] = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const profile = useSelector((state: RootState) => state.profile);
  const isMounted = useIsMountedRef().current;
  const [posSol, setPosSol] = useState(undefined);
  const [posCon, setPosCon] = useState(undefined);
  const [posNot, setPosNot] = useState(undefined);
  const [posBell, setPosBell] = useState(undefined);
  const [posEva, setPosEva] = useState(undefined);
  const {
    NewsCategoies: { data: newsCategoies },
  } = useIncidents();

  const data = newsCategoies?.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    } as IOption;
  });

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

  const fetchPoints = async () => {
    if (profile.points === 0) {
      try {
        const res = await getMyPoints();
        if (res.result && isMounted) {
          dispatch(setProfile(res.data.points));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchPoints();
  }, []);

  const renderNotification = ({ item }: any) => {
    return (
      <HStack
        bg="#fff"
        mb={2}
        borderRadius={10}
        p={2}
        alignItems="center"
        w="100%"
      >
        <Image
          size="xs"
          source={require("../../assets/fuego.png")}
          alt="notificacion"
        />
        <Text maxWidth="85%">{item.description}</Text>
      </HStack>
    );
  };

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

  return (
    <>
      <HStack
        justifyContent={"space-between"}
        alignItems="center"
        py={4}
        bgColor="rgba(251, 251, 251, 0.5)"
      >
        <HStack alignItems="center" ml={5}>
          <Image
            source={require("../../assets/logo_app.png")}
            fallbackSource={require("../../assets/logo_app.png")}
            alt="Logo Diunsa"
            // size="lg"
            height={35}
            width={100}
            ml={2}
          />
        </HStack>
        {/* {Dimensions.get("window").width > 870 ? ( */}
        <HStack justifyContent="space-between" alignItems="center" mr={3}>
          <Pressable
            key={1}
            mr={8}
            onPress={() => {
              RootNavigation.navigate(ScreenNames.MAIN_MENU);
            }}
          >
            <Text alignSelf="flex-end" pl={1}>
              Inicio
            </Text>
          </Pressable>
          <Pressable
            key={2}
            mr={8}
            onLayout={(event) => {
              setPosSol(event.nativeEvent.layout);
            }}
          >
            <Dropdown
              label="Solicitudes"
              data={{}}
              position={posSol}
              content={1}
            />
          </Pressable>
          <Pressable
            key={3}
            mr={8}
            onLayout={(event) => {
              setPosCon(event.nativeEvent.layout);
            }}
          >
            <Dropdown
              label="Consultas"
              data={{}}
              position={posCon}
              content={2}
            />
          </Pressable>
          <Pressable
            key={4}
            mr={8}
            onLayout={(event) => {
              setPosNot(event.nativeEvent.layout);
            }}
          >
            <Dropdown
              label="Noticias"
              data={newsCategoies}
              position={posNot}
              content={3}
            />
          </Pressable>
          <Pressable
            key={5}
            mr={8}
            onLayout={(event) => {
              setPosEva(event.nativeEvent.layout);
            }}
          >
            <Dropdown
              label="Evaluaciones"
              data={{}}
              position={posEva}
              content={5}
            />
          </Pressable>
          <Pressable
            key={6}
            mr={findCommonElement(user.permissions, appPermissionsWeb) ? 8 : 0}
            onPress={() => {
              RootNavigation.navigate(ScreenNames.VIRTUAL_STORE);
            }}
          >
            <Text alignSelf="flex-end" pl={1}>
              Canjeo de{"\n"}puntos{"  "}
              <SimpleLineIcons name="diamond" size={15} color="black" />
            </Text>
          </Pressable>
          {findCommonElement(user.permissions, appPermissionsWeb) && (
            <Pressable
              key={7}
              onPress={() => {
                var authUser = window.localStorage.getItem("persist:root");
                if (typeof authUser === "string") {
                  var parsed = JSON.parse(JSON.parse(authUser)?.auth)?.login;
                  window.open(
                    `https://adminmundodiunsa.diunsa.hn/login?token=${parsed.token}`
                  );
                }
              }}
            >
              <HStack flexDirection={"row"} alignItems={"center"}>
                <Text alignSelf="flex-end">Administración MND</Text>
              </HStack>
            </Pressable>
          )}

          <Box
            borderRightWidth={2}
            mx={2}
            px={5}
            onLayout={(event) => {
              setPosBell(event.nativeEvent.layout);
            }}
          >
            <Pressable mx={5} key={8}>
              {/* <Fontisto
                  name="bell"
                  size={26}
                  color="black"
                  onPress={() => {
                    RootNavigation.navigate(ScreenNames.NOTIFICATIONS_MODAL);
                  }}
                /> */}
              <Dropdown label={""} data={{}} position={posBell} content={4} />
              {notifications?.length > 0 && (
                <Badge
                  status="error"
                  containerStyle={{ position: "absolute", top: 0, left: 20 }}
                />
              )}
            </Pressable>
          </Box>
          <Pressable
            key={9}
            mr={8}
            ml={3}
            onPress={() => {
              dispatch(ResetUserData());
            }}
          >
            <Text alignSelf="flex-end" pl={1}>
              <Icon
                as={Ionicons}
                color={"black"}
                size={5}
                name="md-exit-outline"
              />
              {"  "}Cerrar sesión
            </Text>
          </Pressable>
        </HStack>
        {/* ) : (
          <Text>Hamburger</Text>
        )} */}
      </HStack>
    </>
  );
};

export default TopMainBar;
