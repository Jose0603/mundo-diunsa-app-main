import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Box, Center, Row, Spinner, Text } from "native-base";
import { IDexDirecciones } from "../../../../interfaces/rrhh/IExpExpediente";
import { QueryKeys } from "../../../../Helpers/QueryKeys";

import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DirectionCreateForm from "./DirectionCreateForm";
import {
  SaveAdress,
  UpdateAdress,
} from "../../../../Services/rrhh/DexDireccionesExpediente";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/reducers/rootReducer";
import { useCustomToast } from "../../../../hooks/useCustomToast";
import { queryClient } from "../../../../Configs/QueryClient";
import { useUserAddress } from "../../../../hooks/useExpediente";
import { useFocusEffect } from "@react-navigation/native";
import useAlert from "../../../../hooks/useAlert";
import { setChange } from "../../../../Redux/reducers/rrhh/expedienteSlice";

const DirectionCreatePage = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.login);
  const { adress, isLoadingAdress } = useUserAddress(
    route?.params?.params?.model
  );
  const showToast = useCustomToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [process, setProcess] = useState(0);
  const { change } = useSelector((state: RootState) => state.expediente);
  const alert = useAlert();

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      console.log("process", process, "change", change);
      if (!change) {
        return;
      }

      e.preventDefault();

      if (process != 2) {
        if (change && process == 1) {
          //change && stop
          console.log("no change 1");
          navigation.navigate("Address", { screen: "Direcciones" });

          return;
        }
        setProcess(2);
      }
      if (process == 2 && change) {
        //change && !stop
        console.log("no change 0");
        setProcess(1);
        alert.show({
          onPress: () => {
            dispatch(setChange(false));
            navigation.dispatch(e.data.action);
          },
          isOpen: true,
        });
        setProcess(0);
      }
    }),
      [navigation, change];
  });

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (tabPress) {
  //       return () => {
  //         navigation.goBack();
  //         dispatch(setTabPress(false));
  //       };
  //     }
  //   }, [])
  // );

  useLayoutEffect(() => {
    const blur = navigation.addListener("blur", () => {
      setProcess(1);
      navigation.popToTop();
    });
  }, []);

  const initialValues: IDexDirecciones = {
    dexCodigo: adress?.dexCodigo ?? 0,
    dexCodexp: adress?.dexCodexp ?? 0,
    dexDireccion: adress?.dexDireccion ?? "",
    dexTipoPropiedad: adress?.dexTipoPropiedad ?? "",
    dexPais: adress?.dexPais ?? "",
    dexDep: adress?.dexDep ?? 0,
    dexCodmun: adress?.dexCodmun ?? 0,
    dexBarrio: adress?.dexBarrio ?? "",
    dexCodigoPostal: adress?.dexCodigoPostal ?? "",
    dexTelefono: adress?.dexTelefono ?? "",
    dexCodtid: adress?.dexCodtid ?? 0,
    dexCodtName: adress?.dexCodtName ?? "",
    dexObservacion: adress?.dexObservacion ?? "",
    dexCreadoUsuario: adress?.dexCreadoUsuario ?? false,
  };

  const handleSubmit = useCallback(async (actionModel: IDexDirecciones) => {
    setLoading(true);

    try {
      if (actionModel?.dexCodigo == 0) {
        dispatch(setChange(false));
        const response = await SaveAdress(actionModel, user.employeeId);
        if (response.result) {
          showToast({
            title: "Dirección creada con exito",
            status: "success",
          });
        } else {
          showToast({
            title: "Hubo un error",
            status: "error",
            description: response.message,
          });
        }
        navigation.goBack();
      } else if (actionModel?.dexCodigo > 0) {
        dispatch(setChange(false));
        const response = await UpdateAdress(actionModel);
        if (response.result) {
          showToast({
            title: "Dirección actualizada con exito",
            status: "success",
          });
        } else {
          showToast({
            title: "Hubo un error",
            status: "error",
            description: response.message,
          });
        }
        navigation.goBack();
      }
    } catch (exception) {
    } finally {
      dispatch(setChange(false));
      queryClient.refetchQueries([QueryKeys.ADRESSES]);
      setLoading(false);
    }
  }, []);

  return (
    <Box backgroundColor={"#fff"} mb={3} px={3} h={"100%"}>
      {loading || isLoadingAdress ? (
        <Box flex={1}>
          <Row flex={1} justifyContent="center" size={"100%"}>
            <Center>
              <Spinner size={"lg"} />
              <Text color={"#0077CD"} fontSize={"2xl"}>
                {adress ? "Actualizando..." : "Cargando..."}
              </Text>
            </Center>
          </Row>
        </Box>
      ) : (
        <>
          <Box margin={"0"} style={styles.row} mt={5} mb={3}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="arrow-back" size={25} />
            </TouchableOpacity>
            <Text fontSize={20} flex={1} style={styles.text}>
              {initialValues.dexCodigo == 0
                ? "Crear Dirección"
                : initialValues.dexCreadoUsuario == false
                ? "Ver Dirección"
                : "Editar Dirección"}
            </Text>
          </Box>
          {/* <Box
        pl="4"
        pr="5"
        py="2"
        mb="5"
        borderColor={"#C0C0C0"}
        borderWidth={2}
        borderRadius={"md"}
      >
        <HStack key={initialValues.dexCodigo} alignItems="center" space={3}>
          <VStack>
            <Text>{initialValues.dexDireccion}</Text>
            <Text>{initialValues.dexCodtName}</Text>
          </VStack>
        </HStack>
      </Box> */}
          <Box style={styles.body}>
            <DirectionCreateForm
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              loading={loading}
              newItem={adress ? false : true}
              navigation={navigation}
              setProcess={setProcess}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#000",
  },
  content: {
    backgroundColor: "#fff",
    margin: 0,
  },
  text: { margin: 0, textAlign: "center" },
  row: {
    flex: 1,
    backgroundColor: "#fff",
    // borderTopWidth: 2,
    flexDirection: "row",
  },
  body: { flex: 18, flexDirection: "row" },
});

export default DirectionCreatePage;
