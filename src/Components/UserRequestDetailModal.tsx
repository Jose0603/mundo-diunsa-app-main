import moment from "moment";
import {Badge, Modal, ScrollView, Text, VStack} from "native-base";
import React, {useEffect} from "react";
import {Platform} from "react-native";

// import { AllPossibleRequestStatuses } from 'react-native-just-timeline';

import {AllPossibleRequestStatuses} from "../Enums/RequestStatus";
import {
  getRequestContestStatus,
  getRequestStatus,
  getRequestType,
} from "../Helpers/GetRequestStatus";
import {useRequest, useRequestContest} from "../hooks/useRequest";
import {IRequestDetail} from "../interfaces/rrhh/IRequestDetail";
import {IRequestData} from "../interfaces/rrhh/IRequestStatus";
import {Loading} from "./Loading";
import {Timeline} from "./Timeline/Timeline";
import {EntityTypes} from "../interfaces/rrhh/IRequestPendingApproval";

export interface IProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  selectedRequest: IRequestDetail;
}

const UserRequestDetailModal = ({
  showModal,
  setShowModal,
  selectedRequest,
}: IProps) => {
  const {request, isLoadingRequest, isFetchingRequest} = useRequest(
    selectedRequest.fluRegistro,
    selectedRequest.fluSolicitud
  );
  const {requestContest, isFetchingRequestContest} = useRequestContest(
    selectedRequest.fluRegistro,
    selectedRequest.fluSolicitud
  );

  function getIconStyles(dat: IRequestData) {
    let iconName = "";
    let iconColor = "#eee";

    if (
      ["anulado", "anulada", "denegado", "denegada"].includes(
        dat.title.toLowerCase()
      )
    ) {
      iconName = "close";
      iconColor = "#d2584b";
    } else if (
      [
        "aprobado",
        "aprobada",
        "creada",
        "creado",
        "autorizado",
        "autorizada",
        "iniciado",
        "iniciada",
      ].includes(dat.title.toLowerCase())
    ) {
      iconName = "check";
      iconColor = "#00b48b";
    } else if (["notificado", "notificada"].includes(dat.title.toLowerCase())) {
      iconName = "hourglass";
      iconColor = "#FFCC28";
    }

    return {iconName, iconColor};
  }
  const isWeb = Platform.OS === "web";
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
      }}
      avoidKeyboard
      // _web={{
      //   paddingX: '48',
      // }}
      size={isWeb ? "lg" : "full"}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>
          <Text
            color={"blue.600"}
            _dark={{
              color: "warmGray.200",
            }}
            fontSize="lg"
            fontWeight="bold"
          >
            {getRequestType(selectedRequest.fluSolicitud)}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <ScrollView>
            <VStack my={2}>
              <Text color={"warmGray.400"} fontSize="md">
                Estado
              </Text>
              <Badge
                w="30%"
                colorScheme={getRequestStatus(selectedRequest?.fluEstado).type}
                rounded="sm"
              >
                {getRequestStatus(selectedRequest?.fluEstado).label}
              </Badge>
            </VStack>
            <VStack my={2}>
              <Text color={"warmGray.400"} fontSize="md">
                Empleado
              </Text>
              <Text color={"warmGray.800"} fontSize="md">
                {selectedRequest?.fluNombreSolicitante}
              </Text>
            </VStack>
            <VStack my={2}>
              <Text color={"warmGray.400"} fontSize="md">
                Comentario
              </Text>
              <Text color={"warmGray.800"} fontSize="md">
                {selectedRequest?.fluComentarioAprobador?.trim().length === 0
                  ? "Sin comentario"
                  : selectedRequest?.fluComentarioAprobador}
              </Text>
            </VStack>
            {getRequestStatus(selectedRequest?.fluEstado).label ==
              "Autorizado" &&
            selectedRequest.fluSolicitud == EntityTypes.requisiciones &&
            requestContest == "" ? (
              <VStack my={2}>
                <Text color={"warmGray.400"} fontSize="md">
                  Estado del Concurso
                </Text>
                <Text color={"warmGray.800"} fontSize="md">
                  Pendiente de Creación
                </Text>
              </VStack>
            ) : getRequestStatus(selectedRequest?.fluEstado).label ==
                "Autorizado" &&
              selectedRequest.fluSolicitud == EntityTypes.requisiciones &&
              requestContest != "" ? (
              <VStack my={2}>
                <Text color={"warmGray.400"} fontSize="md">
                  Estado del Concurso
                </Text>
                <Text color={"warmGray.800"} fontSize="md">
                  {getRequestContestStatus(requestContest.toString()).label}
                </Text>
              </VStack>
            ) : (
              <></>
            )}

            {isLoadingRequest ? (
              <>
                <Loading message="Cargando..." />
              </>
            ) : (
              <VStack my={2}>
                <Text color={"warmGray.400"} fontSize="md">
                  Linea de Tiempo
                </Text>
                <Timeline
                  data={request.map((dat) => {
                    let {iconName, iconColor} = getIconStyles(dat);

                    return {
                      title: {
                        content: dat.title,
                      },
                      description: {
                        content: dat.description,
                      },
                      time: {
                        content: dat.time,
                      },
                      icon: {
                        content: iconName,
                        style: {
                          width: 35,
                          height: 35,
                          backgroundColor: iconColor,
                          color: "#FFF",
                          borderColor: "#FFF",
                          fontSize: 16,
                          paddingTop: 6,
                          borderRadius: 18,
                        },
                      },
                    };
                  })}
                  onEndReachedThreshold={undefined}
                  onEndReached={undefined}
                  TimelineFooter={undefined}
                  TimelineHeader={undefined}
                />
              </VStack>
            )}
          </ScrollView>
        </Modal.Body>
        <Modal.Footer justifyContent="center"></Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default UserRequestDetailModal;
