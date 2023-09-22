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
import React from "react";
import {Platform} from "react-native";

import {getRequestStatus} from "../Helpers/GetRequestStatus";
import {IRecordDetail} from "../interfaces/rrhh/IRequestConstancia";
import {IFreeTimeCouponDetail} from "../interfaces/rrhh/IRequestFreetimeCupon";
import {IRequestPendingApproval} from "../interfaces/rrhh/IRequestPendingApproval";
import AuthorizarionRouteDetail from "./AuthorizarionRouteDetail";
import AuthorizationComment from "./AuthorizationComment";
import {Loading} from "./Loading";
import {KeyboardAvoidingView} from "react-native";

export interface IProps {
  showModal: boolean;
  isApproving: boolean;
  setShowModal: (showModal: boolean) => void;
  requestDetail: IFreeTimeCouponDetail;
  selectedRequest: IRequestPendingApproval;
  comentario: string;
  setComentario: (comentario: string) => void;
  canContinue: () => boolean;
  Approve: (comentario: string) => void;
  Deny: (comentario: string) => void;
}

const RequestFreeTimeCouponDetailModal = ({
  showModal,
  isApproving,
  setShowModal,
  requestDetail,
  selectedRequest,
  comentario,
  setComentario,
  canContinue,
  Approve,
  Deny,
}: IProps) => {
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
              Autorizar Solicitud
            </Text>
            <Text
              color={"blue.600"}
              _dark={{
                color: "warmGray.200",
              }}
              fontSize="md"
            >
              Cupon de tiempo libre -{" "}
              {moment(requestDetail?.request?.dctFechaSolicitud).format(
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
                    Estado
                  </Text>
                  <Badge
                    w="30%"
                    colorScheme={
                      getRequestStatus(requestDetail?.request?.dctEstado).type
                    }
                    rounded="sm"
                  >
                    {getRequestStatus(requestDetail?.request?.dctEstado).label}
                  </Badge>
                </VStack>
              </Box>
              {/* <VStack my={2}>
              <Text color={'warmGray.400'} fontSize={isWeb ? 'sm' : 'md'}>
                Empleado
              </Text>
              <Text color={'warmGray.800'} fontSize={isWeb ? 'sm' : 'md'}>
                • {selectedRequest?.usrNombreUsuario}
              </Text>
            </VStack> */}
              <Box flexDir={isWeb ? "row" : "column"}>
                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Desde
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    {moment(requestDetail?.request?.dctDesde).format(
                      "DD MMM YYYY hh:mm a"
                    )}
                  </Text>
                </VStack>
                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Hasta
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    {moment(requestDetail?.request?.dctHasta).format(
                      "DD MMM YYYY hh:mm a"
                    )}
                  </Text>
                </VStack>
              </Box>
              <VStack w={isWeb ? "50%" : "100%"} my={2}>
                <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                  Motivo
                </Text>
                <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                  {requestDetail?.request?.dctMotivo ?? "Sin Comentario"}
                </Text>
              </VStack>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer justifyContent="center">
            {isApproving ? (
              <Loading message="Enviando respuesta..." />
            ) : (
              <AuthorizationComment
                // comentario={comentario}
                // setComentario={setComentario}
                isApproving={isApproving}
                canContinue={canContinue}
                Approve={Approve}
                Deny={Deny}
              />
            )}
          </Modal.Footer>
        </Modal.Content>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RequestFreeTimeCouponDetailModal;
