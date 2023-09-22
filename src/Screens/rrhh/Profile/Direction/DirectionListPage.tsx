import React, { useCallback, useRef, useState } from "react";
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
  Spinner,
  View,
  Center,
  Modal,
} from "native-base";
import { useUserAdresses } from "../../../../hooks/useExpediente";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/reducers/rootReducer";
import { queryClient } from "../../../../Configs/QueryClient";
import { QueryKeys } from "../../../../Helpers/QueryKeys";
import { IDexDirecciones } from "../../../../interfaces/rrhh/IExpExpediente";
import { SwipeListView } from "react-native-swipe-list-view";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { DeleteAdress } from "../../../../Services/rrhh/DexDireccionesExpediente";
import { useCustomToast } from "../../../../hooks/useCustomToast";
import { NoData } from "../../../../Components/NoData";
import { useFocusEffect } from "@react-navigation/native";

const DirectionListPage = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.auth.login);
  const { adresses, isLoadingAdresses } = useUserAdresses(user.employeeId);
  var listData: IDexDirecciones[] = isLoadingAdresses ? [] : adresses;
  const showToast = useCustomToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [dataDelete, setDataDelete] = useState(0);
  const [loading, setLoading] = useState(false);

  const listViewRef = useRef<SwipeListView<IDexDirecciones>>(null);

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
    const response = await DeleteAdress(data);
    if (response?.result) {
      const newData = [...listData];
      const prevIndex = listData.findIndex((item) => item.dexCodigo === data);
      newData.splice(prevIndex, 1);
      listData = newData;
      queryClient.refetchQueries([QueryKeys.ADRESSES]);
      setLoading(false);
      showToast({
        title: "Se elimino la dirección con exito",
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

  const onRowDidOpen = (data, rowMap) => {
    // closeRow(rowMap, openRowRefs);
    // openRowRefs.push([rowMap, data?.item?.dexCodigo]);
    // openRowRefs = data;
    // console.log("This row opened", data);
  };

  const onRowDidClose = (data, rowMap) => {
    // closeRow(rowMap, undefined);
    // console.log("This row Close", data);
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
          <HStack key={item.dexCodigo} alignItems="center" space={3}>
            <VStack>
              <Text>{item.dexDireccion}</Text>
              <Text>{item.dexCodtName}</Text>
            </VStack>
            <Spacer />
          </HStack>
        </Box>
        {/* <Divider my={2} /> */}
      </Pressable>
    </Box>
  );

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2" bg="coolGray.200" borderRadius={"md"} mx={2} mb={3}>
      <Pressable
        w={data.item.dexCreadoUsuario ? "70" : "140"}
        ml="auto"
        borderRadius={"md"}
        bg="coolGray.200"
        justifyContent="center"
        onPress={
          () => {
            closeRow(rowMap, data.item.dexCodigo);
            navigation.navigate("Direccion", {
              screen: "Direccion",
              params: {
                model: data.item.dexCodigo,
              },
            });
          } /*EditData(rowMap, data.item.key, data.item)*/
        }
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems="center" space={2}>
          <Icon
            as={
              data.item.dexCreadoUsuario ? (
                <Entypo name="dots-three-horizontal" />
              ) : (
                <MaterialIcons name="visibility" />
              )
            }
            size="xs"
            color="coolGray.800"
          />
          <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
            {data.item.dexCreadoUsuario ? "Editar" : "Ver"}
          </Text>
        </VStack>
      </Pressable>
      {data.item.dexCreadoUsuario && (
        <Pressable
          w="70"
          bg="red.500"
          justifyContent="center"
          borderRadius={"md"}
          onPress={() => {
            closeRow(rowMap, data.item.dexCodigo);
            setDataDelete(data.item.dexCodigo);
            setModalVisible(true);
          }}
          _pressed={{
            opacity: 0.5,
          }}
        >
          <VStack alignItems="center" space={2}>
            <Icon
              as={<MaterialIcons name="delete" />}
              color="white"
              size="xs"
            />
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
              Direcciones
            </Text>
            <Button
              isDisabled={false}
              // bg="transparent"
              onPress={() => navigation.navigate("Direccion")}
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
                <Text> Nueva Dirección</Text>
              </View>
            </Button>
          </Row>
          {isLoadingAdresses ? (
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
                    onRowDidClose={onRowDidClose}
                    keyExtractor={(item) => item.dexCodigo}
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
