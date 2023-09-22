import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  Pressable,
  VStack,
  Icon,
  Spacer,
  Row,
  View,
  Center,
  Spinner,
  Modal,
} from "native-base";
import { useUserEmergencyContacts } from "../../../../hooks/useExpediente";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/reducers/rootReducer";
import { queryClient } from "../../../../Configs/QueryClient";
import { QueryKeys } from "../../../../Helpers/QueryKeys";
import { IEmeEmergencia } from "../../../../interfaces/rrhh/IExpExpediente";
import EmergencyContactsCreatePage from "./EmergencyContactsCreatePage";
import { SwipeListView } from "react-native-swipe-list-view";
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import {
  DeleteEmergencyContact,
  MoveDown,
  MoveUp,
} from "../../../../Services/rrhh/EmeEmergenciaExpediente";
import { useCustomToast } from "../../../../hooks/useCustomToast";
import { NoData } from "../../../../Components/NoData";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";

const DirectionListPage = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.auth.login);
  const { contacts, isLoadingContact, refetch } = useUserEmergencyContacts(
    user.employeeId
  );
  var listData: IEmeEmergencia[] = isLoadingContact ? [] : contacts;
  var max = Math.max(...contacts.map((o) => o.emeSecuencial));
  var min = Math.min(...contacts.map((o) => o.emeSecuencial));
  const showToast = useCustomToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [dataDelete, setDataDelete] = useState(0);
  const [loading, setLoading] = useState(false);

  // const change = useSelector((state: RootState) => state.expediente.change);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("tabPress", (e) => {
  //     // Prevent default behavior
  //     e.preventDefault();

  //     alert("Default behavior prevented");
  //     // Do something manually
  //     // ...
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const listViewRef = useRef<SwipeListView<IEmeEmergencia>>(null);

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

  useEffect(() => {
    max = Math.max(...contacts.map((o) => o.emeSecuencial));
    min = Math.min(...contacts.map((o) => o.emeSecuencial));
  }, [contacts]);

  const deleteRow = async (data: number) => {
    setLoading(true);
    const response = await DeleteEmergencyContact(data);
    if (response?.result) {
      const newData = [...listData];
      const prevIndex = listData.findIndex((item) => item.emeCodigo === data);
      newData.splice(prevIndex, 1);
      listData = newData;
      queryClient.refetchQueries([QueryKeys.EMERGENCY_CONTACTS]);
      setLoading(false);
      showToast({
        title: "Se elimino el contacto con exito",
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
        <Box
          pl="4"
          pr="5"
          py="2"
          borderColor={"#C0C0C0"}
          borderWidth={2}
          borderRadius={"md"}
        >
          <HStack
            flex={1}
            flexDirection={"row"}
            key={item.emeCodigo}
            alignItems="center"
            space={3}
          >
            <VStack borderRightColor={"#C0C0C0"} flex={2} borderRightWidth={2}>
              <Text>Nombre</Text>
              <Text>Parentesco</Text>
              <Text>Teléfono</Text>
            </VStack>
            <VStack flex={4}>
              <Text numberOfLines={1}>{item.emeNombre}</Text>
              <Text>{item.emeCodprtName}</Text>
              <Text>{item.emeTelefono}</Text>
            </VStack>
            <VStack flex={1}>
              <Button
                variant={"outline"}
                borderWidth={0}
                disabled={item.emeSecuencial == min}
                onPress={() => {
                  MoveUp(item.emeCodigo, item.emeSecuencial);
                }}
              >
                <Icon
                  as={AntDesign}
                  color={item.emeSecuencial != min ? "#0077CD" : "gray.100"}
                  size={8}
                  name="upcircleo"
                />
              </Button>
              <Button
                variant={"outline"}
                borderWidth={0}
                disabled={item.emeSecuencial == max}
                onPress={() => {
                  MoveDown(item.emeCodigo, item.emeSecuencial);
                }}
              >
                <Icon
                  as={AntDesign}
                  color={item.emeSecuencial != max ? "#0077CD" : "gray.100"}
                  size={8}
                  name="downcircleo"
                />
              </Button>
            </VStack>
            {/* <Spacer /> */}
          </HStack>
        </Box>
      </Pressable>
    </Box>
  );

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2" bg="coolGray.200" borderRadius={"md"} mx={2} mb={3}>
      <Pressable
        w={data.item.emeCreadoUsuario ? "70" : "140"}
        ml="auto"
        borderRadius={"md"}
        bg="coolGray.200"
        justifyContent="center"
        onPress={() => {
          closeRow(rowMap, data.item.emeCodigo);
          // queryClient.refetchQueries([QueryKeys.CONTACT]);
          navigation.navigate("Contacto", {
            screen: "Contacto",
            params: {
              model: data.item.emeCodigo ?? 0,
            },
          });
        }}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Icon
            as={
              data.item.emeCreadoUsuario ? (
                <Entypo name="dots-three-horizontal" />
              ) : (
                <MaterialIcons name="visibility" />
              )
            }
            size={5}
            color="coolGray.800"
          />
          <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
            {data.item.emeCreadoUsuario ? "Editar" : "Ver"}
          </Text>
        </VStack>
      </Pressable>
      {data.item.emeCreadoUsuario && (
        <Pressable
          w="70"
          bg="red.500"
          borderRadius={"md"}
          justifyContent="center"
          onPress={() => {
            closeRow(rowMap, data.item.emeCodigo);
            setDataDelete(data.item.emeCodigo);
            setModalVisible(true);
          }}
          _pressed={{
            opacity: 0.5,
          }}
        >
          <VStack alignItems="center" space={2}>
            <Icon as={<MaterialIcons name="delete" />} color="white" size={5} />
            <Text color="white" fontSize="xs" fontWeight="medium">
              Eliminar
            </Text>
          </VStack>
        </Pressable>
      )}
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
              Contactos
            </Text>
            <Button
              isDisabled={false}
              // bg="transparent"
              onPress={() => navigation.navigate("Contacto")}
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
                <Text> Nuevo Contacto</Text>
              </View>
            </Button>
          </Row>
          {isLoadingContact ? (
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
                    keyExtractor={(item) => item.emeCodigo}
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

export default DirectionListPage;
