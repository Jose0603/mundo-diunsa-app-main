import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  Button,
  Datepicker,
  Spinner,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import {MomentDateService} from "@ui-kitten/moment";
import {Formik} from "formik";
import moment from "moment";
import {
  ArrowBackIcon,
  Box,
  CheckIcon,
  FlatList,
  FormControl,
  HStack,
  Pressable,
  ScrollView,
  Select,
  Text,
  TextArea,
  useToast,
  View,
  VStack,
  WarningOutlineIcon,
} from "native-base";
import React, {useEffect, useState} from "react";
import {Platform, StyleSheet, useWindowDimensions} from "react-native";
import {TabBar, TabView} from "react-native-tab-view";
import {Row, Table} from "react-native-table-component";
import {useMutation} from "react-query";

import {Loading} from "../../../Components/Loading";
import {NoData} from "../../../Components/NoData";
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
  route,
}: IProps): React.ReactElement => {
  const showToast = useCustomToast();
  // const toast = useToast();
  const RenderLeftActions = () => (
    <TopNavigationAction
      icon={<ArrowBackIcon size="4" />}
      onPress={() => navigation.goBack()}
    />
  );
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: "request", title: "Solicitud"},
    {key: "detail", title: "Detalle"},
  ]);

  const year = moment().year();
  const endYear = moment(`${year}-12-31`);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDays, setisLoadingDays] = useState(false);
  const [date, setDate] = useState(moment());
  const [horaDesdeShow, setHoraDesdeShow] = useState<Boolean>(false);
  const [horaHastaShow, setHoraHastaShow] = useState<Boolean>(false);
  const [startHour, setStartHour] = useState(new Date());
  const [endHour, setEndHour] = useState(new Date());
  const [hoursDiff, setHoursDiff] = useState(null);
  const [hoursErr, sethoursErr] = useState("");
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
      onSettled: (response: any, error: any, variables, context) => {
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

  // useEffect(() => {
  //   sethoursErr('');
  //   const hours = Math.abs(endHour.getTime() - startHour.getTime()) / 36e5;
  //   setHoursDiff(hours);
  //   if (hours !== 4) {
  //     sethoursErr('Solo se pueden seleccionar intervalos de 4 horas');
  //   } else {
  //     sethoursErr('');
  //   }
  // }, [startHour, endHour]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      renderLabel={({route}) => (
        <Text style={[{color: "black", margin: 8}]}>{route.title}</Text>
      )}
      indicatorStyle={{backgroundColor: "#2563EB"}}
      style={[
        {backgroundColor: "#fff"},
        {
          width:
            Platform.OS === "web" ? (layout.width * 75) / 100 : layout.width,
        },
      ]}
      scrollEnabled={true}
      tabStyle={{
        width:
          Platform.OS === "web"
            ? (layout.width * 75) / 100 / 2
            : layout.width / 2,
      }}
    />
  );

  const renderItem = ({item}: any) => {
    return (
      <Box
        mx={5}
        py={3}
        borderBottomWidth="1"
        borderColor={"gray.400"}
        justifyContent="center"
      >
        <VStack w="100%">
          <HStack space={3} justifyContent="space-between" mb={1} mt={1}>
            <VStack w="30%">
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                color="coolGray.800"
                bold
              >
                Desde
              </Text>
            </VStack>
            <VStack w="60%" alignItems="flex-start">
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                isTruncated
              >
                {moment(item.desde).format("DD MMM YY hh:mm a")}
              </Text>
            </VStack>
          </HStack>
          <HStack space={3} justifyContent="space-between" mb={1}>
            <VStack w="30%">
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                color="coolGray.800"
                bold
              >
                Hasta
              </Text>
            </VStack>
            <VStack w="60%" alignItems="flex-start">
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                isTruncated
              >
                {moment(item.hasta).format("DD MMM YY hh:mm a")}
              </Text>
            </VStack>
          </HStack>
          <HStack space={3} justifyContent="space-between" mb={1}>
            <VStack w="30%">
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                color="coolGray.800"
                bold
              >
                Motivo
              </Text>
            </VStack>
            <VStack w="60%" alignItems="flex-start">
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                {item.motivo ?? "-"}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    );
  };

  const RequestTab = ({isLoading, couponDetail}) => {
    return (
      <ScrollView
        pt={5}
        _contentContainerStyle={{
          _web: {
            marginX: "48",
          },
        }}
      >
        {isLoading ? (
          <Loading message="Cargando cupones de tiempo libre" />
        ) : couponDetail && couponDetail.saldo && couponDetail.saldo > 0 ? (
          <Formik
            initialValues={{
              date: moment(),
              jornada: "8-12",
              motivo: "",
            }}
            // validationSchema={requestSchema}
            onSubmit={async (values, {setSubmitting, resetForm}) => {
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
                    <Box alignItems="flex-end">
                      <Text bold>
                        Cupones Disponibles: {couponDetail.saldo}
                      </Text>
                    </Box>
                    <FormControl
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
                      isRequired
                      marginY={1}
                      isInvalid={
                        errors.jornada && touched.jornada ? true : false
                      }
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
                        <Select.Item
                          label="Media Jornada (Mañana)"
                          value="8-12"
                        />
                        <Select.Item
                          label="Media Jornada (Tarde)"
                          value="1-5"
                        />
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
                        autoCompleteType={"off"}
                        h={70}
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
                    <Button
                      style={{marginTop: 10}}
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
        ) : (
          <NoData message="No tienes cupones disponibles" />
        )}
      </ScrollView>
    );
  };

  const DetailsTab = ({isLoadingDays, couponDays}) => {
    return (
      <ScrollView
        _contentContainerStyle={{
          _web: {
            marginX: "48",
          },
        }}
      >
        <Box
          shadow="4"
          borderColor={"gray.400"}
          justifyContent="center"
          backgroundColor="#fff"
          borderRadius={5}
          m={5}
          p={4}
        >
          {couponDays && couponDays.length > 0 && (
            <VStack justifyContent="center" alignItems="center" pb={4}>
              <Text
                bold
                color={"blue.600"}
                _dark={{
                  color: "warmGray.200",
                }}
                fontSize="lg"
              >
                Cupones gozados en este periodo
              </Text>
            </VStack>
          )}
          {isLoadingDays ? (
            <Loading message="Cargando Dettalle de cupones..." isFlex />
          ) : (
            <FlatList
              data={couponDays}
              keyExtractor={(item: ICouponEnjoyedDays) => item.desde}
              ListEmptyComponent={
                <NoData message="No hay datos  por mostrar" />
              }
              renderItem={renderItem}
              scrollEnabled={false}
            />
          )}
        </Box>
      </ScrollView>
    );
  };

  const renderScene = ({route}: any) => {
    switch (route.key) {
      case "request":
        return <RequestTab isLoading={isLoading} couponDetail={couponDetail} />;
      case "detail":
        return (
          <DetailsTab isLoadingDays={isLoadingDays} couponDays={couponDays} />
        );
      default:
        return null;
    }
  };

  return (
    <Box safeArea height="100%" backgroundColor="#fff">
      <TopNavigation
        alignment="center"
        title="Cupon de Tiempo Libre"
        accessoryLeft={<RenderLeftActions />}
      />
      <TabView
        lazy
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={{
          width:
            Platform.OS === "web" ? (layout.width * 75) / 100 : layout.width,
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff"},
  head: {height: 40, backgroundColor: "#f1f8ff", padding: 5},
  wrapper: {flexDirection: "row"},
  title: {flex: 1, backgroundColor: "#f6f8fa"},
  row: {height: 28, margin: 5, paddingTop: 5},
  text: {textAlign: "center"},
});

export default FormRequestFreetimeCouponScreen;
