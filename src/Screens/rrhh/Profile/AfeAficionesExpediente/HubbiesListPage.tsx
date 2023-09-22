import React, { useCallback, useRef, useState } from "react";
import {
  Box,
  Button,
  HStack,
  View,
  Text,
  Stack,
  Divider,
  Pressable,
  VStack,
  Icon,
  Spacer,
  Row,
  Center,
  Spinner,
  Modal,
} from "native-base";
import { useUserFamily, useUserHubbies } from "../../../../hooks/useExpediente";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/reducers/rootReducer";
import { queryClient } from "../../../../Configs/QueryClient";
import { QueryKeys } from "../../../../Helpers/QueryKeys";
import { IAfeAficiones } from "../../../../interfaces/rrhh/IExpExpediente";
import { SwipeListView } from "react-native-swipe-list-view";
import { NoData } from "../../../../Components/NoData";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { DeleteHubby } from "../../../../Services/rrhh/AfeAficionesExpediente";
import HubbiesCreatePage from "./HubbiesCreatePage";
import { useCustomToast } from "../../../../hooks/useCustomToast";
import { useFocusEffect } from "@react-navigation/native";

const HubbiesListPage = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.auth.login);
  const { userHubbies, isLoadingUserHubbies } = useUserHubbies(user.employeeId);
  var listData: IAfeAficiones[] = isLoadingUserHubbies ? [] : userHubbies;
  var res = listData.map((s) => s.afeCodafi);
  const showToast = useCustomToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [dataDelete, setDataDelete] = useState(0);
  const [loading, setLoading] = useState(false);

  const listViewRef = useRef<SwipeListView<IAfeAficiones>>(null);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        listViewRef.current?.closeAllOpenRows();
      };
    }, [])
  );

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteMessage = () => {
    return (
      <Modal isOpen={modalVisible} w={"auto"}>
        <Modal.Content maxWidth="400px">
          <Modal.Body>
            <Modal.CloseButton
              onPress={() => {
                setModalVisible(false);
              }}
            />
            <Center>
              <Entypo name="warning" size={40} color="#0077CD" />
              <Text fontSize={18}>¿Desea eliminar los datos?{"\n"}</Text>
              <Text fontSize={14}>
                Esta acción es definitiva y no se podrá deshacer.
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
                  deleteRow(dataDelete);
                  setModalVisible(false);
                }}
              >
                <Text color={"#0077CD"} fontSize={15}>
                  Eliminar
                </Text>
              </Button>
              <Button
                minW={"40%"}
                borderRadius={"full"}
                onPress={() => {
                  setModalVisible(false);
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

  const deleteRow = async (data: number) => {
    setLoading(true);
    const response = await DeleteHubby(data);
    if (response?.result) {
      const newData = [...listData];
      const prevIndex = listData.findIndex((item) => item.afeCodigo === data);
      newData.splice(prevIndex, 1);
      listData = newData;
      queryClient.refetchQueries([QueryKeys.HUBBIES]);
      setLoading(false);
      showToast({
        title: "Se elimino el pasatiempo con exito",
        status: "success",
      });
    } else {
      setLoading(false);
      showToast({
        title: "Hubo un error",
        status: "error",
        description: response.message,
      });
    }
  };

  const onRowDidOpen = (rowKey, rowMap) => {
    // console.log("This row opened", rowKey);
  };

  const renderItem = ({ item, index }) => (
    <Box mb={3} mx={2}>
      <Pressable
        onPress={() => console.log("You touched me")}
        _dark={{
          bg: "coolGray.800",
        }}
        _light={{
          bg: "gray.100",
        }}
        borderRadius={"md"}
      >
        {/* <Divider my={2} /> */}
        <Box
          pl="4"
          pr="5"
          py="2"
          borderColor={"#C0C0C0"}
          borderWidth={2}
          borderRadius={"md"}
        >
          <HStack
            key={item.afeCodigo}
            alignItems="center"
            space={3}
            flex={1}
            flexDirection={"row"}
          >
            <VStack>
              <Text>{item.afeCodafiName}</Text>
              <Text>¿Lo practica?: {item.afePractica ? "Si" : "No"}</Text>
            </VStack>
            <Spacer />
          </HStack>
        </Box>
        {/* <Divider my={2} /> */}
      </Pressable>
    </Box>
  );

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2" bg="red.500" borderRadius={"md"} mx={2} mb={3}>
      <Pressable
        w="140"
        ml="auto"
        bg="red.500"
        borderRadius={"md"}
        justifyContent="center"
        onPress={() => {
          closeRow(rowMap, data.item.afeCodigo);
          setDataDelete(data.item.afeCodigo);
          setModalVisible(true);
        }}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Eliminar
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  );

  return (
    <Box mb={3} px={3} h={"100%"} bgColor={"white"}>
      {loading ? (
        <Box flex={1}>
          <Row flex={1} justifyContent="center" size={"100%"}>
            <Center>
              <Spinner size={"lg"} />
              <Text color={"#0077CD"} fontSize={"2xl"}>
                Eliminando...
              </Text>
            </Center>
          </Row>
        </Box>
      ) : (
        <>
          <Row mx={3} pt={5} pb={2} justifyContent="space-between">
            <Text fontSize={"xl"} color={"#0077CD"}>
              Aficiones
            </Text>
            <Button
              isDisabled={false}
              onPress={() =>
                navigation.navigate("Hubby", {
                  screen: "Hubby",
                  params: {
                    model: res,
                  },
                })
              }
              backgroundColor={"transparent"}
              _text={{
                color: "coolGray.800",
                fontWeight: "medium",
              }}
            >
              <View flexDirection="row" flexWrap={"wrap"}>
                <Icon
                  as={AntDesign}
                  color={"coolGray.800"}
                  size={5}
                  name="pluscircleo"
                />
                <Text> Agregar Aficiones</Text>
              </View>
            </Button>
          </Row>
          {isLoadingUserHubbies ? (
            <Center>
              <Spinner size={"lg"} />
            </Center>
          ) : (
            <>
              {listData.length === 0 ? (
                <NoData />
              ) : (
                <>
                  {modalVisible && deleteMessage()}
                  <SwipeListView
                    ref={listViewRef}
                    disableRightSwipe
                    data={listData}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-140}
                    previewRowKey={"0"}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onRowDidOpen={onRowDidOpen}
                    keyExtractor={(item) => item.afeCodigo}
                    closeOnRowOpen={true}
                    closeOnRowBeginSwipe={true}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default HubbiesListPage;
