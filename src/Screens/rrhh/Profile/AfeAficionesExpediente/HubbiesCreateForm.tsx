import React, { useEffect, useState } from "react";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  CheckIcon,
  FlatList,
  FormControl,
  HStack,
  Input,
  Pressable,
  Select,
  Switch,
  Text,
  View,
  WarningOutlineIcon,
} from "native-base";
import { ScrollView, StyleSheet } from "react-native";
import useIncidents from "../../../../hooks/useIncidents";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/reducers/rootReducer";
import { ExpedienteService } from "../../../../Services/rrhh/ExpExpediente";
import { IAfeAficiones } from "../../../../interfaces/rrhh/IExpExpediente";
import { useHubby } from "../../../../hooks/useExpediente";
import { FormErrorMessage } from "../../../../Components/FormErrorMessage";
import ButtonSoup from "../../../../Components/ButtonSoup";
import { ItemClick } from "native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types";

interface FormProps {
  initialValues: IAfeAficiones;
  loading: boolean;
  handleSubmit: (model: IAfeAficiones) => any; // accion submit (create/update)
  newItem: boolean;
  selectedHubby: number[];
  navigation: any;
}

const HubbiesCreateForm = ({
  initialValues,
  handleSubmit,
  newItem,
  selectedHubby,
  navigation,
}: FormProps): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const { hubbies, isLoadingHubbies } = useHubby();

  const booleans = [
    {
      label: " Si ",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];
  const validationSchema: Yup.SchemaOf<IAfeAficiones> = Yup.object({
    afeCodigo: Yup.number().required(),
    afeCodexp: Yup.number().notRequired(),
    afeCodafi: Yup.number()
      .min(1, "Seleccione una afición.")
      .required("Seleccione una afición"),
    afeCodafiName: Yup.string().notRequired(),
    afePractica: Yup.boolean(),
    afePropertyBagData: Yup.string().notRequired(),
  });

  return (
    <ScrollView>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(model: IAfeAficiones) => {
          handleSubmit(model);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }: FormikProps<IAfeAficiones>) => (
          <Box mb={3} px={3}>
            <Box mb={3}>
              <FormControl.Label>Código: Nuevo</FormControl.Label>

              <FormControl
                mb={4}
                isInvalid={Boolean(errors.afeCodafi && touched.afeCodafi)}
              >
                <FormControl.Label>Afición</FormControl.Label>
                {/* <FlatList
                  contentContainerStyle={{ alignSelf: "flex-start" }}
                  numColumns={3}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={hubbies}
                  renderItem={({ item }) => (
                    <Button
                      key={item.value}
                      variant="outline"
                      onPress={() => {
                        setFieldValue("afeCodafi", item.value);
                      }}
                      size="md"
                      // color={"gray.500"}
                      _disabled={{
                        bg: "gray.100",
                      }}
                      mr={3}
                      mb={3}
                      borderColor={
                        item.value == values.afeCodafi ? "#0077CD" : "gray.300"
                      }
                      bg={
                        item.value == values.afeCodafi
                          ? "#F2F8FC"
                          : "transparent"
                      }
                      // style={item.item.value == value ? styles.selected : styles.unselected}
                      _text={{
                        color:
                          item.value == values.afeCodafi
                            ? "#0077CD"
                            : "gray.500", //605D60 || 777377
                        fontWeight: "medium",
                      }}
                      isDisabled={selectedHubby.includes(+item.value)}
                    >
                      {item.label}
                    </Button>
                  )}
                  keyExtractor={(item) => `afeCodafi-${item.value}`}
                  onEndReachedThreshold={0.5}
                /> */}
                <View flexDirection={"row"} flexWrap={"wrap"}>
                  {hubbies.map((item) => {
                    return (
                      <Button
                        key={item.value}
                        variant="outline"
                        onPress={() => {
                          setLoading(true);
                          setFieldValue("afeCodafi", item.value);
                          setLoading(false);
                        }}
                        size="md"
                        // color={"gray.500"}
                        _disabled={{
                          backgroundColor: "gray.100",
                        }}
                        mr={3}
                        mb={3}
                        borderColor={
                          item.value == values.afeCodafi
                            ? "#0077CD"
                            : "gray.300"
                        }
                        bg={
                          item.value == values.afeCodafi
                            ? "#F2F8FC"
                            : "transparent"
                        }
                        _text={{
                          color:
                            item.value == values.afeCodafi
                              ? "#0077CD"
                              : "gray.500", //605D60 || 777377
                          fontWeight: "medium",
                        }}
                        isDisabled={selectedHubby.includes(+item.value)}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </View>
                <FormErrorMessage message={errors.afeCodafi} />
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={Boolean(errors.afePractica && touched.afePractica)}
              >
                <FormControl.Label>¿Lo practica?</FormControl.Label>
                <HStack>
                  <Text mt={5}>No{"  "}</Text>
                  <Switch
                    colorScheme="primary"
                    value={values.afePractica}
                    onChange={() => {
                      setFieldValue("afePractica", !values.afePractica);
                    }}
                    size="lg"
                  />
                  <Text mt={5}>{"  "}Si</Text>
                </HStack>
                <FormErrorMessage message={errors.afePractica} />
              </FormControl>
            </Box>
            <View
              flex={1}
              flexDirection={"row"}
              justifyContent={"space-between"}
              mx={8}
            >
              <Button
                w={"40%"}
                variant={"outline"}
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                w={"40%"}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                Guardar
              </Button>
            </View>
          </Box>
        )}
      </Formik>
    </ScrollView>
  );
};

export default HubbiesCreateForm;
