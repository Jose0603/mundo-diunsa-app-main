import {Button, Input, Modal, ScrollView, Text, VStack} from "native-base";
import React, {useState} from "react";
import {Platform} from "react-native";
import {Loading} from "../../../Components/Loading";
import {StyleService, useStyleSheet} from "@ui-kitten/components";
import {CorrelativoConfirm} from "../../../Services/rrhh/Correlativo";
import {useCustomToast} from "../../../hooks/useCustomToast";

export interface IProps {
  showModal: boolean;
  navigation: any;
  setShowModal: (showModal: boolean) => void;
}

const SurveyQuestionClimometroModal = ({
  showModal,
  setShowModal,
  navigation,
}: IProps) => {
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const styles = useStyleSheet(themedStyles);
  const [correlativo, setCorrelativo] = useState("");
  const isWeb = Platform.OS === "web";
  const showToast = useCustomToast();

  const handleSubmit = async () => {
    setIsLoadingRequest(true);
    try {
      const res = await CorrelativoConfirm();
      if (res.message == "") {
        navigation.navigate("climometro", {
          data: res.data,
          correlativo: correlativo,
        });
      } else {
        showToast({
          title: "Error.",
          status: "warning",
          description: res.message,
        });
        setShowModal(false);
      }
    } catch (error) {
    } finally {
      setIsLoadingRequest(false);
    }
  };

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
            Correlativo
          </Text>
        </Modal.Header>
        <Modal.Body>
          <ScrollView>
            {isLoadingRequest ? (
              <>
                <Loading message="Cargando..." />
              </>
            ) : (
              <VStack my={2}>
                <Input
                  style={styles.messageInput}
                  placeholder="Correlativo..."
                  value={correlativo}
                  onChangeText={setCorrelativo}
                  // accessoryRight={MicIcon}
                />
              </VStack>
            )}
          </ScrollView>
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
              onPress={handleSubmit}
            >
              <Text color={"#0077CD"} fontSize={15}>
                Aceptar
              </Text>
            </Button>
            <Button
              minW={"40%"}
              borderRadius={"full"}
              onPress={() => {
                setShowModal(false);
              }}
            >
              <Text color={"white"} fontSize={15}>
                Cancelar
              </Text>
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default SurveyQuestionClimometroModal;
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
