import moment from "moment";
import {
  Badge,
  Box,
  Divider,
  Modal,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Platform} from "react-native";

import {getRequestStatus} from "../Helpers/GetRequestStatus";
import {IExtraHourDetail} from "../interfaces/rrhh/IExtraHourDetail";
import {IRequestPendingApproval} from "../interfaces/rrhh/IRequestPendingApproval";
import {ITimeNotWorkedDetail} from "../interfaces/rrhh/ITimeNotWorked";
import {GetExtraHourDetail} from "../Services/rrhh/Request";
import AuthorizarionRouteDetail from "./AuthorizarionRouteDetail";
import AuthorizationComment from "./AuthorizationComment";
import {Loading} from "./Loading";
import {KeyboardAvoidingView} from "react-native";

export interface IProps {
  showModal: boolean;
  isApproving: boolean;
  setShowModal: (showModal: boolean) => void;
  requestDetail: IExtraHourDetail;
  selectedRequest: IRequestPendingApproval;
  comentario: string;
  setComentario: (comentario: string) => void;
  canContinue: () => boolean;
  Approve: (comentario: string) => void;
  Deny: (comentario: string) => void;
}

const ExtraHourDetailModal = ({
  showModal,
  isApproving,
  setShowModal,
  // requestDetail,
  selectedRequest,
  comentario,
  setComentario,
  canContinue,
  Approve,
  Deny,
}: IProps) => {
  const [requestDetail, setRequestDetail] = useState<IExtraHourDetail>();
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const isMounted = useRef(true);
  const [showComment, setShowComment] = useState(false);

  const fetchDetail = async () => {
    try {
      let res = await GetExtraHourDetail(
        parseInt(selectedRequest.iraCodigoEntidad, 10)
      );
      if (isMounted.current) setRequestDetail(res);
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted.current) setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    return () => {
      isMounted.current = false;
    };
  }, [selectedRequest]);

  useLayoutEffect(() => {
    setShowComment(true);
  }, []);

  const isWeb = Platform.OS === "web";

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        if (!isApproving) setShowModal(false);
      }}
      avoidKeyboard
      // _web={{
      //   paddingX: '48',
      // }}
      size={isWeb ? "lg" : "full"}
    >
      <KeyboardAvoidingView style={{width: "100%"}} behavior="position">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header alignItems="center">
            <Text
              bold
              color={"warmGray.600"}
              _dark={{
                color: "warmGray.200",
              }}
              fontSize="lg"
            >
              Solicitud Horas Extras
            </Text>
            <Text
              color={"blue.600"}
              _dark={{
                color: "warmGray.200",
              }}
              fontSize="md"
            >
              Registro(s) de tiempos no trabajado -{" "}
              {moment(requestDetail?.request?.hexFechaGrabacion).format(
                "DD/MM/YYYY"
              )}
            </Text>
          </Modal.Header>
          <Modal.Body>
            <ScrollView>
              <AuthorizarionRouteDetail
                requestDetail={requestDetail}
                selectedRequest={selectedRequest}
              />
              <Divider />
              <Text
                color={"warmGray.800"}
                bold
                fontSize={isWeb ? "sm" : "lg"}
                mt={2}
              >
                Información de Entidad
              </Text>
              <Box flexDir={isWeb ? "row" : "column"}>
                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Código de entidad
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    {selectedRequest?.iraCodigoEntidad}
                  </Text>
                </VStack>

                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Empleado
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    • {selectedRequest?.usrNombreUsuario}
                  </Text>
                </VStack>
              </Box>
              <VStack my={2}>
                <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                  Estado
                </Text>
                <Badge
                  w="30%"
                  colorScheme={
                    getRequestStatus(requestDetail?.request?.hexEstado).type
                  }
                  rounded="sm"
                >
                  {getRequestStatus(requestDetail?.request?.hexEstado).label}
                </Badge>
              </VStack>
              <Box flexDir={isWeb ? "row" : "column"}>
                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Inicia
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    {moment(requestDetail?.request?.hexFechaInicial).format(
                      "DD/MM/YYYY hh:mm a"
                    )}
                  </Text>
                </VStack>
                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Finaliza
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    {moment(requestDetail?.request?.hexFechaFinal).format(
                      "DD/MM/YYYY hh:mm a"
                    )}
                  </Text>
                </VStack>
              </Box>
              {/* <VStack my={2}>
              <Text color={'warmGray.400'} fontSize={isWeb ? 'sm' : 'md'}>
                Duracion
              </Text>
              <Text color={'warmGray.800'} fontSize={isWeb ? 'sm' : 'md'}>
                {requestDetail?.request?.} Días - {requestDetail?.request?.tnnNumHoras} Horas -{' '}
                {requestDetail?.request?.tnnNumMins} Minutos
              </Text>
            </VStack> */}

              <Box flexDir={isWeb ? "row" : "column"}>
                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Tipo de Planilla
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    {requestDetail?.request?.tplDescripcion}
                  </Text>
                </VStack>
                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Período
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    {requestDetail?.request?.planilla}
                  </Text>
                </VStack>
              </Box>
              <VStack my={2}>
                <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                  Observaciones
                </Text>
                <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                  {requestDetail?.request?.hexObservaciones}
                </Text>
              </VStack>
              {/* <VStack my={2}>
              <Text color={'warmGray.400'} fontSize={isWeb ? 'sm' : 'md'}>
                Aplicado en Planilla
              </Text>
              <Text color={'warmGray.800'} fontSize={isWeb ? 'sm' : 'md'}>
                {requestDetail?.request?.tnnAplicadoPlanilla ? 'Si' : 'No'}
              </Text>
            </VStack>
            <VStack my={2}>
              <Text color={'warmGray.400'} fontSize={isWeb ? 'sm' : 'md'}>
                Planilla Autorizada
              </Text>
              <Text color={'warmGray.800'} fontSize={isWeb ? 'sm' : 'md'}>
                {requestDetail?.request?.tnnPlanillaAutorizada ? 'Si' : 'No'}
              </Text>
            </VStack> */}
            </ScrollView>
          </Modal.Body>
          <Modal.Footer justifyContent="center">
            {isApproving ? (
              <Loading message="Enviando respuesta..." />
            ) : showComment ? (
              <AuthorizationComment
                // comentario={comentario}
                // setComentario={setComentario}
                isApproving={isApproving}
                canContinue={canContinue}
                Approve={Approve}
                Deny={Deny}
              />
            ) : (
              <></>
            )}
          </Modal.Footer>
        </Modal.Content>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ExtraHourDetailModal;
