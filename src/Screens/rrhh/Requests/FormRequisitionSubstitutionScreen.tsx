import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Button, Datepicker, Spinner } from '@ui-kitten/components';
import { MomentDateService } from '@ui-kitten/moment';
import moment from 'moment';
import {
  Box,
  CheckIcon,
  Divider,
  FormControl,
  Heading,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Select,
  Text,
  View,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React, { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { Platform, ListRenderItemInfo } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { FormErrorMessage } from '../../../Components/FormErrorMessage';
import TopMainBar from '../../../Components/TopMainBar';
import TextBox from '../../../Components/ui/TextBox';
import { queryClient } from '../../../Configs/QueryClient';
import { colors } from '../../../Helpers/Colors';
import { QueryKeys } from '../../../Helpers/QueryKeys';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { useCustomToast } from '../../../hooks/useCustomToast';
import { useFormWithSchema } from '../../../hooks/useFormWithSchema';
import { useContractTypes } from '../../../hooks/useOrganization';
import { useSubordinates } from '../../../hooks/useRequest';
import { ISavingSubstitutionRequisition, ISubordinatePosition } from '../../../interfaces/rrhh/IRequisition';
import { RootState } from '../../../Redux/reducers/rootReducer';
import { removeSelected, resetValues } from '../../../Redux/reducers/rrhh/requisitionSlice';
import { SaveRequisition } from '../../../Services/rrhh/Request';

interface IProps extends DrawerScreenProps<any, any> {}
const dateService = new MomentDateService('DD/MM/YYYY');
const validationSchema: Yup.SchemaOf<ISavingSubstitutionRequisition> = Yup.object({
  repCodgrc: Yup.number().moreThan(0, 'Selecciona un grupo corporativo').required('Selecciona un grupo corporativo'),
  repCodigo: Yup.number().notRequired(),
  repCodncc: Yup.number().nullable(),
  repCodpue: Yup.number().nullable().notRequired(),
  repCodtco: Yup.number().moreThan(0, 'Selecciona el tipo de contrato').required('Selecciona el tipo de contrato'),
  repCodtpp: Yup.number().nullable().notRequired(),
  repFechaIniContratacion: Yup.string().required('Selecciona la fecha de inicio'),
  repFechaFinContratacion: Yup.string().when('repCodtco', {
    is: 2,
    then: Yup.string().required('Selecciona una fecha de finalización'),
  }),
  repFechaSolicitud: Yup.string().required('Selecciona una fecha de solicitud'),
  repJustificacion: Yup.string().nullable().notRequired(),
  repTipoRequisicion: Yup.string().required('Selecciona el tipo de Requisicion'),
  sustitucionRequisiciones: Yup.array()
    .of(
      Yup.object().shape({
        serCodrep: Yup.number().nullable(),
        serCodemp: Yup.number(),
        serCodplz: Yup.number(),
      })
    )
    .min(1, 'Debe agregar al menos una sustitución'),
});

const FormRequisitionSubstitutionScreen = ({ navigation, route }: IProps): React.ReactElement => {
  const showToast = useCustomToast();
  const selectedPositions = useSelector((root: RootState) => root.requisition.selectedPositions);
  const { ...methods } = useFormWithSchema(validationSchema, {
    defaultValues: {
      repCodgrc: 1,
      repCodigo: 0,
      repCodpue: null,
      repCodtco: 0,
      repCodtpp: null,
      repFechaFinContratacion: undefined,
      repFechaIniContratacion: undefined,
      repFechaSolicitud: moment().format('YYYY-MM-DD'),
      repJustificacion: null,
      repTipoRequisicion: 'Sustitucion',
      sustitucionRequisiciones: [],
    },
  });

  const dispatch = useDispatch();

  const { handleSubmit: onSubmit, setValue, control, watch, formState } = methods;
  const errors = formState.errors;
  console.log(
    '🚀 ~ file: FormRequisitionSubstitutionScreen.tsx:97 ~ FormRequisitionSubstitutionScreen ~ errors:',
    errors
  );

  const [repCodtco, repCodpue, repCodtpp, repFechaIniContratacion, repFechaFinContratacion, sustitucionRequisiciones] =
    watch([
      'repCodtco',
      'repCodpue',
      'repCodtpp',
      'repFechaIniContratacion',
      'repFechaFinContratacion',
      'sustitucionRequisiciones',
    ]);

  const { contractTypes, isLoadingContractTypes } = useContractTypes();

  useEffect(() => {
    setValue(
      'sustitucionRequisiciones',
      selectedPositions.map((e) => {
        return {
          serCodemp: e.codEmpleo,
          serCodplz: e.codPlaza,
          serCodrep: null,
        };
      })
    );

    return () => {};
  }, [selectedPositions]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        dispatch(resetValues());
      }),
    [navigation]
  );

  const LoadingIndicator = (props: any) => (
    <View style={[props.style]}>
      <Spinner size="small" status="basic" />
    </View>
  );

  const mutation = useMutation(
    (values: ISavingSubstitutionRequisition) => {
      return SaveRequisition(values);
    },
    {
      onSettled: async (response, error: any, variables, context) => {
        if (!response.result) {
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: response.message ?? 'Ocurrio un error inesperado',
          });
        } else {
          showToast({
            title: `Se ha enviado la solicitud`,
            status: 'success',
            // description: data.Message ?? 'Ocurrio un error inesperado',
          });
          dispatch(resetValues());
          await queryClient.invalidateQueries(QueryKeys.REQUISITIONS);
          navigation.goBack();
          // navigation.navigate(ScreenNames.LIST_REQUESTS);
        }
      },
    }
  );

  const handleSubmit = async (pageModel: ISavingSubstitutionRequisition) => {
    console.log('🚀 ~ file: FormRequisitionSubstitutionScreen.tsx:161 ~ handleSubmit ~ pageModel:', pageModel);
    mutation.mutate(pageModel);
  };

  const Container = ({ title, children }: { title: string; children: any }) => {
    return (
      <Box borderWidth={1} borderColor="coolGray.200" mx={1} shadow="1" bg="#fff" p={3} borderRadius="md" my={3}>
        <Box alignItems="center">
          <Text fontSize="sm">{title}</Text>
          <Divider bg={colors.primary} mt={1} mb={2} w="10%" h={1} borderRadius="md" />
        </Box>
        {children}
      </Box>
    );
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<ISubordinatePosition>) => {
    return (
      <Box mb={3} mx={2}>
        <Pressable
          onPress={() => console.log('You touched me')}
          _dark={{
            bg: 'coolGray.800',
          }}
          _light={{
            bg: '#fff',
          }}
          borderRadius={'md'}
        >
          <VStack bg="#fff" px="4" py="2" shadow="2" borderRadius={'md'} flex={1} justifyContent="space-between">
            <VStack w="100%">
              <Text color="coolGray.400" fontSize="xs">
                Colaborador
              </Text>
              {/* <Divider /> */}
              <Text>
                {item.codigoAlternativo} - {item.nombre}
              </Text>
            </VStack>
            <VStack w="100%">
              <Text color="coolGray.400" fontSize="xs">
                Plaza
              </Text>
              {/* <Divider /> */}
              <Text>{item.nombrePlaza}</Text>
            </VStack>
            <VStack w="100%" flexWrap="wrap">
              <Text color="coolGray.400" fontSize="xs">
                Centro de Trabajo
              </Text>
              {/* <Divider /> */}
              <Text>{item.nombreCentroTrabajo}</Text>
            </VStack>
            <HStack justifyContent="flex-end">
              {Platform.OS === 'web' && (
                <Pressable
                  onPress={() => {
                    dispatch(removeSelected(item));
                  }}
                >
                  <Icon as={<MaterialIcons name="delete" />} color="red.500" size={5} />
                </Pressable>
              )}
            </HStack>
          </VStack>
        </Pressable>
      </Box>
    );
  };

  const renderHiddenItem = (data, rowMap) => (
    <Pressable
      flex={1}
      pl="2"
      alignItems="flex-end"
      justifyContent="center"
      bg="red.500"
      borderRadius={'md'}
      mx={2}
      mb={3}
      onPress={() => {
        dispatch(removeSelected(data.item));
      }}
      _pressed={{
        opacity: 0.5,
      }}
    >
      <Box bg="red.500" flex={1} px="10" borderRadius={'md'} justifyContent="center">
        <Icon as={<MaterialIcons name="delete" />} color="white" size={5} />
      </Box>
    </Pressable>
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
              marginX: '48',
            }}
            px={3}
          >
            <Heading size="sm">Sustitución de Empleados Activos</Heading>
            <Box mb={3}>
              <Container title="Información de la Requisición">
                <Box mb={3}>
                  <FormControl isInvalid={Boolean(errors.repJustificacion)}>
                    <FormControl.Label>Justificación (Opcional)</FormControl.Label>
                    <TextBox
                      name="repJustificacion"
                      placeholder="Ingresa una justificación"
                      borderWidth={1}
                      maxLength={150}
                    />
                    <FormErrorMessage message={errors.repJustificacion?.message} />
                  </FormControl>
                </Box>
              </Container>
              <Container title="Datos de la contratación">
                <Box>
                  <FormControl isInvalid={Boolean(errors.repCodtco)}>
                    <FormControl.Label>Selecciona el tipo de contrato</FormControl.Label>
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
                        setValue('repCodtco', parseInt(itemValue, 10));
                      }}
                    >
                      {contractTypes.map((contractType) => {
                        return (
                          <Select.Item
                            key={`tipos-contrato-${contractType.tcoDescripcion}`}
                            label={contractType.tcoDescripcion}
                            value={contractType.tcoCodigo.toString()}
                          />
                        );
                      })}
                    </Select>
                    {isLoadingContractTypes && (
                      <FormControl.HelperText> Cargando tipos de contrato...</FormControl.HelperText>
                    )}
                    <FormErrorMessage message={errors.repCodtco?.message} />
                  </FormControl>
                </Box>
                <Box mb={3}>
                  <FormControl w="75%" isRequired marginY={1} isInvalid={Boolean(errors.repFechaIniContratacion)}>
                    <FormControl.Label>Fecha de inicio:</FormControl.Label>
                    <Datepicker
                      placeholder="Fecha de inicio"
                      min={moment()}
                      // max={endYear}
                      date={repFechaIniContratacion ? moment(repFechaIniContratacion) : undefined}
                      dateService={dateService}
                      controlStyle={{
                        backgroundColor: '#fff',
                      }}
                      onSelect={(nextDate) => {
                        setValue('repFechaIniContratacion', nextDate.format('YYYY-MM-DD'));
                      }}
                    />
                    <FormErrorMessage message={errors.repFechaIniContratacion?.message} />
                  </FormControl>
                </Box>
                {repCodtco === 2 && (
                  <Box mb={3}>
                    <FormControl w="75%" isRequired marginY={1} isInvalid={Boolean(errors.repFechaIniContratacion)}>
                      <FormControl.Label>Fecha de fin:</FormControl.Label>
                      <Datepicker
                        placeholder="Fecha de fin"
                        min={repFechaIniContratacion ? moment(repFechaIniContratacion) : moment()}
                        // max={endYear}
                        date={repFechaFinContratacion ? moment(repFechaFinContratacion) : undefined}
                        dateService={dateService}
                        controlStyle={{
                          backgroundColor: '#fff',
                        }}
                        onSelect={(nextDate) => {
                          setValue('repFechaFinContratacion', nextDate.format('YYYY-MM-DD'));
                        }}
                      />
                      <FormErrorMessage message={errors.repFechaFinContratacion?.message} />
                    </FormControl>
                  </Box>
                )}
              </Container>

              {/* <Container title="Datos de las Plazas Nuevas a Llenar">
                <Box mb={3}>
                  <FormControl isInvalid={Boolean(errors.repCodtco)}>
                    <FormControl.Label>Selecciona el tipo de Puesto</FormControl.Label>
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
                        setValue('repCodtpp', parseInt(itemValue, 10));
                      }}
                    >
                      {positionTypes.map((positionType) => {
                        return (
                          <Select.Item
                            key={`tipos-puesto-${positionType.tppDescripcion}`}
                            label={positionType.tppDescripcion}
                            value={positionType.tppCodigo.toString()}
                          />
                        );
                      })}
                    </Select>
                    {isLoadingContractTypes && (
                      <FormControl.HelperText> Cargando tipos de Puesto...</FormControl.HelperText>
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
                          setValue('repCodpue', parseInt(itemValue, 10));
                        }}
                      >
                        {positions.map((position) => {
                          return (
                            <Select.Item
                              key={`puesto-${position.pueNombre}`}
                              label={position.pueNombre}
                              value={position.pueCodigo?.toString()}
                            />
                          );
                        })}
                      </Select>
                      {isLoadingPositions && <FormControl.HelperText> Cargando Puestos...</FormControl.HelperText>}
                      <FormErrorMessage message={errors.repCodtco?.message} />
                    </FormControl>
                  </Box>
                )}
              </Container> */}

              <Container title="Detalle de Personas a Sustituir">
                <Text color="coolGray.400" fontSize="xs" textAlign="center">
                  Selecciona los colaboradores a sustituir
                </Text>

                {/* <Button
                  style={{ marginTop: 10 }}
                  onPress={() => {
                    if (
                      !sustitucionRequisiciones.some(
                        (e) => e.perCodcdt === selectedWorkingCenter && e.perCoduni === selectedWorkingUnit
                      )
                    ) {
                      setValue('sustitucionRequisiciones', [
                        {
                          perCodcdt: selectedWorkingCenter,
                          perCodjor: selectedWorkday,
                          perCoduni: selectedWorkingUnit,
                          perNumPersonas: numPersons,
                          perCodigo: null,
                          perCodrep: null,
                        },
                        ...sustitucionRequisiciones,
                      ]);
                    }
                  }}
                  disabled={
                    sustitucionRequisiciones.some(
                      (e) => e.serCodemp === selectedWorkingCenter && e.serCodplz === selectedWorkingUnit
                    ) ||
                    numPersons === 0 ||
                    selectedWorkingCenter === 0 ||
                    selectedWorkingUnit === 0
                  }
                  accessoryLeft={mutation.isLoading ? LoadingIndicator : undefined}
                >
                  Agregar
                </Button> */}
                <Pressable
                  onPress={() => {
                    navigation.navigate(ScreenNames.ACTIVE_EMPLOYEES);
                  }}
                  mt={2}
                  borderWidth={1}
                  borderColor="coolGray.200"
                  borderRadius="md"
                  p={2}
                  alignSelf="flex-end"
                  bg="#2675C9"
                  flexDir="row"
                  alignItems="center"
                >
                  <Text color="#fff">Agregar colaboradores</Text>
                  <Icon as={AntDesign} name="right" size="4" color="#fff" />
                </Pressable>
                <Box my={3}>
                  <Text fontWeight="bold" my={2}>
                    Colaboradores a sustituir
                  </Text>
                  <SwipeListView
                    disableRightSwipe
                    data={selectedPositions}
                    renderItem={renderItem}
                    ListEmptyComponent={
                      <Box justifyContent="center" alignItems="center">
                        <Box mx={5} borderWidth={1} borderColor="coolGray.200" borderRadius="md" p={2}>
                          <Text>Agrega colaboradores</Text>
                        </Box>
                      </Box>
                    }
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-140}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    // onRowDidOpen={onRowDidOpen}
                    keyExtractor={(item) => `${item.codPlaza}-${item.codUnidad}-${item.codigoAlternativo}`}
                    closeOnRowOpen={true}
                    closeOnRowBeginSwipe={true}
                  />
                </Box>
                {Boolean(errors.sustitucionRequisiciones) && (
                  <HStack alignItems="center">
                    <WarningOutlineIcon size="xs" color="red.500" />
                    <Text color="red.500" ml={1}>
                      {errors.sustitucionRequisiciones?.message}
                    </Text>
                  </HStack>
                )}
              </Container>

              <Button
                style={{ marginTop: 10 }}
                onPress={onSubmit(handleSubmit)}
                disabled={mutation.isLoading}
                accessoryLeft={mutation.isLoading ? LoadingIndicator : undefined}
              >
                {mutation.isLoading ? 'Enviando...' : 'Enviar'}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </ScrollView>
    </Box>
  );
};

export default FormRequisitionSubstitutionScreen;
