import React, { useCallback, useState } from "react";
import {
  Actionsheet,
  Box,
  Center,
  Modal,
  Row,
  Spinner,
  Text,
} from "native-base";
import { IAfeAficiones } from "../../../../interfaces/rrhh/IExpExpediente";
import { queryClient } from "../../../../Configs/QueryClient";
import { QueryKeys } from "../../../../Helpers/QueryKeys";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FamiliaresCreateForm from "./HubbiesCreateForm";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/reducers/rootReducer";
import { SaveHubby } from "../../../../Services/rrhh/AfeAficionesExpediente";
import { useCustomToast } from "../../../../hooks/useCustomToast";
import { useFocusEffect } from "@react-navigation/native";

const HubbiesCreatePage = ({ navigation, route }) => {
  const user = useSelector((state: RootState) => state.auth.login);
  const showToast = useCustomToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [goBack, setGoBack] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        navigation.goBack();
      };
    }, [goBack])
  );

  const initialValues: IAfeAficiones = {
    afeCodigo: route?.params?.params?.model?.afeCodigo ?? 0,
    afeCodexp: route?.params?.params?.model?.afeCodexp ?? 0,
    afeCodafi: route?.params?.params?.model?.afeCodafi ?? 0,
    afeCodafiName: route?.params?.params?.model?.afeCodafiName ?? "",
    afePractica: route?.params?.params?.model?.afePractica ?? false,
    afePropertyBagData: route?.params?.params?.model?.afePropertyBagData ?? "",
  };

  const handleSubmit = useCallback(
    async (actionModel: IAfeAficiones) => {
      setLoading(true);

      try {
        const response = await SaveHubby(actionModel, user.employeeId);
        if (response.result) {
          showToast({
            title: "Pasatiempo guardado con exito",
            status: "success",
          });
        } else {
          showToast({
            title: "Hubo un error",
            status: "error",
            description: response.message,
          });
        }
        setGoBack(true);
        // navigation.goBack();
      } catch (exception) {
      } finally {
        setLoading(false);
      }
    },
    [queryClient.refetchQueries([QueryKeys.HUBBIES])]
  );

  return (
    <Box backgroundColor={"#fff"} mb={3} px={3} h={"100%"}>
      {loading ? (
        <Box flex={1}>
          <Row flex={1} justifyContent="center" size={"100%"}>
            <Center>
              <Spinner size={"lg"} />
              <Text color={"#0077CD"} fontSize={"2xl"}>
                Cargando...
              </Text>
            </Center>
          </Row>
        </Box>
      ) : (
        <>
          <Box margin={"0"} style={styles.row} mt={5} mb={3}>
            <TouchableOpacity
              onPress={() => setGoBack(true) /*navigation.goBack()*/}
            >
              <Ionicons name="arrow-back" size={25} />
            </TouchableOpacity>
            <Text fontSize={20} flex={1} style={styles.text}>
              Crear Afición
            </Text>
          </Box>
          <Box style={styles.body}>
            <FamiliaresCreateForm
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              loading={loading}
              newItem={route?.params?.params?.model ? false : true}
              selectedHubby={route?.params?.params?.model}
              navigation={navigation}
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
    // borderColor: "#DADADA",
    flexDirection: "row",
  },
  body: { flex: 18, flexDirection: "row" },
});

export default HubbiesCreatePage;
