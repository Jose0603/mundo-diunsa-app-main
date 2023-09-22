import { MaterialIcons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import moment from 'moment';
import {
  AddIcon,
  Badge,
  Box,
  Button,
  CheckIcon,
  Divider,
  Fab,
  FlatList,
  HStack,
  PresenceTransition,
  Pressable,
  Select,
  Spacer,
  Text,
  useDisclose,
  VStack,
} from 'native-base';
import { useToast } from 'native-base';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { RefreshControl } from 'react-native';

import { ActionSheet } from '../../Components/ActionSheet';
import { Loading } from '../../Components/Loading';
import { NoData } from '../../Components/NoData';
import { getTicketStatus } from '../../Helpers/GetTicketStatus';
import { getTicketPriority } from '../../Helpers/Priorities';
import { ScreenNames } from '../../Helpers/ScreenNames';
import useIncidents from '../../hooks/useIncidents';
import { IIncident, PageInfo } from '../../interfaces/IIncident';
import { GetIncidents } from '../../Services/incidents/Incidents';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const HomeIncidentsScreen = ({ navigation }: IProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pagedInfo, setPagedInfo] = useState<PageInfo>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setselectedStatus] = useState<number>(-1);
  const [incidents, setIncidents] = useState<IIncident[]>([]);
  const [subCategory, setSubCategory] = useState<number>(-1);
  const { isOpen, onOpen, onClose } = useDisclose();

  // const {
  //   isLoading,
  //   isError,
  //   error,
  //   data: incidents,
  //   isFetching,
  //   isPreviousData,
  // } = useQuery(
  //   [QueryKeys.INCIDENTS, page, selectedStatus, subCategory],
  //   () => GetIncidents({ Page: page, Status: selectedStatus, Limit: 20, SubCategory: subCategory }),
  //   { keepPreviousData: true }
  // );

  const fetchIncidents = async () => {
    try {
      const res = await GetIncidents({ Page: page, Status: selectedStatus, Limit: 20, SubCategory: subCategory });
      if (page > 1) {
        setIncidents([...incidents, ...res.rows]);
      } else {
        setIncidents([...res.rows]);
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
    // setIsLoading(true);
    setPage(1);
    // setIncidents([]);
    try {
      const res = await GetIncidents({ Page: 1, Status: selectedStatus, Limit: 20, SubCategory: subCategory });
      setIncidents(res.rows);
      setPagedInfo(res.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      // setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedStatus, subCategory, page]);

  useEffect(() => {
    setIsLoading(true);
    fetchIncidents();
  }, [selectedStatus, subCategory, page]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      if (isActive) {
        setIsLoading(true);
        fetchIncidents();
      }
      return () => {
        isActive = false;
      };
    }, [])
  );

  const navigate = (screen: string) => {
    navigation.navigate(screen);
  };

  // const take = async () => {
  //   try {
  //     const res = await captureRef(imageView, {
  //       result: 'tmpfile',
  //       height: pixels,
  //       width: pixels,
  //       quality: 1,
  //       format: 'jpg',
  //     });
  //     console.log(res);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const MenuIcon = (props: any) => <Icon {...props} name="menu-2-outline" />;

  const renderRightActions = () => (
    <>
      <Pressable
        onPress={async () => {
          // console.log('Hello world');
          navigation.navigate(ScreenNames.FORM_INCIDENT);

          // let res = await pickImage();
          // if (res) FileUpload(res);
        }}
      >
        <Badge colorScheme="blue" rounded="lg">
          <HStack alignItems="center">
            <AddIcon size="3" />
            <Text px={1}>Reportar</Text>
          </HStack>
        </Badge>
        {/* <Box flexDirection="row" alignItems="center">
          <TopNavigationAction icon={PlusIcon} />
        </Box> */}
      </Pressable>
      {/* <Box flexDirection="row" alignItems="center">
        <Text category="s2">Enviar</Text>
        <TopNavigationAction icon={CheckMarkIcon} />
      </Box> */}
    </>
  );

  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction icon={MenuIcon} onPress={() => navigation.toggleDrawer()} />
      <Button
        onPress={() => {
          onOpen();
        }}
        variant="ghost"
        _pressed={{ bg: 'coolGray.100' }}
        endIcon={<MaterialIcons name="arrow-drop-down" size={24} color="black" />}
      >
        <Text color="coolGray.700" fontWeight="bold">
          Filtros
        </Text>
        <Text
          fontSize="16"
          color="gray.500"
          _dark={{
            color: 'gray.300',
          }}
        >
          • {getTicketStatus(selectedStatus).label}
        </Text>
      </Button>
    </Box>
  );

  const renderItem = ({ item }: any) => {
    const ticketStatus = getTicketStatus(item.status);
    const ticketPriority = getTicketPriority(item.priority.label);
    return (
      <Pressable
        p={3}
        onPress={() => {
          navigation.navigate(ScreenNames.DETAIL_INCIDENT, { ticketId: item?.id });
        }}
      >
        <HStack space={3} justifyContent="space-between">
          <VStack w="70%">
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              // maxW="300"
              // w="80%"
              bold
            >
              {item?.tUuid}
            </Text>
            <Text
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}
              isTruncated
              // maxW="300"
              // w="80%"
            >
              {ticketPriority?.label ?? 'Prioridad no establecida'} • {item?.observations}
            </Text>
          </VStack>
          {/* <Spacer /> */}
          <VStack w="30%" px="2">
            <Text
              fontSize="xs"
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              alignSelf="flex-end"
            >
              {moment(item?.createdAt).format('D MMM YY')}
            </Text>
            <Badge colorScheme={ticketStatus?.type} rounded="sm">
              {ticketStatus?.label}
            </Badge>
          </VStack>
        </HStack>
      </Pressable>
    );
  };

  // if (isLoading && !isPreviousData) {
  //   return <Loading />;
  // }

  return (
    <Box flex={1} safeArea backgroundColor="#fff">
      <TopNavigation
        alignment="center"
        // title="Mantenimiento"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
        accessoryRight={renderRightActions}
      />
      <FlatList
        data={incidents}
        extraData={incidents}
        onEndReached={() => {
          // if (incidents?.pageInfo.hasNextPage && !isPreviousData) {
          //   console.log('se puede buscar otra');
          //   setPage((prevPage) => prevPage + 1);
          // }
          if (pagedInfo.currentPage < pagedInfo.totalPages) {
            setPage(page + 1);
          }
        }}
        keyExtractor={(item) => `incidencia-${item.id}`}
        // onEndReachedThreshold={0.2}
        ListEmptyComponent={<NoData />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={renderItem}
      />
      {/* <Fab
        borderRadius="full"
        colorScheme="blue"
        placement="bottom-right"
        label="Reportar incidencia"
        onPress={() => navigation.navigate(ScreenNames.FORM_INCIDENT)}
        renderInPortal={false}
      /> */}

      {isLoading && (
        <PresenceTransition
          visible={true}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 250,
            },
          }}
        >
          <Box justifyContent="center" alignItems="center" backgroundColor="#fff" h="50px">
            <Loading />
          </Box>
        </PresenceTransition>
      )}
      <ActionSheet
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        setselectedStatus={setselectedStatus}
        setSubCategory={setSubCategory}
      />
    </Box>
  );
};
