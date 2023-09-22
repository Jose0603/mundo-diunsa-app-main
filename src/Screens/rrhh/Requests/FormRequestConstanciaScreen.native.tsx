import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  RangeDatepicker,
  Spinner,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { Formik } from "formik";
import {
  ArrowBackIcon,
  Box,
  CheckIcon,
  Container,
  FormControl,
  KeyboardAvoidingView,
  ScrollView,
  Select,
  Switch,
  TextArea,
  useToast,
  View,
  WarningOutlineIcon,
} from "native-base";
import React from "react";
import { useMutation } from "react-query";
import * as Yup from "yup";

import { ScreenNames } from "../../../Helpers/ScreenNames";
import { SaveRequestConstancia } from "../../../Services/rrhh/Request";
import { useCustomToast } from "../../../hooks/useCustomToast";

interface IProps extends NativeStackScreenProps<any, any> {}

const FormRequestConstanciaScreen = ({
  navigation,
  route,
}: IProps): React.ReactElement => {
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
      return SaveRequestConstancia(values);
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
    tipoConstancia: Yup.string().required("Seleccione un Tipo de Constancia"),
    dirigidaA: Yup.string().required("Debe ingresar un valor."),
    delegado: Yup.string().when("delegarEntrega", {
      is: true,
      then: Yup.string().required("Debe ingresar un valor."),
    }),
    range: Yup.string().when("tipoConstancia", {
      is: "Embajada",
      then: Yup.string().required("Debe seleccionar las fechas."),
    }),
    motivo: Yup.string().when("tipoConstancia", {
      is: "Embajada",
      then: Yup.string().required("Debe ingresar un valor."),
    }),
  });

  let tiposConstancia = [
    {
      text: "Salario",
      value: "Sueldo",
    },
    {
      text: "Trabajo",
      value: "Trabajo",
    },
    {
      text: "Embajada",
      value: "Embajada",
    },
  ];

  return (
    <Box safeArea height="100%" backgroundColor="#fff">
      <TopNavigation
        alignment="center"
        title="Nueva Solicitud Constancia"
        accessoryLeft={<RenderLeftActions />}
      />
      <ScrollView
        _contentContainerStyle={{
          _web:{
            marginX: "48",
          }
        }}
      >
        <Formik
          initialValues={{
            tipoConstancia: "",
            dirigidaA: undefined,
            delegarEntrega: false,
            delegado: "",
            rangeDate: {},
            range: "",
            motivo: "",
            comentario: "",
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
                      errors.tipoConstancia && touched.tipoConstancia
                        ? true
                        : false
                    }
                  >
                    <FormControl.Label>Tipo de Constancia</FormControl.Label>
                    <Select
                      accessibilityLabel="SELECCIONE"
                      _selectedItem={{
                        endIcon: <CheckIcon size={5} />,
                      }}
                      selectedValue={values.tipoConstancia}
                      mt={1}
                      onValueChange={(itemValue: string) => {
                        setFieldValue("tipoConstancia", itemValue);
                        if (values.tipoConstancia === "Embajada") {
                          setFieldValue("motivo", "");
                          setFieldValue("rangeDate", {});
                          setFieldValue("range", "");
                        }
                      }}
                    >
                      {tiposConstancia.map(({ value, text }, index) => {
                        return (
                          <Select.Item key={index} label={text} value={value} />
                        );
                      })}
                    </Select>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.tipoConstancia}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    marginY={1}
                    isInvalid={
                      errors.dirigidaA && touched.dirigidaA ? true : false
                    }
                  >
                    <FormControl.Label>Dirigida a:</FormControl.Label>
                    <TextArea
                      h={50}
                      placeholder="Escribir..."
                      w={{
                        base: "100%",
                      }}
                      value={values.dirigidaA}
                      onChangeText={(itemValue: string) => {
                        setFieldValue("dirigidaA", itemValue);
                      }}
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.dirigidaA}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl marginY={1}>
                    <FormControl.Label>
                      ¿Se delegará la entrega?:
                    </FormControl.Label>
                    <Switch
                      value={values.delegarEntrega}
                      isChecked={values.delegarEntrega}
                      onChange={() => {
                        setFieldValue("delegarEntrega", !values.delegarEntrega);
                        if (values.delegarEntrega)
                          setFieldValue("delegado", "");
                      }}
                    />
                  </FormControl>
                  {values.delegarEntrega && (
                    <FormControl
                      isRequired
                      marginY={1}
                      isInvalid={
                        errors.delegado &&
                        values.delegarEntrega &&
                        touched.delegado
                          ? true
                          : false
                      }
                    >
                      <FormControl.Label>
                        Nombre del delegado:
                      </FormControl.Label>
                      <TextArea
                        h={50}
                        placeholder="Ingresa un nombre"
                        w={{
                          base: "100%",
                        }}
                        value={values.delegado}
                        onChangeText={(itemValue: string) => {
                          setFieldValue("delegado", itemValue);
                        }}
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.delegado}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  )}
                  {values.tipoConstancia === "Embajada" && (
                    <>
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
                      <FormControl
                        isRequired
                        marginY={1}
                        isInvalid={
                          errors.motivo && touched.motivo ? true : false
                        }
                      >
                        <FormControl.Label>Motivo del viaje:</FormControl.Label>
                        <TextArea
                          h={50}
                          placeholder="Ingresa su motivo de viaje"
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
                    </>
                  )}
                  <FormControl marginY={1}>
                    <FormControl.Label>
                      Ingresa un comentario:
                    </FormControl.Label>
                    <TextArea
                      h={50}
                      placeholder="Ingresa un comentario"
                      w={{
                        base: "100%",
                      }}
                      value={values.comentario}
                      onChangeText={(itemValue: string) => {
                        setFieldValue("comentario", itemValue);
                      }}
                    />
                  </FormControl>
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
    </Box>
  );
};

export default FormRequestConstanciaScreen;
