import {DrawerScreenProps} from "@react-navigation/drawer";
import {
  Box,
  Button,
  FormControl,
  Radio,
  Stack,
  Text,
  TextArea,
  VStack,
  WarningOutlineIcon,
} from "native-base";
import React, {useState} from "react";
import {Platform, StyleSheet} from "react-native";
import TopMainBar from "../../../Components/TopMainBar";
import {useCustomToast} from "../../../hooks/useCustomToast";
import {Formik} from "formik";
import * as Yup from "yup";
import {IEncuestaClimometro} from "../../../interfaces/rrhh/IEncuestaClimometro";
import {SavePreguntasClimometroRequest} from "../../../Services/rrhh/EncuestaEnc";
import {queryClient} from "../../../Configs/QueryClient";
import {QueryKeys} from "../../../Helpers/QueryKeys";
import {ScreenNames} from "../../../Helpers/ScreenNames";

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const SurveyQuestionClimometroScreen = ({navigation, route}: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useCustomToast();
  const [data, setData] = useState<any>(route.params.data);

  const handleSubmit = async (preguntas: any) => {
    console.log(
      "🚀 ~ file: SurveyQuestionClimometroScreen.tsx:67 ~ handleSubmit ~ data:",
      data.data
    );
    setIsLoading(true);
    try {
      const res = await SavePreguntasClimometroRequest(preguntas);
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

  const requestSchema: Yup.SchemaOf<IEncuestaClimometro> = Yup.object({
    id: Yup.number().optional(),
    respuesta: Yup.string()
      .min(2, "Seleccione una opcion.")
      .required("Seleccione una opcion."),
    comentarioPos: Yup.string().optional(),
    comentarioNeg: Yup.string().optional(),
    correlativo: Yup.string().optional(),
  });

  const RequestTab = () => {
    return (
      <Formik
        initialValues={{
          id: 0,
          respuesta: "",
          comentarioPos: "",
          comentarioNeg: "",
          correlativo: "",
        }}
        validationSchema={requestSchema}
        onSubmit={async (values) => {
          handleSubmit(values);
        }}
      >
        {({handleSubmit, errors, touched, setFieldValue, values}) => {
          return (
            <Box mb={3} px={3} w="100%" alignSelf="flex-start">
              <Box alignItems="center">
                <Text fontSize="xl" bold>
                  Preguntas
                </Text>
              </Box>
              <Text fontSize="xl">
                Mes: <Text bold>{data.data.mes}</Text>
              </Text>
              <FormControl
                w="100%"
                isRequired
                marginY={1}
                isInvalid={errors.respuesta && touched.respuesta ? true : false}
              >
                <Text>
                  Estoy satisfecho con la ejecución del plan de acción que nos
                  hemos comprometido vivir en el departamento de:
                  <Text bold>{data.data.departamento}</Text>
                </Text>

                <Radio.Group
                  name="myRadioGroup"
                  accessibilityLabel="favorite number"
                  onChange={(nextValue) => {
                    setFieldValue("respuesta", nextValue);
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems={{
                      base: "flex-start",
                      md: "center",
                    }}
                    space={4}
                    w="75%"
                    maxW="300px"
                  >
                    <Radio value="Si" my={1}>
                      Si
                    </Radio>
                    <Radio value="No" my={1}>
                      No
                    </Radio>
                  </Stack>
                </Radio.Group>
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.respuesta}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                w={[Platform.OS === "web" ? "50%" : "100%"]}
                marginY={1}
                isInvalid={
                  errors.comentarioPos && touched.comentarioPos ? true : false
                }
              >
                <FormControl.Label>Comentario Positivo:</FormControl.Label>
                <TextArea
                  marginY={1}
                  autoCompleteType={"off"}
                  h={70}
                  placeholder="Ingrese Comentario Positivo..."
                  w={{
                    base: "100%",
                  }}
                  onChangeText={(itemValue: string) => {
                    setFieldValue("comentarioPos", itemValue);
                  }}
                />
              </FormControl>
              <FormControl
                w={[Platform.OS === "web" ? "50%" : "100%"]}
                marginY={1}
                isInvalid={
                  errors.comentarioNeg && touched.comentarioNeg ? true : false
                }
              >
                <FormControl.Label>Comentario Negativo:</FormControl.Label>
                <TextArea
                  marginY={1}
                  autoCompleteType={"off"}
                  h={70}
                  placeholder="Ingrese Comentario Negativo..."
                  w={{
                    base: "100%",
                  }}
                  onChangeText={(itemValue: string) => {
                    setFieldValue("comentarioNeg", itemValue);
                  }}
                />
              </FormControl>

              <Button
                onPress={() => {
                  handleSubmit();
                }}
                alignSelf="center"
                maxW="50%"
                mt={5}
                isLoading={isLoading}
              >
                {isLoading ? "Enviando Solicitud" : "Enviar Solicitud"}
              </Button>
            </Box>
          );
        }}
      </Formik>
    );
  };
  return (
    <Box safeArea backgroundColor="#fff" flex={1}>
      <TopMainBar showBack showMenu={false} />
      <Box h={"full"}>
        <VStack mt={5} mx={5}>
          <RequestTab></RequestTab>
        </VStack>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: "100%",
  },
  contentContainer: {
    // paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: "green",
  },
});
