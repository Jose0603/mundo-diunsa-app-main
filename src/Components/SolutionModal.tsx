import React, { useState } from "react";
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
import { SaveSolution } from "../Services/incidents/Incidents";
import { useCustomToast } from "../hooks/useCustomToast";

interface IProps {
  showModal: boolean;
  subCategoryId: number;
  closeModal: (response: boolean) => void;
}

const SolutionModal = ({ showModal, closeModal, subCategoryId }: IProps) => {
  const [solutionDescription, setSolutionDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useCustomToast();
  // const toast = useToast();

  return (
    <Modal isOpen={showModal} onClose={closeModal}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Guardar Solucion</Modal.Header>
        <Modal.Body>
          <Box>
            <Text>Descripcion</Text>
            <TextArea
              h={150}
              placeholder="Descripcion"
              w={{
                base: "100%",
                md: "25%",
              }}
              value={solutionDescription}
              onChangeText={(itemValue: string) => {
                setSolutionDescription(itemValue);
              }}
            />
          </Box>
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <HStack alignItems="center" space={1}>
              <Spinner accessibilityLabel="Cargando" color="blue.500" />
              <Text>Guardando...</Text>
            </HStack>
          ) : (
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                disabled={loading}
                onPress={() => {
                  closeModal(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                disabled={loading}
                onPress={async () => {
                  setLoading(true);
                  try {
                    const res = await SaveSolution({
                      description: solutionDescription,
                      subcategoryId: subCategoryId,
                    });
                    if (res.result) {
                      setSolutionDescription("");
                      showToast({
                        title: `Se ha guardado la solucion`,
                        status: "success",
                        // description: data.Message ?? 'Ocurrio un error inesperado',
                      });
                    }
                  } catch (error) {
                    showToast({
                      title: `Ha ocurrido un error al guardar la solucion`,
                      status: "error",
                      // description: data.Message ?? 'Ocurrio un error inesperado',
                    });
                  } finally {
                    setLoading(false);
                    closeModal(true);
                  }
                }}
              >
                Continuar
              </Button>
            </Button.Group>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default SolutionModal;
