import React from "react";
import {
  Button,
  Center,
  AlertDialog,
  Pressable,
  Text,
  Modal,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../Redux/reducers/dialog/dialogsSlice";
import { RootState } from "../Redux/reducers/rootReducer";
import { setChange } from "../Redux/reducers/rrhh/expedienteSlice";
import { Entypo } from "@expo/vector-icons";

interface IProps {
  message: string;
  btnMessage: string;
}
export default function DialogAlert() {
  // const [isOpen, setIsOpen] = React.useState(false);
  const { onPress, isOpen } = useSelector((state: RootState) => state.dialogs);
  const dispatch = useDispatch();
  const onClose = () => dispatch(closeDialog());
  const cancelRef = React.useRef(null);
  const { change } = useSelector((state: RootState) => state.expediente);

  // const setStates = () => {
  //   dispatch(setChange(false));
  //   onClose();
  // };

  return (
    <Center>
      {/* <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.Body alignItems="center">
            <Text fontSize="md">Cambios</Text>
          </AlertDialog.Body>
          <AlertDialog.Footer p={0}>
            <Pressable
              onPress={onClose}
              ref={cancelRef}
              w="100%"
              p={3}
              alignItems="center"
              _pressed={{
                backgroundColor: "#eee",
              }}
            >
              <Text fontWeight="600">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onClose();
                console.log("onPress");
                dispatch(setChange(false));

                onPress();
                console.log(change);
              }}
              w="100%"
              p={3}
              alignItems="center"
              _pressed={{
                backgroundColor: "#eee",
              }}
            >
              <Text fontWeight="600">Eliminar</Text>
            </Pressable>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog> */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Content maxWidth="400px">
          <Modal.Body>
            <Modal.CloseButton onPress={onClose} />
            <Center>
              <Entypo name="warning" size={40} color="#0077CD" />
              <Text fontSize={18}>¿Desea salir sin guardar?{"\n"}</Text>
              <Text fontSize={14}>
                Se perderán todos sus cambios. No se podrá navegar mientras no
                guarde o acepte salir.
              </Text>
            </Center>
          </Modal.Body>
          <Modal.Footer borderTopWidth={0}>
            <Button.Group
              flex={1}
              justifyContent={"space-between"}
              flexDirection={"row"}
              mx={5}
            >
              <Button
                minW={"40%"}
                borderColor={"#0077CD"}
                borderRadius={"full"}
                variant={"outline"}
                onPress={() => {
                  console.log("onPress");
                  dispatch(setChange(false));
                  onPress();
                  onClose();
                  console.log(change);
                }}
              >
                <Text color={"#0077CD"} fontSize={15}>
                  Aceptar
                </Text>
              </Button>
              <Button
                minW={"40%"}
                borderRadius={"full"}
                ref={cancelRef}
                onPress={onClose}
              >
                <Text color={"white"} fontSize={15}>
                  Cancelar
                </Text>
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
}
