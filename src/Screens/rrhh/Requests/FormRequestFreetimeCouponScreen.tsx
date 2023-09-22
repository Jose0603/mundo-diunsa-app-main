import {AntDesign} from "@expo/vector-icons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Datepicker, Spinner} from "@ui-kitten/components";
import {MomentDateService} from "@ui-kitten/moment";
import {Formik} from "formik";
import moment from "moment";
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  Icon,
  ScrollView,
  Select,
  Text,
  TextArea,
  View,
  WarningOutlineIcon,
} from "native-base";
import React, {useEffect, useState} from "react";
import {useMutation} from "react-query";

import {Loading} from "../../../Components/Loading";
import {NoData} from "../../../Components/NoData";
import TopMainBar from "../../../Components/TopMainBar";
import {ScreenNames} from "../../../Helpers/ScreenNames";
import {useCustomToast} from "../../../hooks/useCustomToast";
import {
  ICouponCount,
  ICouponEnjoyedDays,
} from "../../../interfaces/rrhh/IRequestFreetimeCupon";
import {
  GetCouponCount,
  GetCouponEnjoyedDays,
  SaveRequestFreetimeCupon,
} from "../../../Services/rrhh/Request";

import "moment/locale/es";

moment.locale("es");

interface IProps extends NativeStackScreenProps<any, any> {}
const dateService = new MomentDateService("DD/MM/YYYY");

const FormRequestFreetimeCouponScreen = ({
  navigation,
}: IProps): React.ReactElement => {
  const showToast = useCustomToast();

  const year = moment().year();
  const endYear = moment(`${year}-12-31`);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDays, setisLoadingDays] = useState(false);
  const [date, setDate] = useState(moment());
  const [couponDetail, setCouponDetail] = useState<ICouponCount>();
  const [couponDays, setcouponDays] = useState<ICouponEnjoyedDays[]>();

  const LoadingIndicator = (props: any) => (
    <View style={[props.style]}>
      <Spinner size="small" status="basic" />
    </View>
  );

  const mutation = useMutation(
    (values: any) => {
      return SaveRequestFreetimeCupon(values);
    },
    {
      onSettled: (response: any, error: any, variables) => {
        if (!response.result) {
          showToast({
            title:
              response.message === "No tienes cupones disponibles"
                ? "Cupones insuficientes"
                : "Hubo un error",
            status: "error",
            description:
              response.message === "No tienes cupones disponibles"
                ? response.message
                : response.message ?? "Ocurrio un error inesperado",
          });
        } else {
          variables.resetForm();
          showToast({
            title: `Se ha enviado la solicitud`,
            status: "success",
          });
          navigation.navigate(ScreenNames.LIST_REQUESTS);
        }
      },
    }
  );

  useEffect(() => {
    setIsLoading(true);
    setisLoadingDays(true);
    (async () => {
      try {
        const res = await GetCouponCount();
        setCouponDetail(res);
      } catch (error) {
        showToast({
          title: "Hubo un error",
          status: "error",
          description: "Ocurrio un error al consultar los cupones disponibles",
        });
      } finally {
        setIsLoading(false);
      }

      try {
        const res = await GetCouponEnjoyedDays();
        setcouponDays(res);
      } catch (error) {
        showToast({
          title: "Hubo un error",
          status: "error",
          description:
            "Ocurrio un error al consultar el detalle de cupones gozados",
        });
      } finally {
        setisLoadingDays(false);
      }
    })();
  }, []);

  const RequestTab = ({isLoading, couponDetail}) => {
    return (
      <Formik
        initialValues={{
          date: moment(),
          jornada: "8-12",
          motivo: "",
        }}
        // validationSchema={requestSchema}
        onSubmit={async (values, {resetForm}) => {
          // if (date !== null && startHour !== null && endHour !== null && hoursDiff !== null && hoursDiff === 4) {
          //   const _date = date.format('YYYY-MM-DD');
          //   const _startHour = JSON.stringify(startHour).replace('"', '').split('T')[1].split('Z')[0];
          //   const _endHour = JSON.stringify(endHour).replace('"', '').split('T')[1].split('Z')[0];
          //   const fromDate = moment.utc(`${_date}T${_startHour}Z`);
          //   const toDate = moment.utc(`${_date}T${_endHour}Z`);
          //   console.log({ date: date, horaDesde: fromDate, horaHasta: toDate, motivo: values.motivo });
          // }
          mutation.mutate({
            date: date,
            motivo: values.motivo,
            jornada: values.jornada,
            resetForm,
          });
        }}
      >
        {({handleSubmit, errors, touched, setFieldValue, values}) => {
          return (
            <>
              <Box mb={3} px={3} w="50%" alignSelf="flex-start">
                <Box alignItems="center">
                  <Text fontSize="xl" bold>
                    Solicitud de Cupón de Tiempo Libre
                  </Text>
                  <Text>Cupones Disponibles: {couponDetail.saldo}</Text>
                </Box>
                <FormControl
                  w="50%"
                  isRequired
                  marginY={1}
                  isInvalid={errors.date && touched.date ? true : false}
                >
                  <FormControl.Label>Fecha:</FormControl.Label>
                  <Datepicker
                    placeholder="Selecciona la fecha"
                    min={moment()}
                    max={endYear}
                    date={date}
                    dateService={dateService}
                    controlStyle={{
                      backgroundColor: "#fff",
                    }}
                    onSelect={(nextDate) => {
                      setDate(nextDate);
                    }}
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.date}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  w="75%"
                  isRequired
                  marginY={1}
                  isInvalid={errors.jornada && touched.jornada ? true : false}
                >
                  <FormControl.Label>Horario:</FormControl.Label>
                  <Select
                    accessibilityLabel="SELECCIONE"
                    _selectedItem={{
                      endIcon: <CheckIcon size={5} />,
                    }}
                    selectedValue={values.jornada}
                    mt={1}
                    onValueChange={(itemValue: string) => {
                      // setSelectedCategory(itemValue);
                      setFieldValue("jornada", itemValue);
                    }}
                  >
                    <Select.Item label="Media Jornada (Mañana)" value="8-12" />
                    <Select.Item label="Media Jornada (Tarde)" value="1-5" />
                  </Select>
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.jornada}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl marginY={1}>
                  <FormControl.Label>Motivo: (Opcional)</FormControl.Label>
                  <TextArea
                    h={70}
                    placeholder="Ingrese un motivo..."
                    w={{
                      base: "100%",
                    }}
                    backgroundColor="#fff"
                    value={values.motivo}
                    onChangeText={(itemValue: string) => {
                      setFieldValue("motivo", itemValue);
                    }}
                    autoCompleteType={undefined}
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.motivo}
                  </FormControl.ErrorMessage>
                </FormControl>
                <Button
                  onPress={() => {
                    handleSubmit();
                  }}
                  alignSelf="center"
                  maxW="50%"
                  mt={5}
                  disabled={mutation.isLoading}
                  isLoading={mutation.isLoading}
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
    );
  };

  return (
    <Box safeArea height="100%" backgroundColor="#fff">
      {/* <TopNavigation alignment="center" title="Cupon de Tiempo Libre" accessoryLeft={<RenderLeftActions />} /> */}
      <TopMainBar />
      <Box flex={1}>
        {isLoading ? (
          <Loading message="Cargando cupones de tiempo libre" />
        ) : couponDetail && couponDetail.saldo && couponDetail.saldo > 0 ? (
          <Box paddingX="20%">
            <Icon
              as={AntDesign}
              size="lg"
              name="arrowleft"
              _dark={{
                color: "warmGray.50",
              }}
              color="#000"
              // p={2}
              onPress={() => {
                navigation.goBack();
              }}
            />

            <RequestTab isLoading={isLoading} couponDetail={couponDetail} />
          </Box>
        ) : (
          <NoData message="No tienes cupones disponibles" />
        )}
      </Box>
    </Box>
  );
};

export default FormRequestFreetimeCouponScreen;
