import {AntDesign, Ionicons} from "@expo/vector-icons";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {
  StyleService,
  TopNavigationAction,
  useStyleSheet,
} from "@ui-kitten/components";
import {Box, FlatList, Pressable, Text, useDisclose} from "native-base";
import React, {useCallback, useEffect, useState} from "react";
import {Platform, RefreshControl} from "react-native";

import ExtraHourDetailModal from "../../../Components/ExtraHourDetailModal";
import LoadingModal from "../../../Components/LoadingModal";
import {NoData} from "../../../Components/NoData";
import RequestFreeTimeCouponDetailModal from "../../../Components/RequestFreeTimeCouponDetailModal";
import RequestRecordDetailModal from "../../../Components/RequestRecordDetailModal";
import RequestRequisitionModal from "../../../Components/RequestRequisitionModal";
import RequestVacationDetailModal from "../../../Components/RequestVacationDetailModal";
import TNNDetailModal from "../../../Components/TNNDetailModal";
import TopMainBar from "../../../Components/TopMainBar";
import {getRequestStatus} from "../../../Helpers/GetRequestStatus";
import {ScreenNames} from "../../../Helpers/ScreenNames";
import {useCustomToast} from "../../../hooks/useCustomToast";
import {IResponseModel} from "../../../interfaces/IResponseModel";
import {IRecordDetail} from "../../../interfaces/rrhh/IRequestConstancia";
import {
  EntityTypes,
  IRequestPendingApproval,
} from "../../../interfaces/rrhh/IRequestPendingApproval";
import {IVacationRequestDetail} from "../../../interfaces/rrhh/IRequestVacation";
import {
  ApproveRequest,
  DenyRequest,
  GetExtraHourDetail,
  GetFreeTimeCouponDetail,
  GetPermissionDetail,
  GetRecordRequestDetail,
  GetRequestsPendingApproval,
  GetRequisitionRequestDetail,
  GetTimeNotWorkedDetail,
  GetVacationRequestDetail,
} from "../../../Services/rrhh/Request";
import PendingApprovalItem from "./components/PendingApprovalItem";
import {SearchBar} from "../../../Components/SearchBar";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

const a = [
  {
    iraCodigo: "asdasd-asdas-asd-",
    iraCodigoEntidad: "1",
    iraEntitysetName: "InstanciasEntidadesAdicionales",
    ainCodigo: 1,
    ainNombre: "Prueba",
    draTipoResponsable: "4789",
    draCodemp: 60,
    ainOrden: 1,
    codempResponsable: "1230",
    nombreResponsable: "Edwin",
    comempSujetoAccion: "Adolfo",
    nombreSujetoAccion: "Noriega",
    ainEstado: "pendiente",
    ainFechaPendiente: "2022-01-01",
    ainFechaNotificado: "2022-01-01",
    ainFechaAutorizado: "2022-01-01",
    ainFechaDenegado: "2022-01-01",
    ainFechaAnulado: "2022-01-01",
    ainUsuarioGrabacion: "4789",
    usrNombreUsuario: "Martin palermo",
    iraCodempSujetoAccion: 123,
    plzCodcia: 1,
  },
];

export const ListPendingApprovalRequestsScreen = ({navigation}: IProps) => {
  // const MenuIcon = (props: any) => <Icon {...props} name='menu-2-outline' />;
  // const PlusIcon = (props: any) => (
  //   <Icon {...props} name='plus-circle-outline' />
  // );

  const MenuIcon = (props: any) => (
    <Ionicons {...props} name="menu" size={24} />
  );
  const PlusIcon = (props: any) => <AntDesign {...props} name="plus" />;

  const styles = useStyleSheet(themedStyles);
  const showToast = useCustomToast();
  // const toast = useToast();

  const keyboardOffset = (height: number): number =>
    Platform.select({
      android: 0,
      ios: height,
    }) || 0;
  const [searchQuery, setSearchQuery] = useState("");

  const {isOpen, onOpen, onClose} = useDisclose();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // const [page, setPage] = useState<number>(1);
  // const [pagedInfo, setPagedInfo] = useState<PageInfo>({
  //   count: 20,
  //   totalCount: 20,
  //   hasNextPage: false,
  //   hasPreviousPage: false,
  //   currentPage: 1,
  //   totalPages: 1,
  // });
  const [search, setSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<IRequestPendingApproval[]>([]);
  const filteredData = requests.filter(
    (item) =>
      item.nombreSujetoAccion
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.nombreSujetoAccion.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<IRequestPendingApproval>();
  const [requestRecordDetail, setRequestRecordDetail] =
    useState<IRecordDetail>();
  const [requestDetail, setRequestDetail] = useState<any>();
  const [requestVacationDetail, setRequestVacationDetail] =
    useState<IVacationRequestDetail>();
  const [showModal, setShowModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const [comentario, setComentario] = useState("");
  // const comentario = useRef('').current;
  const [isApproving, setIsApproving] = useState(false);

  // const canContinue = useCallback(() => {
  //   return comentario.trim() === '' || comentario.trim() === null || comentario.trim() === undefined;
  // }, [comentario]);
  const canContinue = () => true;
  const fetchRequests = async () => {
    try {
      const res = await GetRequestsPendingApproval();
      setRequests([...res]);
      // setRequests([...res]);
      // setPagedInfo(res.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDetail = useCallback(
    async (type: EntityTypes) => {
      setIsLoadingDetail(true);
      try {
        let res;
        switch (type) {
          case EntityTypes.constancias:
            res = await GetRecordRequestDetail(
              parseInt(selectedRequest.iraCodigoEntidad, 10)
            );
            break;
          case EntityTypes.vacacion:
            res = await GetVacationRequestDetail(
              parseInt(selectedRequest.iraCodigoEntidad, 10)
            );
            break;
          case EntityTypes.horas:
            res = await GetExtraHourDetail(
              parseInt(selectedRequest.iraCodigoEntidad, 10)
            );
            break;
          case EntityTypes.solHoras:
            res = await GetExtraHourDetail(
              parseInt(selectedRequest.iraCodigoEntidad, 10)
            );
            break;
          case EntityTypes.tnn:
            res = await GetTimeNotWorkedDetail(
              parseInt(selectedRequest.iraCodigoEntidad, 10)
            );
            break;
          case EntityTypes.permiso:
            res = await GetPermissionDetail(
              parseInt(selectedRequest.iraCodigoEntidad, 10)
            );
            break;
          case EntityTypes.entidadAdicional:
            res = await GetFreeTimeCouponDetail(
              parseInt(selectedRequest.iraCodigoEntidad, 10)
            );
            break;
          case EntityTypes.requisiciones:
            res = await GetRequisitionRequestDetail(
              parseInt(selectedRequest.iraCodigoEntidad, 10)
            );
            break;
          default:
            break;
        }

        console.log(JSON.stringify(res, null, 2));
        setRequestRecordDetail(res);
        setRequestDetail(res);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [selectedRequest]
  );

  const showResponse = (res: IResponseModel) => {
    if (res.result) {
      showToast({
        title: "Estado Cambiado",
        status: "success",
        description: res.message,
      });
      setShowModal(false);
      setRefreshing(true);
      setIsLoading(true);
      fetchRequests();
    } else {
      showToast({
        title: "Hubo un error",
        status: "warning",
        description: res.message,
      });
    }
  };

  const Approve = useCallback(
    async (comentario: string) => {
      setIsApproving(true);
      try {
        const res = await ApproveRequest(selectedRequest.iraCodigo, comentario);
        showResponse(res);
      } catch (error) {
        showToast({
          title: "Error",
          status: "error",
          description: "Error al autorizar la solicitud",
        });
        console.error(
          "🚀 ~ file: ListPendingApprovalRequestsScreen.tsx ~ line 165 ~ error",
          error
        );
      } finally {
        setIsApproving(false);
      }
    },
    [selectedRequest, comentario]
  );

  const Deny = useCallback(
    async (comentario: string) => {
      setIsApproving(true);
      try {
        const res = await DenyRequest(selectedRequest.iraCodigo, comentario);
        showResponse(res);
      } catch (error) {
        showToast({
          title: "Error",
          status: "error",
          description: "Error al denegar la solicitud",
        });
        console.error(
          "🚀 ~ file: ListPendingApprovalRequestsScreen.tsx ~ line 181 ~ error",
          error
        );
      } finally {
        setIsApproving(false);
      }
    },
    [selectedRequest, comentario]
  );

  const showingModal = useCallback(
    (type: EntityTypes) => {
      switch (type) {
        case EntityTypes.constancias:
          return (
            <RequestRecordDetailModal
              showModal={showModal}
              isApproving={isApproving}
              setShowModal={setShowModal}
              requestDetail={requestDetail}
              selectedRequest={selectedRequest}
              comentario={comentario}
              setComentario={setComentario}
              canContinue={canContinue}
              Approve={Approve}
              Deny={Deny}
            />
          );
        case EntityTypes.vacacion:
          return (
            <RequestVacationDetailModal
              showModal={showModal}
              isApproving={isApproving}
              setShowModal={setShowModal}
              requestDetail={requestDetail}
              selectedRequest={selectedRequest}
              comentario={comentario}
              setComentario={setComentario}
              canContinue={canContinue}
              Approve={Approve}
              Deny={Deny}
            />
          );
        case EntityTypes.horas:
          return (
            <ExtraHourDetailModal
              showModal={showModal}
              isApproving={isApproving}
              setShowModal={setShowModal}
              requestDetail={requestDetail}
              selectedRequest={selectedRequest}
              comentario={comentario}
              setComentario={setComentario}
              canContinue={canContinue}
              Approve={Approve}
              Deny={Deny}
            />
          );
        case EntityTypes.solHoras:
          return (
            <ExtraHourDetailModal
              showModal={showModal}
              isApproving={isApproving}
              setShowModal={setShowModal}
              requestDetail={requestDetail}
              selectedRequest={selectedRequest}
              comentario={comentario}
              setComentario={setComentario}
              canContinue={canContinue}
              Approve={Approve}
              Deny={Deny}
            />
          );
        case EntityTypes.tnn:
          return (
            <TNNDetailModal
              showModal={showModal}
              isApproving={isApproving}
              setShowModal={setShowModal}
              requestDetail={requestDetail}
              selectedRequest={selectedRequest}
              comentario={comentario}
              setComentario={setComentario}
              canContinue={canContinue}
              Approve={Approve}
              Deny={Deny}
            />
          );
        case EntityTypes.permiso:
          return (
            <RequestRecordDetailModal
              showModal={showModal}
              isApproving={isApproving}
              setShowModal={setShowModal}
              requestDetail={requestDetail}
              selectedRequest={selectedRequest}
              comentario={comentario}
              setComentario={setComentario}
              canContinue={canContinue}
              Approve={Approve}
              Deny={Deny}
            />
          );
        case EntityTypes.entidadAdicional:
          return (
            <RequestFreeTimeCouponDetailModal
              showModal={showModal}
              isApproving={isApproving}
              setShowModal={setShowModal}
              requestDetail={requestDetail}
              selectedRequest={selectedRequest}
              comentario={comentario}
              setComentario={setComentario}
              canContinue={canContinue}
              Approve={Approve}
              Deny={Deny}
            />
          );
        case EntityTypes.requisiciones:
          return (
            <RequestRequisitionModal
              showModal={showModal}
              isApproving={isApproving}
              setShowModal={setShowModal}
              requestDetail={requestDetail}
              selectedRequest={selectedRequest}
              comentario={comentario}
              setComentario={setComentario}
              canContinue={canContinue}
              Approve={Approve}
              Deny={Deny}
            />
          );
        default:
          break;
      }
    },
    [selectedRequest, requestDetail, showModal, isApproving]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setIsLoading(true);
    fetchRequests();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setRefreshing(true);
    fetchRequests();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      setIsLoadingDetail(true);
      fetchDetail(selectedRequest.iraEntitysetName);
    }
    // setComentario('');
  }, [selectedRequest]);

  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction
        icon={MenuIcon}
        onPress={() => navigation.toggleDrawer()}
      />
    </Box>
  );

  const renderRightActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction
        icon={PlusIcon}
        onPress={() => navigation.navigate(ScreenNames.HOME_REQUESTS)}
      />
    </Box>
  );

  interface IRenderProps {
    item: IRequestPendingApproval;
  }

  const renderItem = ({item}: IRenderProps) => {
    const ticketStatus = getRequestStatus(item.ainEstado);
    return (
      <Pressable
        px={3}
        pt={3}
        // m={2}
        onPress={() => {
          // setShowLoadingModal(true);
          setIsLoadingDetail(true);
          console.log(item);
          setSelectedRequest(item);
          setShowModal(true);
        }}
        // backgroundColor="#eee"
      >
        <PendingApprovalItem item={item} ticketStatus={ticketStatus} />
      </Pressable>
    );
  };

  if (isLoadingDetail)
    return (
      <LoadingModal
        showLoadingModal={isLoadingDetail}
        setShowLoadingModal={setShowLoadingModal}
      />
    );
  return (
    <Box safeArea flex={1} backgroundColor="#fff">
      {/* <TopNavigation
        alignment="center"
        title="Solicitudes"
        subtitle="Pendientes por Aprobar"
        accessoryLeft={renderLeftActions}
        // accessoryRight={renderRightActions}
      /> */}
      <TopMainBar showMenu showBack={false} />
      {/* <LoadingModal showLoadingModal={isLoadingDetail} setShowLoadingModal={setShowLoadingModal} /> */}
      {selectedRequest &&
        !isLoadingDetail &&
        showingModal(selectedRequest.iraEntitysetName)}
      {/* <Box alignItems={'center'}>
        <Text textAlign="center" fontSize={18} bold>
          Solicitudes Pendientes por Aprobar
        </Text>
      </Box> */}
      <Box
        _web={{
          paddingX: "10%",
        }}
        flex={1}
      >
        <Text fontSize="xl" bold ml={2}>
          Mis solicitudes por Aprobar
        </Text>
        <Box px="10" mb="5">
          <SearchBar
            handleChange={(text) => {
              setSearchQuery(text);
            }}
            handleSearch={() => {}}
            value={searchQuery}
          />
        </Box>
        <FlatList
          data={filteredData}
          extraData={filteredData}
          onEndReached={() => {
            // if (pagedInfo.hasNextPage) {
            //   setPage(page + 1);
            // }
          }}
          _contentContainerStyle={{
            _web: {
              marginX: "48",
            },
          }}
          keyExtractor={(item) => `solicitud-pendiente-${item.iraCodigo}`}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={<NoData />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderItem}
        />
      </Box>
    </Box>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  messageInputContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: "background-basic-color-1",
  },
  attachButton: {
    borderRadius: 24,
    marginHorizontal: 8,
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  sendButton: {
    marginRight: 4,
  },
  iconButton: {
    width: 24,
    height: 24,
  },
});

export default ListPendingApprovalRequestsScreen;
