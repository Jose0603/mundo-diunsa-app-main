import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useUserFamily } from "../../../../hooks/useExpediente";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/reducers/rootReducer";
import { queryClient } from "../../../../Configs/QueryClient";
import { QueryKeys } from "../../../../Helpers/QueryKeys";
import { IFaeFamiliares } from "../../../../interfaces/rrhh/IExpExpediente";
import FamiliaresCreatePage from "./FamiliaresCreatePage";
import { SwipeListView } from "react-native-swipe-list-view";
import { NoData } from "../../../../Components/NoData";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { DeleteFamily } from "../../../../Services/rrhh/FaeFamiliaresExpediente";
import moment from "moment";
import { useCustomToast } from "../../../../hooks/useCustomToast";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";

const FamiliaresListPage = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.auth.login);
  const { families, isLoadingFamilies } = useUserFamily(user.employeeId);
  var listData: IFaeFamiliares[] = isLoadingFamilies ? [] : families;
  const showToast = useCustomToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [dataDelete, setDataDelete] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [datos, setDatos] = useState<IFaeFamiliares>();

  const listViewRef = useRef<SwipeListView<IFaeFamiliares>>(null);

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
    const response = await DeleteFamily(data);
    if (response?.result) {
      const newData = [...listData];
      const prevIndex = listData.findIndex((item) => item.faeCodigo === data);
      newData.splice(prevIndex, 1);
      listData = newData;
      queryClient.refetchQueries([QueryKeys.FAMILIES]);
      setLoading(false);
      showToast({
        title: "Se elimino el familiar con exito",
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
            key={item.faeCodigo}
            alignItems="center"
            space={3}
            flex={1}
            flexDirection={"row"}
          >
            <VStack borderRightColor={"#C0C0C0"} flex={2} borderRightWidth={2}>
              <Text>Nombre</Text>
              <Text>Parentesco</Text>
              <Text>Nacimiento</Text>
              <Text>Nacionalidad</Text>
            </VStack>
            <VStack flex={3}>
              <Text>{item.faeNombre}</Text>
              <Text>{item.faeCodprtName}</Text>
              <Text>{moment(item.faeFechaNac).format("DD/MM/YYYY")}</Text>
              <Text>{item.faePais}</Text>
            </VStack>
            <Spacer />
          </HStack>
        </Box>
      </Pressable>
    </Box>
  );

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2" bg="coolGray.200" borderRadius={"md"} mx={2} mb={3}>
      <Pressable
        w={data.item.faeCreadoUsuario ? "70" : "140"}
        ml="auto"
        bg="coolGray.200"
        borderRadius={"md"}
        justifyContent="center"
        onPress={() => {
          closeRow(rowMap, data.item.faeCodigo);
          // setDatos(data.item);
          navigation.navigate("Familiar", {
            screen: "Familiar",
            params: {
              model: data.item.faeCodigo,
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
              data.item.faeCreadoUsuario ? (
                <Entypo name="dots-three-horizontal" />
              ) : (
                <MaterialIcons name="visibility" />
              )
            }
            size={5}
            color="coolGray.800"
          />
          <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
            {data.item.faeCreadoUsuario ? "Editar" : "Ver"}
          </Text>
        </VStack>
      </Pressable>
      {data.item.faeCreadoUsuario && (
        <Pressable
          w="70"
          bg="red.500"
          borderRadius={"md"}
          justifyContent="center"
          onPress={() => {
            closeRow(rowMap, data.item.faeCodigo);
            setDataDelete(data.item.faeCodigo);
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
              Familiares
            </Text>
            <Button
              isDisabled={false}
              onPress={() => navigation.navigate("Familiar")}
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
                <Text> Nuevo Familiar</Text>
              </View>
            </Button>
          </Row>
          {isLoadingFamilies ? (
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
                    keyExtractor={(item) => item.faeCodigo}
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

export default FamiliaresListPage;
