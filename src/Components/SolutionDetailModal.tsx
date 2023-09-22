import React, {useState} from "react";
import {
  Button,
  Modal,
  FormControl,
  Text,
  TextArea,
  useToast,
  Spinner,
  HStack,
  Box,
} from "native-base";
import {SaveSolution} from "../Services/incidents/Incidents";
import {ISolution} from "../interfaces/IIncident";
import moment from "moment";

interface IProps {
  showModal: boolean;
  solution: ISolution;
  closeModal: () => void;
}

const SolutionDetailModal = ({showModal, closeModal, solution}: IProps) => {
  const toast = useToast();

  return (
    <Modal isOpen={showModal} onClose={closeModal}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Solucion</Modal.Header>
        <Modal.Body>
          <Box>
            <Text>{moment(solution?.createdAt).format("DD/MM/YYYY")}</Text>
            <Text>{solution?.description ?? ""}</Text>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            {/* <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                closeModal();
              }}
            >
              Cerrar
            </Button> */}
            <Text>Por: {solution?.createdBy}</Text>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default SolutionDetailModal;
