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
  Input,
  Pressable,
  ScrollView,
  Select,
  Text,
  View,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { ListRenderItemInfo, Platform } from 'react-native';
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
import { ISavingVacancyRequisition, IVacancy } from '../../../interfaces/rrhh/IRequisition';
import { RootState } from '../../../Redux/reducers/rootReducer';
import {
  addQtyToPosition,
  removeSelectedVacancy,
  resetValues,
  substractQtyToPosition,
} from '../../../Redux/reducers/rrhh/requisitionSlice';
import { SaveRequisition } from '../../../Services/rrhh/Request';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

interface IProps extends NativeStackScreenProps<any, any> {}
const dateService = new MomentDateService('DD/MM/YYYY');
const validationSchema: Yup.SchemaOf<ISavingVacancyRequisition> = Yup.object({
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
  vacantesRequisiciones: Yup.array()
    .of(
      Yup.object().shape({
        pvrCodplzVacante: Yup.number(),
        pvrCodjor: Yup.number(),
        pvrNumPlazas: Yup.number(),
      })
    )
    .min(1, 'Debe agregar al menos una plaza a llenar'),
});

const FormRequisitionVacancyScreen = ({ navigation, route }: IProps): React.ReactElement => {
  const showToast = useCustomToast();
  const selectedVacancies = useSelector((root: RootState) => root.requisition.selectedVacancies);
  console.log('🚀 ~ file: FormRequisitionVacancyScreen.tsx:99 ~ selectedVacancies:', selectedVacancies);
  const { ...methods } = useFormWithSchema(validationSchema, {
    defaultValues: {
      repCodgrc: 1,
      repCodigo: 0,
      repCodtco: 0,
      repFechaFinContratacion: undefined,
      repFechaIniContratacion: undefined,
      repFechaSolicitud: moment().format('YYYY-MM-DD'),
      repJustificacion: null,
      repTipoRequisicion: 'Vacante',
      vacantesRequisiciones: [],
    },
  });

  const dispatch = useDispatch();

  const { handleSubmit: onSubmit, setValue, control, watch, formState } = methods;
  const errors = formState.errors;
  console.log('🚀 ~ file: FormRequisitionVacancyScreen.tsx:97 ~ FormRequisitionVacancyScreen ~ errors:', errors);

  const [repCodtco, repFechaIniContratacion, repFechaFinContratacion] = watch([
    'repCodtco',
    'repFechaIniContratacion',
    'repFechaFinContratacion',
  ]);

  const { contractTypes, isLoadingContractTypes } = useContractTypes();

  useEffect(() => {
    setValue(
      'vacantesRequisiciones',
      selectedVacancies.map((e) => {
        return {
          pvrCodjor: 74,
          pvrCodplzVacante: e.codPlaza,
          pvrNumPlazas: e.numPlazas,
        };
      })
    );

    return () => {};
  }, [selectedVacancies]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        e.preventDefault();
        dispatch(resetValues());
        navigation.dispatch(e.data.action);
      }),
    [navigation]
  );

  const LoadingIndicator = (props: any) => (
    <View style={[props.style]}>
      <Spinner size="small" status="basic" />
    </View>
  );

  const mutation = useMutation(
    (values: ISavingVacancyRequisition) => {
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

  const handleSubmit = async (pageModel: ISavingVacancyRequisition) => {
    console.log('🚀 ~ file: FormRequisitionVacancyScreen.tsx:161 ~ handleSubmit ~ pageModel:', pageModel);
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

  const renderItem = ({ item, index }: ListRenderItemInfo<IVacancy>) => {
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
            <HStack w="100%" justifyContent="space-between">
              <Box justifyContent="center">
                {Platform.OS === 'web' && (
                  <Pressable
                    onPress={() => {
                      dispatch(removeSelectedVacancy(item));
                    }}
                  >
                    <Icon as={<MaterialIcons name="delete" />} color="red.500" size={5} />
                  </Pressable>
                )}
              </Box>
              <HStack>
                <VStack alignItems="center">
                  <Text color="coolGray.400" fontSize="xs">
                    Disponible
                  </Text>
                  <Text>{item.disponibles}</Text>
                </VStack>
                <HStack ml={2}>
                  <VStack alignItems="center">
                    <Text color="coolGray.400" fontSize="xs">
                      Cantidad
                    </Text>
                    <HStack alignItems="center">
                      <Pressable
                        bg={colors.secondary}
                        borderRadius="full"
                        p={1}
                        disabled={item.numPlazas === 1}
                        onPress={() => {
                          dispatch(
                            substractQtyToPosition({
                              codPlaza: item.codPlaza,
                              numPlazas: 1,
                            })
                          );
                        }}
                      >
                        <Icon as={AntDesign} name="minus" size={4} color="#fff" />
                      </Pressable>
                      {/* {isEditing ? (
                      <Input keyboardType="numeric" value={String(item.numPlazas)} onChange={() => {}} />
                    ) : (
                      <Pressable
                        onPress={() => {
                          setIsEditing(true);
                        }}
                      >
                      </Pressable>
                    )} */}
                      <Text mx={2}>{item.numPlazas ?? 0}</Text>
                      <Pressable
                        bg={colors.secondary}
                        borderRadius="full"
                        p={1}
                        disabled={item.disponibles === 0}
                        onPress={() => {
                          dispatch(
                            addQtyToPosition({
                              codPlaza: item.codPlaza,
                              numPlazas: 1,
                            })
                          );
                        }}
                      >
                        <Icon as={AntDesign} name="plus" size={4} color="#fff" />
                      </Pressable>
                    </HStack>
                  </VStack>
                </HStack>
              </HStack>
            </HStack>
          </VStack>
        </Pressable>
      </Box>
    );
  };

  const renderHiddenItem = ({ item, index }: ListRenderItemInfo<IVacancy>) => (
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
        dispatch(removeSelectedVacancy(item));
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
            <Heading size="sm">Plazas Vacantes</Heading>
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

              <Container title="Plazas">
                <Pressable
                  onPress={() => {
                    navigation.navigate(ScreenNames.AVAILABLE_VACANCIES);
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
                  <Text color="#fff">Seleccionar Plazas</Text>
                  <Icon as={AntDesign} name="right" size="4" color="#fff" />
                </Pressable>
                <Box my={3}>
                  <Text fontWeight="bold" my={2}>
                    Plazas a llenar
                  </Text>
                  <SwipeListView
                    disableRightSwipe
                    data={selectedVacancies}
                    renderItem={renderItem}
                    ListEmptyComponent={
                      <Box justifyContent="center" alignItems="center">
                        <Box mx={5} borderWidth={1} borderColor="coolGray.200" borderRadius="md" p={2}>
                          <Text>Agrega plazas</Text>
                        </Box>
                      </Box>
                    }
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-140}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    // onRowDidOpen={onRowDidOpen}
                    keyExtractor={(item) => `${item.codPlaza}-${item.codUnidad}`}
                    closeOnRowOpen={true}
                    closeOnRowBeginSwipe={true}
                  />
                </Box>
                {Boolean(errors.vacantesRequisiciones) && (
                  <HStack alignItems="center">
                    <WarningOutlineIcon size="xs" color="red.500" />
                    <Text color="red.500" ml={1}>
                      {errors.vacantesRequisiciones?.message}
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

export default FormRequisitionVacancyScreen;
