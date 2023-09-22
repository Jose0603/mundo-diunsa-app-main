import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { RefreshControl } from 'react-native';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import {
  Box,
  Fab,
  FlatList,
  HStack,
  VStack,
  Spacer,
  Badge,
  Divider,
  Text,
  Pressable,
  AddIcon,
  Select,
  CheckIcon,
  Button,
  useDisclose,
  ArrowBackIcon,
  PresenceTransition,
} from 'native-base';
import { ScreenNames } from '../../Helpers/ScreenNames';
import moment from 'moment';
import { getTicketStatus, TicketStatuses } from '../../Helpers/GetTicketStatus';
import { Loading } from '../../Components/Loading';
import { NoData } from '../../Components/NoData';
import { getTicketPriority } from '../../Helpers/Priorities';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { GetSolutionsBySubcategory } from '../../Services/incidents/Solutions';
import { ISolution, PageInfo } from '../../interfaces/IIncident';
import SolutionDetailModal from '../../Components/SolutionDetailModal';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const SolutionIncidentScreen = ({ navigation, route }: IProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [pagedInfo, setPagedInfo] = useState<PageInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const [solutions, setSolutions] = useState<ISolution[]>([]);
  const [subCategory, setSubCategory] = useState<number>(-1);
  const [ticketID, setTicketID] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<ISolution>();

  useEffect(() => {
    if (route && route.params) {
      if (route.params.subCategoryId) {
        setSubCategory(route.params.subCategoryId);
      }
      if (route.params.ticketId) {
        setTicketID(route.params.ticketId);
      }
      if (route.params.subCategoryName) {
        setSubCategoryName(route.params.subCategoryName);
      }
    }
  }, []);

  const fetchSolutions = async () => {
    try {
      const res = await GetSolutionsBySubcategory({ Page: page, Limit: 20, SubCategory: subCategory });
      if (page > 1) {
        setSolutions([...solutions, ...res.rows]);
      } else {
        setSolutions([...res.rows]);
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
    setIsLoading(true);
    setPage(1);
    setSolutions([]);
    fetchSolutions();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchSolutions();
  }, [subCategory, page]);

  const renderLeftActions = () => (
    <TopNavigationAction
      icon={<ArrowBackIcon size="4" />}
      onPress={() => navigation.navigate(ScreenNames.DETAIL_INCIDENT, { ticketId: ticketID })}
    />
  );
  const renderItem = ({ item }: any) => {
    return (
      <Pressable
        p={3}
        onPress={() => {
          setSelectedSolution(item);
          setShowModal(true);
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
              Creada por: {item.createdBy}
            </Text>
            <Text
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}
              isTruncated
            >
              {item.description}
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
              {moment(item.createdAt).format('D MMM YY')}
            </Text>
            {/* <Badge colorScheme={ticketStatus.type} rounded="lg">
              {ticketStatus.label}
            </Badge> */}
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
        title="Posibles soluciones"
        subtitle={subCategoryName}
        accessoryLeft={renderLeftActions}
      />
      <SolutionDetailModal
        showModal={showModal}
        closeModal={() => {
          setShowModal(!showModal);
        }}
        solution={selectedSolution}
      />
      <FlatList
        data={solutions}
        onEndReached={() => {
          if (pagedInfo.currentPage < pagedInfo.totalPages) {
            setPage(page + 1);
          }
        }}
        keyExtractor={(item) => item.id.toString()}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={<NoData />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={renderItem}
      />
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
    </Box>
  );
};
