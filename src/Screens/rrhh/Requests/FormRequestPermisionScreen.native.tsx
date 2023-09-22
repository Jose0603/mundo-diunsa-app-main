import RNDateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  Datepicker,
  RangeDatepicker,
  Spinner,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { Formik } from "formik";
import moment from "moment-timezone";
import {
  ArrowBackIcon,
  Box,
  CheckIcon,
  FormControl,
  HStack,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Select,
  Switch,
  Text,
  TextArea,
  useToast,
  View,
  VStack,
  WarningOutlineIcon,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useMutation } from "react-query";
import * as Yup from "yup";

import { Loading } from "../../../Components/Loading";
import { ScreenNames } from "../../../Helpers/ScreenNames";
import { ISelect } from "../../../interfaces/rrhh/ISelect";
import {
  GetTntTiposTiempoNoTrabajado,
  SaveRequestCupon,
} from "../../../Services/rrhh/Request";
import { useCustomToast } from "../../../hooks/useCustomToast";

interface IProps extends NativeStackScreenProps<any, any> {}

const FormRequestPermisionScreen = ({
  navigation,
}: IProps): React.ReactElement => {
  const [tiposPermiso, setTiposPermiso] = useState<ISelect[] | undefined>(
    undefined
  );
  const [horaDesdeShow, setHoraDesdeShow] = useState<Boolean>(false);
  const [horaHastaShow, setHoraHastaShow] = useState<Boolean>(false);
  const showToast = useCustomToast();
  // const toast = useToast();
  const RenderLeftActions = () => (
    <TopNavigationAction
      icon={<ArrowBackIcon size="4" />}
      onPress={() => navigation.navigate(ScreenNames.HOME_REQUESTS)}
    />
  );

  const LoadingIndicator = (props: any) => (
    <View style={[props.style]}>
      <Spinner size="small" status="basic" />
    </View>
  );

  const mutation = useMutation(
    (values: any) => {
      return SaveRequestCupon(values);
    },
    {
      onSettled: (response: any, error: any, variables, context) => {
        if (!response.result) {
          showToast({
            title: "Hubo un error",
            status: "error",
            description: response.message ?? "Ocurrio un error inesperado",
          });
        } else {
          variables.resetForm();
          showToast({
            title: `Se ha enviado la solicitud`,
            status: "success",
            // description: data.Message ?? 'Ocurrio un error inesperado',
          });
          // navigation.goBack();
          navigation.navigate(ScreenNames.LIST_REQUESTS);
        }
      },
    }
  );

  const requestSchema = Yup.object().shape({
    tipoPermiso: Yup.string().required("Debe seleccionar el tipo de Permiso."),
    motivo: Yup.string().required("Por favor, ingrese un motivo válido."),
    range: Yup.string().required("Debe seleccionar las fechas."),
    horaDesde: Yup.date().when("especificaHoras", {
      is: true,
      then: Yup.date().required("Debe seleccionar hora de inicio."),
    }),
    horaHasta: Yup.date().when("especificaHoras", {
      is: true,
      then: Yup.date().required("Debe seleccionar hora final."),
    }),
  });

  useEffect(() => {
    fetchTiposPermiso();
  }, []);

  const fetchTiposPermiso = async () => {
    const data = await GetTntTiposTiempoNoTrabajado();
    setTiposPermiso(data);
  };

  return (
    <Box safeArea height="100%" backgroundColor="#fff">
      <TopNavigation
        alignment="center"
        title="Nueva Solicitud Permiso"
        accessoryLeft={<RenderLeftActions />}
      />
      {tiposPermiso ? (
        <ScrollView
          _contentContainerStyle={{
            _web:{
              marginX: "48",
            }
          }}
        >
          <Formik
            initialValues={{
              tipoPermiso: "",
              motivo: "",
              especificaHoras: false,
              rangeDate: {},
              range: "",
              horaDesde: new Date(),
              horaHasta: new Date(),
            }}
            validationSchema={requestSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              mutation.mutate({ ...values, resetForm });
              setSubmitting(false);
              // resetForm();
            }}
          >
            {({
              handleSubmit,
              isSubmitting,
              errors,
              touched,
              setFieldValue,
              values,
            }) => {
              return (
                <>
                  <Box mb={3} px={3}>
                    <FormControl
                      marginY={1}
                      isRequired
                      isInvalid={
                        errors.tipoPermiso && touched.tipoPermiso ? true : false
                      }
                    >
                      <FormControl.Label>Razón</FormControl.Label>
                      <Select
                        accessibilityLabel="SELECCIONE"
                        _selectedItem={{
                          endIcon: <CheckIcon size={5} />,
                        }}
                        selectedValue={values.tipoPermiso}
                        mt={1}
                        onValueChange={(itemValue: string) => {
                          setFieldValue("tipoPermiso", itemValue);
                        }}
                      >
                        {tiposPermiso.map(({ value, text }, index) => {
                          return (
                            <Select.Item
                              key={index}
                              label={text}
                              value={value}
                            />
                          );
                        })}
                      </Select>
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.tipoPermiso}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      marginY={1}
                      isInvalid={errors.motivo && touched.motivo ? true : false}
                    >
                      <FormControl.Label>Motivo:</FormControl.Label>
                      <TextArea
                        h={50}
                        placeholder="Ingrese un motivo..."
                        w={{
                          base: "100%",
                        }}
                        value={values.motivo}
                        onChangeText={(itemValue: string) => {
                          setFieldValue("motivo", itemValue);
                        }}
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.motivo}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl marginY={1}>
                      <FormControl.Label>
                        ¿Tomará día(s) incompletos?:
                      </FormControl.Label>
                      <Switch
                        value={values.especificaHoras}
                        isChecked={values.especificaHoras}
                        onChange={() => {
                          setFieldValue(
                            "especificaHoras",
                            !values.especificaHoras
                          );
                          if (values.especificaHoras) {
                            setFieldValue("horaDesde", null);
                            setFieldValue("horaHasta", null);
                          }
                        }}
                      />
                    </FormControl>
                    <FormControl
                      isRequired
                      marginY={1}
                      isInvalid={
                        errors.range && touched.rangeDate ? true : false
                      }
                    >
                      <FormControl.Label>Desde - Hasta:</FormControl.Label>
                      <RangeDatepicker
                        range={values.rangeDate}
                        onSelect={(nextRange) => {
                          setFieldValue("rangeDate", nextRange);
                          setFieldValue("range", "Yes");
                        }}
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.range}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    {values.especificaHoras && (
                      <HStack>
                        <VStack width="50%">
                          <FormControl
                            isRequired
                            marginY={1}
                            isInvalid={
                              errors.horaDesde &&
                              values.especificaHoras &&
                              touched.horaDesde
                                ? true
                                : false
                            }
                          >
                            <FormControl.Label>Desde:</FormControl.Label>
                            {Platform.OS === "android" ? (
                              <>
                                <Pressable
                                  onPress={() => setHoraDesdeShow(true)}
                                >
                                  <Text>
                                    {values.horaDesde &&
                                      values.horaDesde.toLocaleTimeString()}
                                  </Text>
                                </Pressable>
                                {horaDesdeShow && (
                                  <RNDateTimePicker
                                    value={values.horaDesde || new Date()}
                                    mode="time"
                                    display="default"
                                    timeZoneOffsetInMinutes={0}
                                    onChange={(e, selectedDate) => {
                                      setHoraDesdeShow(false);
                                      if (selectedDate != null)
                                        setFieldValue(
                                          "horaDesde",
                                          selectedDate
                                        );
                                    }}
                                  />
                                )}
                              </>
                            ) : (
                              <RNDateTimePicker
                                value={values.horaDesde || new Date()}
                                mode="time"
                                display="default"
                                timeZoneOffsetInMinutes={0}
                                onChange={(e, selectedDate) => {
                                  setHoraDesdeShow(false);
                                  if (selectedDate != null)
                                    setFieldValue("horaDesde", selectedDate);
                                }}
                              />
                            )}
                            <FormControl.ErrorMessage
                              leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                              {errors.horaDesde}
                            </FormControl.ErrorMessage>
                          </FormControl>
                        </VStack>
                        <VStack width="50%">
                          <FormControl
                            isRequired
                            marginY={1}
                            isInvalid={
                              errors.horaHasta &&
                              values.especificaHoras &&
                              touched.horaHasta
                                ? true
                                : false
                            }
                          >
                            <FormControl.Label>Hasta:</FormControl.Label>
                            {Platform.OS === "android" ? (
                              <>
                                <Pressable
                                  onPress={() => setHoraHastaShow(true)}
                                >
                                  <Text>
                                    {values.horaHasta &&
                                      values.horaHasta.toLocaleTimeString()}
                                  </Text>
                                </Pressable>
                                {horaHastaShow && (
                                  <RNDateTimePicker
                                    value={values.horaHasta || new Date()}
                                    mode="time"
                                    timeZoneOffsetInMinutes={0}
                                    onChange={(e, selectedDate) => {
                                      setHoraHastaShow(false);
                                      if (selectedDate != null) {
                                        setFieldValue(
                                          "horaHasta",
                                          selectedDate
                                        );
                                      }
                                    }}
                                  />
                                )}
                              </>
                            ) : (
                              <RNDateTimePicker
                                value={values.horaHasta || new Date()}
                                mode="time"
                                timeZoneOffsetInMinutes={0}
                                onChange={(e, selectedDate) => {
                                  setHoraHastaShow(false);
                                  if (selectedDate != null) {
                                    setFieldValue("horaHasta", selectedDate);
                                  }
                                }}
                              />
                            )}
                            <FormControl.ErrorMessage
                              leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                              {errors.horaDesde}
                            </FormControl.ErrorMessage>
                          </FormControl>
                        </VStack>
                      </HStack>
                    )}
                    <Button
                      style={{ marginTop: 10 }}
                      onPress={() => {
                        handleSubmit();
                      }}
                      disabled={mutation.isLoading}
                      accessoryLeft={
                        mutation.isLoading ? LoadingIndicator : undefined
                      }
                    >
                      {mutation.isLoading
                        ? "Enviando Solicitud"
                        : "Enviar Solicitud"}
                    </Button>
                  </Box>
                </>
              );
            }}
          </Formik>
        </ScrollView>
      ) : (
        <Loading message="Cargando..." />
      )}
    </Box>
  );
};

export default FormRequestPermisionScreen;
