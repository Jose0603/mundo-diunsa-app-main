import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import moment from 'moment';
import {
  Badge,
  Box,
  Button,
  FlatList,
  HStack,
  Pressable,
  Text,
  useDisclose,
  VStack,
} from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';

import { ActionSheetRequestsList } from '../../../Components/ActionSheetRequestsList';
import ClinicQueue from '../../../Components/ClinicQueue';
import { Loading } from '../../../Components/Loading';
import { NoData } from '../../../Components/NoData';
import UserRequestDetailModal from '../../../Components/UserRequestDetailModal';
import { queryClient } from '../../../Configs/QueryClient';
import {
  getRequestStatus,
  getRequestType,
} from '../../../Helpers/GetRequestStatus';
import { QueryKeys } from '../../../Helpers/QueryKeys';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { PageInfo } from '../../../interfaces/IIncident';
import { IRequestDetail } from '../../../interfaces/rrhh/IRequestDetail';
import { EntityTypes } from '../../../interfaces/rrhh/IRequestPendingApproval';
import { GetAllRequestsByUser } from '../../../Services/rrhh/Request';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const ListRequestScreens = ({ navigation }: IProps) => {
  // const MenuIcon = (props: any) => <Icon {...props} name="menu-2-outline" />;
  const MenuIcon = (props: any) => (
    <Ionicons {...props} name='menu' size={24} />
  );
  // const PlusIcon = (props: any) => <Icon {...props} name="plus-circle-outline" />;
  const PlusIcon = (props: any) => (
    <AntDesign {...props} name='plus' size={24} />
  );
  const now = new Date();
  const { isOpen, onOpen, onClose } = useDisclose();
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
  const [selectedStatus, setselectedStatus] = useState<string>('-1');
  const [requests, setRequests] = useState<IRequestDetail[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<IRequestDetail>();
  const [showModal, setShowModal] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await GetAllRequestsByUser({
        Page: page,
        Status: selectedStatus,
        Limit: 10,
        StartDate: startDate.format('YYYY-MM-DD'),
        EndDate: endDate.format('YYYY-MM-DD'),
      });
      if (page > 1) {
        setRequests([...requests, ...res.rows]);
      } else {
        setRequests([...res.rows]);
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
    await queryClient.refetchQueries([QueryKeys.CLINIC_PENDING_APPOINTMENTS]);
    setPage(1);
    setRequests([]);
    try {
      const res = await GetAllRequestsByUser({
        Page: 1,
        Status: selectedStatus,
        Limit: 10,
        StartDate: startDate.format('YYYY-MM-DD'),
        EndDate: endDate.format('YYYY-MM-DD'),
      });
      setRequests([...res.rows]);
      setPagedInfo(res.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setStartDate(moment(startNormalDate));
    setEndDate(moment(endNormalDate));
  }, [startNormalDate, endNormalDate]);

  useEffect(() => {
    setIsLoading(true);
    fetchRequests();
  }, [search, page]);

  const renderLeftActions = () => (
    <Box flexDirection='row' alignItems='center'>
      <TopNavigationAction
        icon={<SimpleLineIcons name='menu' size={24} color='black' />}
        onPress={() => navigation.toggleDrawer()}
      />
      <Button
        onPress={() => {
          onOpen();
        }}
        disabled={isLoading}
        variant='ghost'
        _pressed={{ bg: 'coolGray.100' }}
        endIcon={
          <MaterialIcons name='arrow-drop-down' size={24} color='black' />
        }
      >
        <Text color='coolGray.700' fontWeight='bold'>
          Filtros
        </Text>
        <Text color='coolGray.700' fontWeight='bold'>
          Lista de Solicitudes
        </Text>
        {/* <Text
          fontSize="16"
          color="gray.500"
          _dark={{
            color: 'gray.300',
          }}
        >
          Mostrando Tickets • {getTicketStatus(selectedStatus).label}
        </Text> */}
      </Button>
    </Box>
  );

  const renderRightActions = () => (
    <Box flexDirection='row' alignItems='center'>
      <TopNavigationAction
        icon={PlusIcon}
        onPress={() => navigation.navigate(ScreenNames.HOME_REQUESTS)}
      />
    </Box>
  );

  interface IRenderProps {
    item: IRequestDetail;
  }

  const renderItem = ({ item }: IRenderProps) => {
    const ticketStatus = getRequestStatus(item.fluEstado);
    return (
      <Pressable
        p={3}
        onPress={() => {
          setSelectedRequest(item);
          setShowModal(true);
        }}
      >
        <HStack space={3} justifyContent='space-between'>
          <VStack w='70%'>
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color='coolGray.800'
              bold
            >
              {getRequestType(item.fluSolicitud)}
              {/* {item.fluSolicitud} */}
            </Text>
            {item.fluSolicitud === EntityTypes.cupontiempolibre && (
              <Text
                color='coolGray.600'
                _dark={{
                  color: 'warmGray.200',
                }}
                isTruncated
              >
                Solicitado para el{' '}
                {moment(item.fluFechaInicio).format('DD/MM/YY')}
              </Text>
            )}
            <Text
              color='coolGray.600'
              _dark={{
                color: 'warmGray.200',
              }}
              isTruncated
            >
              {item?.fluMotivo?.trim().length === 0
                ? 'Sin comentario'
                : item?.fluMotivo}
            </Text>
          </VStack>
          {/* <Spacer /> */}
          <VStack w='30%' px='2'>
            <Text
              fontSize='xs'
              _dark={{
                color: 'warmGray.50',
              }}
              color='coolGray.800'
              alignSelf='flex-end'
            >
              {moment(item.fluFechaSolicitud).format('D MMM YY')}
            </Text>
            <Badge colorScheme={ticketStatus.type} rounded='sm'>
              {ticketStatus.label}
            </Badge>
          </VStack>
        </HStack>
      </Pressable>
    );
  };
  return (
    <Box safeArea flex={1} backgroundColor='#fff'>
      <TopNavigation
        alignment='center'
        // title="Listado de Solicitudes"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
        accessoryRight={renderRightActions}
      />
      {selectedRequest && (
        <UserRequestDetailModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedRequest={selectedRequest}
        />
      )}
      {isLoading ? (
        <Loading message='Cargando solicitudes...' />
      ) : (
        <FlatList
          data={requests}
          extraData={requests}
          onEndReached={() => {
            // if (incidents?.pageInfo.hasNextPage && !isPreviousData) {
            //   console.log('se puede buscar otra');
            //   setPage((prevPage) => prevPage + 1);
            // }
            if (pagedInfo.currentPage < pagedInfo.totalPages) {
              setPage(page + 1);
            }
          }}
          keyExtractor={(item) => `solicitud-${item.fluRegistro}`}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={<NoData />}
          // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          refreshing={refreshing}
          renderItem={renderItem}
          onRefresh={onRefresh}
          ListHeaderComponent={
            <Box mx={3} mt={3}>
              <ClinicQueue />
            </Box>
          }
        />
      )}
      <ActionSheetRequestsList
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        setselectedStatus={setselectedStatus}
        setSearch={setSearch}
        setStartDate={setStartNormalDate}
        setEndDate={setEndNormalDate}
        search={search}
      />
    </Box>
  );
};
