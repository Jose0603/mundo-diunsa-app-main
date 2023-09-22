import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Spinner, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Formik, FormikProps } from 'formik';
import { Alert, ArrowBackIcon, Box, CheckIcon, FormControl, HStack, ScrollView, Select, Text, View, VStack, WarningOutlineIcon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { Loading } from '../../../Components/Loading';
import { queryClient } from '../../../Configs/QueryClient';
import { QueryKeys } from '../../../Helpers/QueryKeys';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { useClinic, useClinicAttendantsByType, useClinicAttentionType } from '../../../hooks/useClinic';
import { useClinicQueue } from '../../../hooks/useClinicQueue';
import { useCustomToast } from '../../../hooks/useCustomToast';
import { IClinicAppointment, ISavingClinicAppointment } from '../../../interfaces/rrhh/IClinic';
import { AuthState } from '../../../Redux/reducers/auth/loginReducer';
import { RootState } from '../../../Redux/reducers/rootReducer';
import { SaveClinicAppointmentRequest } from '../../../Services/rrhh/Clinic';

interface IProps extends NativeStackScreenProps<any, any> {}

const FormRequestClinicScreen = ({ navigation, route }: IProps): React.ReactElement => {
  const showToast = useCustomToast();
  const user: AuthState = useSelector((root: RootState) => root.auth.login);
  const [selectedAttentionType, setSelectedAttentionType] = useState<number>(0);
  const [selectedClinic, setSelectedClinic] = useState<number>(0);
  const { clinics, isLoadingClinics, isFetchingClinics } = useClinic();
  const { attentionTypes, isLoadingClinicAttentionTypes, isFetchingAttentionTypes } = useClinicAttentionType(selectedClinic);
  const { attendants, isLoadingAttendants, isFetchingAttendants } = useClinicAttendantsByType(selectedAttentionType);
  const { allQueues } = useClinicQueue();
  const [selectedClinicQueue, setselectedClinicQueue] = useState<IClinicAppointment[]>([]);

  useEffect(() => {
    if (allQueues && allQueues.length > 0) {
      const found = allQueues?.find((x) => x.clinicId === selectedClinic);
      if (found) {
        setselectedClinicQueue(found.appointments ?? []);
      } else {
        setselectedClinicQueue([]);
      }
    }
  }, [selectedClinic]);

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
    (values: ISavingClinicAppointment) => {
      return SaveClinicAppointmentRequest(values);
    },
    {
      onSettled: async(response: any, error: any, variables, context) => {
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
          setSelectedClinic(0);
          setselectedClinicQueue([]);
          await queryClient.invalidateQueries(QueryKeys.CLINIC_PENDING_APPOINTMENTS);
          navigation.goBack();
          // navigation.navigate(ScreenNames.LIST_REQUESTS);
        }
      },
    }
  );

  const requestSchema: Yup.SchemaOf<ISavingClinicAppointment> = Yup.object({
    attendantId: Yup.number().moreThan(0, 'Selecciona el parentesco').required('Selecciona el parentesco'),
    attentionTypeId: Yup.number()
      .moreThan(0, 'Selecciona el tipo de atención')
      .required('Selecciona el tipo de atención'),
    clinicId: Yup.number().moreThan(0, 'Selecciona la clinica').required('Selecciona la clinica'),
    userId: Yup.string().required('No se ha asignado el usuario actual, recarga la aplicacion'),
    id: Yup.number().optional(),
    status: Yup.string().optional(),
  });

  return (
    <Box safeArea height="100%" backgroundColor="#fff">
      <TopNavigation
        alignment="center"
        title="Solicitud de Visita a la clinica"
        accessoryLeft={<RenderLeftActions />}
      />
      <ScrollView
        _contentContainerStyle={
          {
            // marginX: '48',
          }
        }
      >
        <Formik
          initialValues={{
            attendantId: 0,
            attentionTypeId: 0,
            clinicId: 0,
            userId: user.employeeId,
            id: 0,
            status: 'Pendiente',
          }}
          validationSchema={requestSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            mutation.mutate({ ...values });
            setSubmitting(false);
            resetForm();
          }}
        >
          {({
            handleSubmit,
            isSubmitting,
            errors,
            touched,
            setFieldValue,
            values,
          }: FormikProps<ISavingClinicAppointment>) => {
            return (
              <>
                <Box mb={3} px={3}>
                  <Box mb={3}>
                    <FormControl isRequired isInvalid={errors.clinicId && touched.clinicId ? true : false}>
                      <FormControl.Label>Selecciona la clinica</FormControl.Label>
                      <Select
                        minWidth="200"
                        accessibilityLabel="Selecciona la clinica"
                        placeholder="Selecciona la clinica"
                        _selectedItem={{
                          endIcon: <CheckIcon size={5} />,
                        }}
                        isDisabled={mutation.isLoading || isLoadingClinics || isFetchingClinics}
                        selectedValue={values.clinicId.toString()}
                        mt="1"
                        onValueChange={(itemValue: string) => {
                          setFieldValue('clinicId', parseInt(itemValue, 10));
                          setSelectedClinic(parseInt(itemValue, 10));
                        }}
                      >
                        {(clinics ?? []).map((clinic) => {
                          return (
                            <Select.Item key={`store-${clinic.id}`} label={clinic.name} value={clinic.id.toString()} />
                          );
                        })}
                      </Select>
                      {(isLoadingClinics || isFetchingClinics) && (
                        <FormControl.HelperText> Cargando clinicas...</FormControl.HelperText>
                      )}
                      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        {errors.clinicId}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>
                  <Box mb={3}>
                    <FormControl
                      isRequired
                      isInvalid={errors.attentionTypeId && touched.attentionTypeId ? true : false}
                    >
                      <FormControl.Label>Selecciona el tipo de atención</FormControl.Label>
                      <Select
                        minWidth="200"
                        accessibilityLabel="Selecciona el tipo de atención"
                        placeholder="Selecciona el tipo de atención"
                        _selectedItem={{
                          endIcon: <CheckIcon size={5} />,
                        }}
                        isDisabled={mutation.isLoading || isLoadingClinicAttentionTypes || isFetchingAttentionTypes}
                        selectedValue={values.attentionTypeId.toString()}
                        mt="1"
                        onValueChange={(itemValue: string) => {
                          setFieldValue('attentionTypeId', parseInt(itemValue, 10));
                          setSelectedAttentionType(parseInt(itemValue, 10));
                        }}
                      >
                        {attentionTypes &&
                          attentionTypes.length > 0 &&
                          attentionTypes.map((attentionType) => {
                            return (
                              <Select.Item
                                key={`store-${attentionType.id}`}
                                label={attentionType.name}
                                value={attentionType.id.toString()}
                              />
                            );
                          })}
                      </Select>
                      {(isLoadingClinicAttentionTypes || isFetchingAttentionTypes) && (
                        <FormControl.HelperText> Cargando Tipos de Atención...</FormControl.HelperText>
                      )}
                      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        {errors.attentionTypeId}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>
                  <Box mb={3}>
                    <FormControl isRequired isInvalid={errors.attendantId && touched.attendantId ? true : false}>
                      <FormControl.Label>Selecciona el parentesco</FormControl.Label>
                      <Select
                        minWidth="200"
                        accessibilityLabel="Selecciona el parentesco"
                        placeholder="Selecciona el parentesco"
                        _selectedItem={{
                          endIcon: <CheckIcon size={5} />,
                        }}
                        isDisabled={mutation.isLoading || isLoadingAttendants || isFetchingAttendants}
                        selectedValue={values.attendantId.toString()}
                        mt="1"
                        onValueChange={(itemValue: string) => {
                          setFieldValue('attendantId', parseInt(itemValue, 10));
                        }}
                      >
                        {(attendants ?? []).map((attendant) => {
                          return (
                            <Select.Item
                              key={`store-${attendant.label}`}
                              label={attendant.label}
                              value={attendant.value.toString()}
                            />
                          );
                        })}
                      </Select>
                      {(isLoadingAttendants || isFetchingAttendants) && (
                        <FormControl.HelperText> Cargando Parentesco...</FormControl.HelperText>
                      )}
                      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        {errors.attendantId}
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>

                  {selectedClinic > 0 && (
                    <Box my={2} alignItems="center">
                      <Alert w="100%" variant="left-accent" colorScheme="info" status="info">
                        <VStack space={2} flexShrink={1} w="100%">
                          <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                            <HStack space={2} flexShrink={1} alignItems="center">
                              <Alert.Icon />
                              <Text>
                                {selectedClinicQueue?.length > 0
                                  ? selectedClinicQueue?.length > 1
                                    ? `Hay ${selectedClinicQueue?.length} personas esperando atención`
                                    : `Hay ${selectedClinicQueue?.length} persona esperando atención`
                                  : 'No hay personas esperando atención'}
                              </Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </Alert>
                    </Box>
                  )}

                  <Button
                    style={{ marginTop: 10 }}
                    onPress={() => {
                      handleSubmit();
                    }}
                    disabled={mutation.isLoading}
                    accessoryLeft={mutation.isLoading ? LoadingIndicator : undefined}
                  >
                    {mutation.isLoading ? 'Enviando...' : '¿Crear ticket?'}
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

export default FormRequestClinicScreen;
