import {DrawerScreenProps} from "@react-navigation/drawer";
import {
  Box,
  Button,
  FlatList,
  Radio,
  Stack,
  Text,
  View,
  VStack,
} from "native-base";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {usePreguntaTipoEncuesta} from "../../../hooks/usePregunta";
import {NoData} from "../../../Components/NoData";
import TopMainBar from "../../../Components/TopMainBar";
import {SavePreguntasRequest} from "../../../Services/rrhh/EncuestaEnc";
import {useCustomToast} from "../../../hooks/useCustomToast";
import {ScreenNames} from "../../../Helpers/ScreenNames";
import {queryClient} from "../../../Configs/QueryClient";
import {QueryKeys} from "../../../Helpers/QueryKeys";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const SurveyQuestionScreen = ({navigation, route}: IProps) => {
  const {preguntas, isLoadingPreguntas, isFetchingPreguntas} =
    usePreguntaTipoEncuesta(route.params.tipoEncuesta);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useCustomToast();

  const renderItem = (info) => (
    <View>
      <Text mb={5} style={{marginTop: 10}} bold fontSize={"md"}>
        {info.index + 1}. {info.item.descripcion}
      </Text>
      <Radio.Group
        name="myRadioGroup"
        accessibilityLabel="favorite number"
        onChange={(nextValue) => {
          preguntas.find((x) => x.id == info.item.id).answer = +nextValue;
          info.item.answer = nextValue;
        }}
      >
        <Stack
          direction="row"
          alignItems={{
            base: "flex-start",
            md: "center",
          }}
          space={4}
          w="100%"
        >
          <Radio value="1" my={1}>
            1
          </Radio>
          <Radio value="2" my={1}>
            2
          </Radio>
          <Radio value="3" my={1}>
            3
          </Radio>
          <Radio value="4" my={1}>
            4
          </Radio>
          <Radio value="5" my={1}>
            5
          </Radio>
        </Stack>
      </Radio.Group>
    </View>
  );
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await SavePreguntasRequest(preguntas);
      if (res.result) {
        queryClient.invalidateQueries(QueryKeys.SURVEYS);
        showToast({
          title: "Encuesta enviada.",
          status: "success",
          description: res.message,
        });
        navigation.navigate(ScreenNames.RRHH, {
          screen: ScreenNames.SURVEY,
        });
      } else {
        showToast({
          title: "Encuesta no enviada.",
          status: "warning",
          description: res.message,
        });
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Ocurrio un error",
        status: "warning",
        description: "Ocurrio un error al enviar encuesta.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box safeArea backgroundColor="#fff" flex={1}>
      <TopMainBar showBack showMenu={false} />
      <FlatList
        ListHeaderComponent={
          <Box>
            <Text fontSize="xl" mb={5}>
              Preguntas
            </Text>
            <Text fontSize="xs">1. Totalmente Insatisfecho</Text>
            <Text fontSize="xs">2. Insatisfecho</Text>
            <Text fontSize="xs">3. Algo Satisfecho</Text>
            <Text fontSize="xs">4. Satisfecho</Text>
            <Text fontSize="xs">5. Totalmente Satisfecho</Text>
          </Box>
        }
        refreshing={isFetchingPreguntas}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={preguntas}
        renderItem={renderItem}
        ListEmptyComponent={
          <NoData message="No hay preguntas por el momento" />
        }
        ListFooterComponent={
          <Button
            style={{marginTop: 10}}
            onPress={() => {
              handleSubmit();
            }}
          >
            Guardar
          </Button>
        }
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    // maxHeight: "80%",
    marginBottom: 1,
  },
  contentContainer: {
    // paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: "green",
    padding: 5,
    paddingHorizontal: 5,
    marginHorizontal: 15,
    paddingBottom: 15,
  },
});
