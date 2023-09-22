import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  Datepicker,
  NativeDateService,
  Spinner,
  TopNavigationAction,
} from "@ui-kitten/components";
import { MomentDateService } from "@ui-kitten/moment";
import moment from "moment";
import {
  ArrowBackIcon,
  Box,
  CheckIcon,
  Divider,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input as NbInput,
  Pressable,
  ScrollView,
  Select,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { SwipeListView } from "react-native-swipe-list-view";
import { useMutation } from "react-query";
import * as Yup from "yup";

import { FormErrorMessage } from "../../../Components/FormErrorMessage";
import TopMainBar from "../../../Components/TopMainBar";
import Input from "../../../Components/ui/Input";
import TextBox from "../../../Components/ui/TextBox";
import { queryClient } from "../../../Configs/QueryClient";
import { colors } from "../../../Helpers/Colors";
import { QueryKeys } from "../../../Helpers/QueryKeys";
import { ScreenNames } from "../../../Helpers/ScreenNames";
import { useCustomToast } from "../../../hooks/useCustomToast";
import { useFormWithSchema } from "../../../hooks/useFormWithSchema";
import {
  useContractTypes,
  usePositions,
  usePositionTypes,
  useWorkingCenters,
  useWorkingUnits,
} from "../../../hooks/useOrganization";
import { ISavingNewPositionRequisition } from "../../../interfaces/rrhh/IRequisition";
import { SaveRequisition } from "../../../Services/rrhh/Request";

interface IProps extends NativeStackScreenProps<any, any> {}
const dateService = new MomentDateService("DD/MM/YYYY");
const validationSchema: Yup.SchemaOf<ISavingNewPositionRequisition> =
  Yup.object({
    repCodgrc: Yup.number()
      .moreThan(0, "Selecciona un grupo corporativo")
      .required("Selecciona un grupo corporativo"),
    repCodigo: Yup.number().notRequired(),
    repCodncc: Yup.number().nullable(),
    repCodpue: Yup.number()
      .moreThan(0, "Selecciona el puesto")
      .required("Selecciona el puesto"),
    repCodtco: Yup.number()
      .moreThan(0, "Selecciona el tipo de contrato")
      .required("Selecciona el tipo de contrato"),
    repCodtpp: Yup.number()
      .moreThan(0, "Selecciona el tipo de puesto")
      .required("Selecciona el tipo de puesto"),
    repFechaIniContratacion: Yup.string().required(
      "Selecciona la fecha de inicio"
    ),
    repFechaFinContratacion: Yup.string()
      .when("repCodtco", {
        is: 2,
        then: Yup.string().required("Selecciona una fecha de finalización"),
      })
      .notRequired(),
    repFechaSolicitud: Yup.string().required(
      "Selecciona una fecha de solicitud"
    ),
    repJustificacion: Yup.string().nullable().notRequired(),
    repTipoRequisicion: Yup.string().required(
      "Selecciona el tipo de Requisicion"
    ),
    repNombrePlaza: Yup.string().required("Ingresa un nombre para la plaza"),
    perPersonasRequisicions: Yup.array()
      .of(
        Yup.object().shape({
          perCodigo: Yup.number().nullable(),
          perCodrep: Yup.number().nullable(),
          perNumPersonas: Yup.number(),
          perCodcdt: Yup.number(),
          perCodjor: Yup.number(),
          perCoduni: Yup.number(),
        })
      )
      .min(1, "Debe agregar al menos una nueva plaza"),
  });

const FormRequisitionNewPositionScreen = ({
  navigation,
  route,
}: IProps): React.ReactElement => {
  const showToast = useCustomToast();
  const { ...methods } = useFormWithSchema(validationSchema, {
    defaultValues: {
      repCodgrc: 1,
      repCodigo: 0,
      repCodpue: 0,
      repCodtco: 0,
      repCodtpp: 0,
      repFechaFinContratacion: undefined,
      repFechaIniContratacion: undefined,
      repFechaSolicitud: moment().format("YYYY-MM-DD"),
      repJustificacion: null,
      repNombrePlaza: "",
      repTipoRequisicion: "NuevaPlaza",
      perPersonasRequisicions: [],
    },
  });

  const {
    handleSubmit: onSubmit,
    setValue,
    control,
    watch,
    formState,
  } = methods;
  const errors = formState.errors;

  const [
    repCodtco,
    repCodpue,
    repCodtpp,
    repFechaIniContratacion,
    repFechaFinContratacion,
    perPersonasRequisicions,
  ] = watch([
    "repCodtco",
    "repCodpue",
    "repCodtpp",
    "repFechaIniContratacion",
    "repFechaFinContratacion",
    "perPersonasRequisicions",
  ]);

  const [numPersons, setNumPersons] = useState(0);
  const [selectedWorkingUnit, setSelectedWorkingUnit] = useState(0);
  const [selectedWorkingCenter, setSelectedWorkingCenter] = useState(0);
  const [selectedWorkday] = useState(74);
  const [selectedCorporateGroup] = useState(1);

  const { contractTypes, isLoadingContractTypes } = useContractTypes();
  const { workingUnits, isLoadingWorkingUnits } = useWorkingUnits();
  const { workingCenters, isLoadingWorkingCenters } = useWorkingCenters();
  const { positionTypes, isLoadingPositionTypes } = usePositionTypes();
  const { positions, isLoadingPositions } = usePositions(repCodtpp);

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
    (values: ISavingNewPositionRequisition) => {
      return SaveRequisition(values);
    },
    {
      onSettled: async (response, error: any, variables, context) => {
        if (!response.result) {
          showToast({
            title: "Hubo un error",
            status: "error",
            description: response.message ?? "Ocurrio un error inesperado",
          });
        } else {
          showToast({
            title: `Se ha enviado la solicitud`,
            status: "success",
            // description: data.Message ?? 'Ocurrio un error inesperado',
          });

          await queryClient.invalidateQueries(QueryKeys.REQUISITIONS);
          navigation.goBack();
          // navigation.navigate(ScreenNames.LIST_REQUESTS);
        }
      },
    }
  );

  const handleSubmit = async (pageModel: ISavingNewPositionRequisition) => {
    mutation.mutate(pageModel);
  };

  const Container = ({ title, children }: { title: string; children: any }) => {
    return (
      <Box
        borderWidth={1}
        borderColor="coolGray.200"
        mx={1}
        shadow="1"
        bg="#fff"
        p={3}
        borderRadius="md"
        my={3}
      >
        <Box alignItems="center">
          <Text fontSize="sm">{title}</Text>
          <Divider
            bg={colors.primary}
            mt={1}
            mb={2}
            w="10%"
            h={1}
            borderRadius="md"
          />
        </Box>
        {children}
      </Box>
    );
  };

  const renderItem = ({ item, index }) => {
    const foundCdt = workingCenters.find((e) => e.cdtCodigo === item.perCodcdt);
    const foundUni = workingUnits.find((e) => e.uniCodigo === item.perCoduni);
    return (
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
          <HStack
            px="4"
            py="2"
            borderWidth={1}
            borderRadius={"md"}
            flex={1}
            justifyContent="space-between"
          >
            <VStack alignItems="center" maxW="20%">
              <Text fontSize="xs">Personas</Text>
              <Divider />
              <Text>{item.perNumPersonas}</Text>
            </VStack>
            <VStack alignItems="center" maxW="40%">
              <Text fontSize="xs">Centro de Trabajo</Text>
              <Divider />
              <Text textAlign="center">{foundCdt.cdtDescripcion}</Text>
            </VStack>
            <VStack alignItems="center" maxW="40%" flexWrap="wrap">
              <Text fontSize="xs">Unidad</Text>
              <Divider />
              <Text textAlign="center">{foundUni.uniDescripcion}</Text>
            </VStack>
          </HStack>
        </Pressable>
      </Box>
    );
  };

  const renderHiddenItem = (data, rowMap) => (
    <Box
      flex={1}
      pl="2"
      justifyContent="center"
      bg="coolGray.200"
      borderRadius={"md"}
      mx={2}
      mb={3}
    >
      <Pressable
        bg="red.500"
        flex={1}
        borderRadius={"md"}
        justifyContent="center"
        onPress={() => {
          const newArray = [...perPersonasRequisicions];

          const foundIdx = perPersonasRequisicions.findIndex(
            (e) =>
              e.perCoduni === data.item.perCoduni &&
              e.perCodcdt === data.item.perCodcdt
          );

          if (foundIdx !== -1) {
            newArray.splice(foundIdx, 1);
          }

          setValue("perPersonasRequisicions", newArray);

          // closeRow(rowMap, data.item.emeCodigo);
          // setDataDelete(data.item.emeCodigo);
          // setModalVisible(true);
        }}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <Icon as={<MaterialIcons name="delete" />} color="white" size={5} />
      </Pressable>
    </Box>
  );

  return (
    <Box safeArea height="100%" backgroundColor="#fff">
      <TopMainBar showMenu={false} showBack />
      <ScrollView
        _contentContainerStyle={
          {
            // marginX: '48',
          }
        }
      >
        <FormProvider {...methods}>
          <Box
            _web={{
              marginX: "48",
            }}
            px={3}
          >
            <Heading size="sm">Plaza nueva para puesto existente</Heading>
            <Box mb={3}>
              <Container title="Información de la Requisición">
                <Box mb={3}>
                  <FormControl isInvalid={Boolean(errors.repNombrePlaza)}>
                    <FormControl.Label>Nombre de la plaza</FormControl.Label>
                    <Input
                      name="repNombrePlaza"
                      placeholder="Ingresa un nombre"
                      borderWidth={1}
                      maxLength={150}
                    />
                    <FormErrorMessage
                      message={errors.repNombrePlaza?.message}
                    />
                  </FormControl>
                </Box>
                <Box mb={3}>
                  <FormControl isInvalid={Boolean(errors.repJustificacion)}>
                    <FormControl.Label>
                      Justificación (Opcional)
                    </FormControl.Label>
                    <TextBox
                      name="repJustificacion"
                      placeholder="Ingresa una justificación"
                      borderWidth={1}
                      maxLength={150}
                    />
                    <FormErrorMessage
                      message={errors.repJustificacion?.message}
                    />
                  </FormControl>
                </Box>
              </Container>
              <Container title="Datos de la contratación">
                <Box>
                  <FormControl isInvalid={Boolean(errors.repCodtco)}>
                    <FormControl.Label>
                      Selecciona el tipo de contrato
                    </FormControl.Label>
                    <Select
                      minWidth="200"
                      accessibilityLabel="Selecciona el tipo de contrato"
                      placeholder="Selecciona el tipo de contrato"
                      _selectedItem={{
                        endIcon: <CheckIcon size={5} />,
                      }}
                      isDisabled={mutation.isLoading || isLoadingContractTypes}
                      selectedValue={repCodtco.toString()}
                      mt="1"
                      onValueChange={(itemValue: string) => {
                        setValue("repCodtco", parseInt(itemValue, 10));
                      }}
                    >
                      {contractTypes.map((contractType, index) => {
                        return (
                          <Select.Item
                            key={index}
                            label={contractType.tcoDescripcion}
                            value={contractType.tcoCodigo.toString()}
                          />
                        );
                      })}
                    </Select>
                    {isLoadingContractTypes && (
                      <FormControl.HelperText>
                        {" "}
                        Cargando tipos de contrato...
                      </FormControl.HelperText>
                    )}
                    <FormErrorMessage message={errors.repCodtco?.message} />
                  </FormControl>
                </Box>
                <Box mb={3}>
                  <FormControl
                    w="75%"
                    isRequired
                    marginY={1}
                    isInvalid={Boolean(errors.repFechaIniContratacion)}
                  >
                    <FormControl.Label>Fecha de inicio:</FormControl.Label>
                    <Datepicker
                      placeholder="Fecha de inicio"
                      min={moment()}
                      // max={endYear}
                      date={
                        repFechaIniContratacion
                          ? moment(repFechaIniContratacion)
                          : undefined
                      }
                      dateService={dateService}
                      controlStyle={{
                        backgroundColor: "#fff",
                      }}
                      onSelect={(nextDate) => {
                        setValue(
                          "repFechaIniContratacion",
                          nextDate.format("YYYY-MM-DD")
                        );
                      }}
                    />
                    <FormErrorMessage
                      message={errors.repFechaIniContratacion?.message}
                    />
                  </FormControl>
                </Box>
                {repCodtco === 2 && (
                  <Box mb={3}>
                    <FormControl
                      w="75%"
                      isRequired
                      marginY={1}
                      isInvalid={Boolean(errors.repFechaIniContratacion)}
                    >
                      <FormControl.Label>Fecha de fin:</FormControl.Label>
                      <Datepicker
                        placeholder="Fecha de fin"
                        min={
                          repFechaIniContratacion
                            ? moment(repFechaIniContratacion)
                            : moment()
                        }
                        // max={endYear}
                        date={
                          repFechaFinContratacion
                            ? moment(repFechaFinContratacion)
                            : undefined
                        }
                        dateService={dateService}
                        controlStyle={{
                          backgroundColor: "#fff",
                        }}
                        onSelect={(nextDate) => {
                          setValue(
                            "repFechaFinContratacion",
                            nextDate.format("YYYY-MM-DD")
                          );
                        }}
                      />
                      <FormErrorMessage
                        message={errors.repFechaFinContratacion?.message}
                      />
                    </FormControl>
                  </Box>
                )}
              </Container>

              <Container title="Datos de las Plazas Nuevas a Llenar">
                <Box mb={3}>
                  <FormControl isInvalid={Boolean(errors.repCodtco)}>
                    <FormControl.Label>
                      Selecciona el tipo de Puesto
                    </FormControl.Label>
                    <Select
                      minWidth="200"
                      accessibilityLabel="Selecciona el tipo de Puesto"
                      placeholder="Selecciona el tipo de Puesto"
                      _selectedItem={{
                        endIcon: <CheckIcon size={5} />,
                      }}
                      isDisabled={mutation.isLoading || isLoadingPositionTypes}
                      selectedValue={repCodtpp.toString()}
                      mt="1"
                      onValueChange={(itemValue: string) => {
                        setValue("repCodtpp", parseInt(itemValue, 10));
                      }}
                    >
                      {positionTypes.map((positionType, index) => {
                        return (
                          <Select.Item
                            key={index}
                            label={positionType.tppDescripcion}
                            value={positionType.tppCodigo.toString()}
                          />
                        );
                      })}
                    </Select>
                    {isLoadingContractTypes && (
                      <FormControl.HelperText>
                        {" "}
                        Cargando tipos de Puesto...
                      </FormControl.HelperText>
                    )}
                    <FormErrorMessage message={errors.repCodtco?.message} />
                  </FormControl>
                </Box>

                {repCodtpp > 0 && (
                  <Box mb={3}>
                    <FormControl isInvalid={Boolean(errors.repCodtco)}>
                      <FormControl.Label>Selecciona Puesto</FormControl.Label>
                      <Select
                        minWidth="200"
                        accessibilityLabel="Selecciona Puesto"
                        placeholder="Selecciona Puesto"
                        _selectedItem={{
                          endIcon: <CheckIcon size={5} />,
                        }}
                        isDisabled={mutation.isLoading || isLoadingPositions}
                        selectedValue={repCodpue.toString()}
                        mt="1"
                        onValueChange={(itemValue: string) => {
                          setValue("repCodpue", parseInt(itemValue, 10));
                        }}
                      >
                        {positions.map((position, index) => {
                          return (
                            <Select.Item
                              key={index}
                              label={position.pueNombre}
                              value={position.pueCodigo?.toString()}
                            />
                          );
                        })}
                      </Select>
                      {isLoadingPositions && (
                        <FormControl.HelperText>
                          {" "}
                          Cargando Puestos...
                        </FormControl.HelperText>
                      )}
                      <FormErrorMessage message={errors.repCodtco?.message} />
                    </FormControl>
                  </Box>
                )}
              </Container>

              <Container title="Detalle de Personas a Contratar">
                <Text color="coolGray.400" fontSize="xs" textAlign="center">
                  Ingrese el detalle de las plazas y el número de personas a
                  contratar para el puesto seleccionado
                </Text>

                <Box my={3}>
                  <FormControl
                    isInvalid={Boolean(errors.perPersonasRequisicions)}
                  >
                    <FormControl.Label>
                      Numero de personas a contratar
                    </FormControl.Label>
                    <NbInput
                      onChangeText={(text) => {
                        if (text === "" || text === undefined || text == null) {
                          setNumPersons(0);
                        } else {
                          setNumPersons(parseInt(text, 10));
                        }
                      }}
                      value={String(numPersons)}
                      placeholder="Ingresa la cantidad de personas para la plaza"
                      keyboardType="numeric"
                      borderWidth={1}
                      py={3}
                      backgroundColor="#FFFFFF"
                    />
                    <FormErrorMessage
                      message={errors.perPersonasRequisicions?.message}
                    />
                  </FormControl>
                </Box>

                <Box mb={3}>
                  <FormControl
                    isInvalid={Boolean(errors.perPersonasRequisicions)}
                  >
                    <FormControl.Label>Unidad</FormControl.Label>
                    <Select
                      minWidth="200"
                      accessibilityLabel="Unidad"
                      placeholder="Unidad"
                      _selectedItem={{
                        endIcon: <CheckIcon size={5} />,
                      }}
                      isDisabled={mutation.isLoading || isLoadingWorkingUnits}
                      selectedValue={selectedWorkingUnit.toString()}
                      mt="1"
                      onValueChange={(itemValue: string) => {
                        setSelectedWorkingUnit(parseInt(itemValue, 10));
                      }}
                    >
                      {workingUnits.map((workingUnit) => {
                        return (
                          <Select.Item
                            key={`unidades-${workingUnit.uniDescripcion}`}
                            label={workingUnit.uniDescripcion}
                            value={workingUnit.uniCodigo.toString()}
                          />
                        );
                      })}
                    </Select>
                    {isLoadingWorkingUnits && (
                      <FormControl.HelperText>
                        {" "}
                        Cargando unidades...
                      </FormControl.HelperText>
                    )}
                  </FormControl>
                </Box>

                <Box mb={3}>
                  <FormControl
                    isInvalid={Boolean(errors.perPersonasRequisicions)}
                  >
                    <FormControl.Label>Centro de Trabajo</FormControl.Label>
                    <Select
                      minWidth="200"
                      accessibilityLabel="Centro de Trabajo"
                      placeholder="Centro de Trabajo"
                      _selectedItem={{
                        endIcon: <CheckIcon size={5} />,
                      }}
                      isDisabled={mutation.isLoading || isLoadingWorkingCenters}
                      selectedValue={selectedWorkingCenter.toString()}
                      mt="1"
                      onValueChange={(itemValue: string) => {
                        setSelectedWorkingCenter(parseInt(itemValue, 10));
                      }}
                    >
                      {workingCenters.map((workingCenter, index) => {
                        return (
                          <Select.Item
                            key={index}
                            label={workingCenter.cdtDescripcion}
                            value={workingCenter.cdtCodigo.toString()}
                          />
                        );
                      })}
                    </Select>
                    {isLoadingContractTypes && (
                      <FormControl.HelperText>
                        {" "}
                        Cargando centros de trabajo...
                      </FormControl.HelperText>
                    )}
                    {/* <FormErrorMessage message={errors.perPersonasRequisicions?.message} /> */}
                  </FormControl>
                </Box>
                <Button
                  style={{ marginTop: 10 }}
                  onPress={() => {
                    if (
                      !perPersonasRequisicions.some(
                        (e) =>
                          e.perCodcdt === selectedWorkingCenter &&
                          e.perCoduni === selectedWorkingUnit
                      )
                    ) {
                      setValue("perPersonasRequisicions", [
                        {
                          perCodcdt: selectedWorkingCenter,
                          perCodjor: selectedWorkday,
                          perCoduni: selectedWorkingUnit,
                          perNumPersonas: numPersons,
                          perCodigo: null,
                          perCodrep: null,
                        },
                        ...perPersonasRequisicions,
                      ]);
                    }
                  }}
                  disabled={
                    perPersonasRequisicions.some(
                      (e) =>
                        e.perCodcdt === selectedWorkingCenter &&
                        e.perCoduni === selectedWorkingUnit
                    ) ||
                    numPersons === 0 ||
                    selectedWorkingCenter === 0 ||
                    selectedWorkingUnit === 0
                  }
                  accessoryLeft={
                    mutation.isLoading ? LoadingIndicator : undefined
                  }
                >
                  Agregar
                </Button>
                {perPersonasRequisicions.length > 0 && (
                  <Box my={3}>
                    <Text fontWeight="bold" my={2}>
                      Detalle de personas a contratar por plaza
                    </Text>
                    <SwipeListView
                      disableRightSwipe
                      data={perPersonasRequisicions}
                      renderItem={renderItem}
                      renderHiddenItem={renderHiddenItem}
                      rightOpenValue={-140}
                      previewRowKey={"0"}
                      previewOpenValue={-40}
                      previewOpenDelay={3000}
                      // onRowDidOpen={onRowDidOpen}
                      keyExtractor={(item) =>
                        `${item.perCoduni}-${item.perCodcdt}`
                      }
                      closeOnRowOpen={true}
                      closeOnRowBeginSwipe={true}
                    />
                  </Box>
                )}
              </Container>

              <Button
                style={{ marginTop: 10 }}
                onPress={onSubmit(handleSubmit)}
                disabled={mutation.isLoading}
                accessoryLeft={
                  mutation.isLoading ? LoadingIndicator : undefined
                }
              >
                {mutation.isLoading ? "Enviando..." : "Enviar"}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </ScrollView>
    </Box>
  );
};

export default FormRequisitionNewPositionScreen;
