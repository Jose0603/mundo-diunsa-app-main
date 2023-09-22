import { AntDesign, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Datepicker, Icon, RangeDatepicker, TopNavigationAction } from '@ui-kitten/components';
import moment from 'moment';
import {
  Badge,
  Box,
  Button,
  CheckIcon,
  FlatList,
  HStack,
  Icon as NbIcon,
  Pressable,
  Select,
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
import TopMainBar from '../../../Components/TopMainBar';
import UserRequestDetailModal from '../../../Components/UserRequestDetailModal';
import { queryClient } from '../../../Configs/QueryClient';
import { getRequestStatus, getRequestType } from '../../../Helpers/GetRequestStatus';
import { QueryKeys } from '../../../Helpers/QueryKeys';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { PageInfo } from '../../../interfaces/IIncident';
import { RangeDate } from '../../../interfaces/rrhh/IRequestConstancia';
import { IRequestDetail } from '../../../interfaces/rrhh/IRequestDetail';
import { EntityTypes } from '../../../interfaces/rrhh/IRequestPendingApproval';
import { IRequestStatus } from '../../../interfaces/rrhh/IRequestStatus';
import { GetAllRequestsByUser, GetRequestStatuses } from '../../../Services/rrhh/Request';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

// const a = [
//   {
//     fluSolicitud: EntityTypes.constancias,
//     fluRegistro: 1,
//     fluSujeto: 1,
//     fluNombreSujeto: 'Edwin',
//     fluSolicitante: 1,
//     fluCodigoAlternativo: '150',
//     fluNombreSolicitante: 'Manuel Suarez',
//     fluEstado: 'pendiente',
//     fluFechaSolicitud: '2022-01-02',
//     fluTipo: 'string',
//     fluDescripcion: 'string',
//     fluFechaInicio: '2022-01-01',
//     fluFechaFin: '2022-01-23',
//     fluMotivo: 'prueba',
//     fluDias: 1,
//     fluHoras: 1,
//     fluMinutos: 1,
//     fluCodcia: 1,
//     fluCodppl: 1,
//     fluCodigoPlanilla: 'asasd',
//     fluPeriodo: 'asda',
//     fluComentarioAprobador: 'asd',
//   },
// ];

export const ListRequestScreens = ({ navigation }: IProps) => {
  const MenuIcon = (props: any) => <Icon {...props} name="menu-2-outline" />;
  const PlusIcon = (props: any) => <Icon {...props} name="plus-circle-outline" />;
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
  const [statuses, setStatuses] = useState<IRequestStatus[]>([]);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);

  useEffect(() => {
    setIsLoadingStatuses(true);
    (async () => {
      try {
        const res = await GetRequestStatuses();
        setStatuses(res);
      } catch (error) {
      } finally {
        setIsLoadingStatuses(false);
      }
    })();
  }, []);

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
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction
        icon={<SimpleLineIcons name="menu" size={24} color="black" />}
        onPress={() => navigation.toggleDrawer()}
      />
      <Button
        onPress={() => {
          onOpen();
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
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction icon={PlusIcon} onPress={() => navigation.navigate(ScreenNames.HOME_REQUESTS)} />
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
        <HStack space={3} justifyContent="space-between" borderBottomWidth={1} borderColor="gray.400" py={3}>
          <VStack w="60%">
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              bold
            >
              {getRequestType(item.fluSolicitud)}
              {/* {item.fluSolicitud} */}
            </Text>
            {item.fluSolicitud === EntityTypes.cupontiempolibre && (
              <Text
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                isTruncated
              >
                Solicitado para el {moment(item.fluFechaInicio).format('DD/MM/YY')}
              </Text>
            )}
            <Text
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}
              isTruncated
            >
              {item?.fluMotivo?.trim().length === 0 ? 'Sin comentario' : item?.fluMotivo}
            </Text>
          </VStack>
          {/* <Spacer /> */}
          <VStack w="20%" px="2">
            <Text
              fontSize="xs"
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              alignSelf="flex-end"
            >
              {moment(item.fluFechaSolicitud).format('D MMM YY')}
            </Text>
            <Badge colorScheme={ticketStatus.type} rounded="sm">
              {ticketStatus.label}
            </Badge>
          </VStack>
          <Box w="20%" alignItems="center">
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              bold
            >
              Ver Detalles
            </Text>
            <NbIcon
              as={AntDesign}
              size="md"
              name="arrowright"
              _dark={{
                color: 'warmGray.50',
              }}
              color="#eeeeee"
              bgColor="#2777CC"
              borderRadius="full"
              // p={2}
            />
          </Box>
        </HStack>
      </Pressable>
    );
  };
  return (
    <Box safeArea flex={1} backgroundColor="#fff">
      {/* <TopNavigation
        alignment="center"
        // title="Listado de Solicitudes"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
        accessoryRight={renderRightActions}
      /> */}
      <TopMainBar />
      {selectedRequest && (
        <UserRequestDetailModal showModal={showModal} setShowModal={setShowModal} selectedRequest={selectedRequest} />
      )}

      <Box
        _web={{
          paddingX: '10%',
        }}
        flex={1}
      >
        <Text fontSize={18} bold>
          Mis solicitudes
        </Text>
        <HStack w="100%" alignItems="center">
          <Box w="30%">
            <Box my={4}>
              <Text
                fontSize="14"
                color="gray.500"
                _dark={{
                  color: 'gray.300',
                }}
              >
                Estado
              </Text>
              <Select
                accessibilityLabel="SELECCIONE"
                _selectedItem={{
                  endIcon: <CheckIcon size={5} />,
                }}
                // selectedValue={values.tipoConstancia}
                mt={1}
                onValueChange={(itemValue: string) => {
                  setselectedStatus(itemValue);
                }}
              >
                {statuses &&
                  statuses.length > 0 &&
                  statuses.map(({ value, text }, index) => {
                    return <Select.Item key={`status-${index}`} label={text} value={value} />;
                  })}
              </Select>
            </Box>
          </Box>
          <Box mx={2}>
            <Text
              fontSize="14"
              color="gray.500"
              _dark={{
                color: 'gray.300',
              }}
            >
              Desde
            </Text>
            <Datepicker
              date={startNormalDate}
              onSelect={(nextDate) => setStartNormalDate(nextDate)}
              controlStyle={{ backgroundColor: '#fff' }}
            />
          </Box>
          <Box mx={2}>
            <Text
              fontSize="14"
              color="gray.500"
              _dark={{
                color: 'gray.300',
              }}
            >
              Hasta
            </Text>
            <Datepicker
              date={endNormalDate}
              onSelect={(nextDate) => setEndNormalDate(nextDate)}
              controlStyle={{ backgroundColor: '#fff' }}
            />
          </Box>
          <Button
            size="lg"
            my={3}
            onPress={() => {
              setSearch(!search);
              // onClose();
            }}
          >
            Filtrar
          </Button>
        </HStack>
        {isLoading ? (
          <Loading message="Cargando solicitudes..." />
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
              <Box
                mx={3}
                m={3}
                _web={{
                  my: 5,
                }}
              >
                <ClinicQueue />
              </Box>
            }
          />
        )}
      </Box>
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
