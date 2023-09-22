import _ from "lodash";
import moment from "moment";
import {
  Badge,
  Box,
  Divider,
  HStack,
  Modal,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React from "react";
import {Platform} from "react-native";

import {getRequisitionType} from "../Enums/RequisitionTypes";
import {getRequestStatus} from "../Helpers/GetRequestStatus";
import {IRequestPendingApproval} from "../interfaces/rrhh/IRequestPendingApproval";
import {IRequisitionDetail} from "../interfaces/rrhh/IRequestRequisition";
import AuthorizarionRouteDetail from "./AuthorizarionRouteDetail";
import AuthorizationComment from "./AuthorizationComment";
import {Loading} from "./Loading";
import {KeyboardAvoidingView} from "react-native";

export interface IProps {
  showModal: boolean;
  isApproving: boolean;
  setShowModal: (showModal: boolean) => void;
  requestDetail: IRequisitionDetail;
  selectedRequest: IRequestPendingApproval;
  comentario: string;
  setComentario: (comentario: string) => void;
  canContinue: () => boolean;
  Approve: (comentario: string) => void;
  Deny: (comentario: string) => void;
}

const RequestRequisitionModal = ({
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
              Requisicion de Personal -{" "}
              {moment(requestDetail?.request?.repFechaSolicitud).format(
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
                    Tipo de Requisición
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    {getRequisitionType(
                      requestDetail.request.repTipoRequisicion
                    )}
                  </Text>
                </VStack>
                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Estado
                  </Text>
                  <Badge
                    w="30%"
                    colorScheme={
                      getRequestStatus(requestDetail?.request?.repEstado).type
                    }
                    rounded="sm"
                  >
                    {getRequestStatus(requestDetail?.request?.repEstado).label}
                  </Badge>
                </VStack>
              </Box>
              {requestDetail?.request?.repTipoRequisicion === "NuevaPlaza" && (
                <>
                  <Box flexDir={isWeb ? "row" : "column"}>
                    <VStack w={isWeb ? "50%" : "100%"} my={2}>
                      <Text
                        color={"warmGray.400"}
                        fontSize={isWeb ? "sm" : "md"}
                      >
                        Puesto
                      </Text>
                      <Text
                        color={"warmGray.800"}
                        fontSize={isWeb ? "sm" : "md"}
                      >
                        {requestDetail.request.puesto}
                      </Text>
                    </VStack>
                    <VStack w={isWeb ? "50%" : "100%"} my={2}>
                      <Text
                        color={"warmGray.400"}
                        fontSize={isWeb ? "sm" : "md"}
                      >
                        Nombre Plaza
                      </Text>
                      <Text
                        color={"warmGray.800"}
                        fontSize={isWeb ? "sm" : "md"}
                      >
                        {requestDetail.request.plzNombre}
                      </Text>
                    </VStack>
                  </Box>
                </>
              )}
              <VStack w={"100%"} my={2}>
                <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                  Justificación
                </Text>
                <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                  {requestDetail.request.repJustificacion ?? "Sin comentario"}
                </Text>
              </VStack>

              <VStack w={isWeb ? "50%" : "100%"} my={2}>
                <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                  Tipo de Contratación
                </Text>
                <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                  {requestDetail.request.repTipoContrato}
                </Text>
              </VStack>
              <Box flexDir={isWeb ? "row" : "column"}>
                <VStack w={isWeb ? "50%" : "100%"} my={2}>
                  <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                    Inicio de Contratación
                  </Text>
                  <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                    {moment(requestDetail.request.fechaInicio).format(
                      "DD-MMM-YYYY"
                    )}
                  </Text>
                </VStack>
                {requestDetail.request.repTipoContrato !== "Permanente" && (
                  <VStack w={isWeb ? "50%" : "100%"} my={2}>
                    <Text color={"warmGray.400"} fontSize={isWeb ? "sm" : "md"}>
                      Fin de Contratación
                    </Text>
                    <Text color={"warmGray.800"} fontSize={isWeb ? "sm" : "md"}>
                      {requestDetail.request.fechaFin}
                    </Text>
                  </VStack>
                )}
              </Box>
              {requestDetail.request.repTipoRequisicion === "NuevaPlaza" && (
                <Box mb={3} mx={2}>
                  <Text fontSize="md" fontWeight="bold">
                    Detalle de contrataciones
                  </Text>
                  <Box bg="#fff" shadow={2} borderRadius={"md"} px="4" py="2">
                    <HStack flex={1} justifyContent="space-between">
                      <>
                        <VStack alignItems="center" w="20%">
                          <Text fontSize="xs">Personas</Text>
                          <Divider />
                        </VStack>
                        <VStack alignItems="flex-start" w="40%" px={1}>
                          <Text fontSize="xs">Centro de Trabajo</Text>
                          <Divider />
                        </VStack>
                        <VStack alignItems="flex-start" w="40%" px={1}>
                          <Text fontSize="xs">Unidad</Text>
                          <Divider />
                        </VStack>
                      </>
                    </HStack>
                    {requestDetail.request.perPersonas.map((per) => {
                      return (
                        <HStack flex={1} justifyContent="space-between">
                          <>
                            <VStack alignItems="center" w="20%">
                              <Text>{per.perNumPer}</Text>
                            </VStack>
                            <VStack alignItems="flex-start" w="40%" px={1}>
                              <Text textAlign="left">{per.cdtNombre}</Text>
                            </VStack>
                            <VStack alignItems="flex-start" w="40%" px={1}>
                              <Text textAlign="left">{per.uniNombre}</Text>
                            </VStack>
                          </>
                        </HStack>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {requestDetail.request.repTipoRequisicion === "Sustitucion" && (
                <Box mb={3} mx={2}>
                  <Text fontSize="md" fontWeight="bold">
                    Detalle de sustituciones
                  </Text>
                  <Box borderRadius={"md"} px="4" py="2" bg="#fff" shadow={2}>
                    <HStack flex={1} justifyContent="space-between">
                      <>
                        <VStack w="40%">
                          <Text fontSize="xs">Plaza</Text>
                          <Divider />
                        </VStack>
                        <VStack w="60%" px={1}>
                          <Text fontSize="xs">Empleado</Text>
                          <Divider />
                        </VStack>
                      </>
                    </HStack>
                    {requestDetail.request.serSustituciones.map((ser, idx) => {
                      return (
                        <HStack
                          flex={1}
                          justifyContent="space-between"
                          py={2}
                          px={1}
                          borderRadius="md"
                          bg={idx % 2 === 0 ? "coolGray.200" : "transparent"}
                        >
                          <>
                            <VStack w="40%">
                              <Text>{ser.plzNombre}</Text>
                            </VStack>
                            <VStack w="60%" px={1}>
                              <Text>
                                {ser.serCodEmp} - {ser.expNombresApellidos}
                              </Text>
                            </VStack>
                          </>
                        </HStack>
                      );
                    })}
                  </Box>
                </Box>
              )}
              {requestDetail.request.repTipoRequisicion === "Vacante" &&
                requestDetail?.request?.pvrPlazas.length > 0 && (
                  <Box mb={3} mx={2}>
                    <Text fontSize="md" fontWeight="bold">
                      Detalle de Vacantes
                    </Text>
                    <Box borderRadius={"md"} px="4" py="2" bg="#fff" shadow={2}>
                      {_.chain(requestDetail?.request?.pvrPlazas)
                        .groupBy("cdtNombre")
                        .map((value, key) => {
                          return (
                            <>
                              <Text fontWeight="bold">{key}</Text>
                              <HStack flex={1} justifyContent="space-between">
                                <VStack w="20%">
                                  <Text fontSize="xs">Plazas</Text>
                                  <Divider />
                                </VStack>
                                <VStack w="40%" px={1}>
                                  <Text fontSize="xs">Unidad</Text>
                                  <Divider />
                                </VStack>
                                <VStack w="40%" px={1}>
                                  <Text fontSize="xs">Plaza</Text>
                                  <Divider />
                                </VStack>
                              </HStack>
                              {value.map((pvr) => {
                                return (
                                  <HStack
                                    flex={1}
                                    justifyContent="space-between"
                                    py={2}
                                  >
                                    <VStack w="20%" px={1}>
                                      <Text>{pvr.perNumPlazas}</Text>
                                    </VStack>
                                    <VStack w="40%" px={1}>
                                      <Text>{pvr.uniNombre ?? "-"}</Text>
                                    </VStack>
                                    <VStack w="40%">
                                      <Text>{pvr.plzNombre ?? "-"}</Text>
                                    </VStack>
                                  </HStack>
                                );
                              })}
                            </>
                          );
                        })
                        .value()}
                    </Box>
                  </Box>
                )}
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

export default RequestRequisitionModal;
