import React, { useCallback, useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Center,
  CheckIcon,
  FlatList,
  FormControl,
  Icon,
  Input,
  Pressable,
  Row,
  Select,
  Spinner,
  Stack,
  Text,
  useDisclose,
  View,
  WarningOutlineIcon,
} from 'native-base';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import useIncidents from '../../../../hooks/useIncidents';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import {
  ExpedienteService,
  UpdateExpediente,
} from '../../../../Services/rrhh/ExpExpediente';
import { IExpExpediente } from '../../../../interfaces/rrhh/IExpExpediente';
import {
  usePaises,
  useDepartamentos,
  useMunicipios,
  useExpediente,
} from '../../../../hooks/useExpediente';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';
import ButtonSoup from '../../../../Components/ButtonSoup';
import PlaceActionSheet from '../PlaceActionSheet';
import { sentenceCase } from '../../../../Helpers/FormatToSenteceCase';
import { Datepicker } from '@ui-kitten/components';
import { useCustomToast } from '../../../../hooks/useCustomToast';
import { queryClient } from '../../../../Configs/QueryClient';
import { QueryKeys } from '../../../../Helpers/QueryKeys';
import { FormErrorMessage } from '../../../../Components/FormErrorMessage';

const GeneralData = (): React.ReactElement => {
  const user = useSelector((state: RootState) => state.auth.login);
  const showToast = useCustomToast();

  const {
    Expediente: { data: expediente },
  } = useIncidents();
  const { paises, isLoadingPaises } = usePaises();
  const [pai, setPai] = useState(expediente?.expCodpaiNacimiento ?? '');
  const [dep, setDep] = useState(expediente?.expCoddepNac ?? 0);
  const [mun, setMun] = useState(expediente?.expCodmunNac ?? 0);
  const { departamentos, isLoadingDepartamentos } = useDepartamentos(pai);
  const { municipios, isLoadingMunicipios } = useMunicipios(dep);

  const [loading, setLoading] = useState(false);

  const now = new Date();
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  var change = false;

  const handleSubmit = useCallback(async (actionModel: IExpExpediente) => {
    setLoading(true);

    try {
      if (actionModel?.expCodigoAlternativo != null) {
        setLoading(true);
        const response = await UpdateExpediente(actionModel);
        if (response?.result) {
          setLoading(false);
          showToast({
            title: 'Datos generales actualizados con exito',
            status: 'success',
          });
        } else {
          setLoading(false);
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: response.message,
          });
        }
      }
    } catch (exception) {
    } finally {
      queryClient.refetchQueries([QueryKeys.PROFILES]);
      setLoading(false);
    }
  }, []);

  const {
    isOpen: isOpenPai,
    onOpen: onOpenPai,
    onClose: onClosePai,
  } = useDisclose();
  const {
    isOpen: isOpenDep,
    onOpen: onOpenDep,
    onClose: onCloseDep,
  } = useDisclose();
  const {
    isOpen: isOpenMun,
    onOpen: onOpenMun,
    onClose: onCloseMun,
  } = useDisclose();
  // const { expediente, isLoadingExpediente } = useExpediente(user.employeeId);

  const setExtraData = (place: number) => {
    if (place == 1) {
      setDep(0);
      setMun(0);
    } else if (place == 2) {
      setMun(0);
    }
  };

  const initialValues: IExpExpediente = {
    expCodigoAlternativo: user.employeeId,
    expCodpaiNacimiento: expediente?.expCodpaiNacimiento ?? '',
    expCodpaiNacionalidad: expediente?.expCodpaiNacionalidad ?? '',
    expProfesion: expediente?.expProfesion ?? '',
    expEstadoCivil: expediente?.expEstadoCivil ?? '',
    expFechaNac: expediente?.expFechaNac ?? new Date(),
    expCodmunNac: expediente?.expCodmunNac ?? 0,
    expCoddepNac: expediente?.expCoddepNac ?? 0,
    expEmail: expediente?.expEmail ?? '',
    expEmailInterno: expediente?.expEmailInterno ?? '',
    expTelefonoMovil: expediente?.expTelefonoMovil ?? '',
    expTelefonoInterno: expediente?.expTelefonoInterno ?? '',
    expNombresApellidos: expediente?.expNombresApellidos ?? '',
    expPropertyBagData: expediente?.expPropertyBagData ?? '',
    expObservaciones: expediente?.expObservaciones ?? '',
  };

  const civilStatus = [
    {
      label: 'Casado(a)',
      value: 'C',
    },
    {
      label: 'Soltero(a)',
      value: 'S',
    },
    {
      label: 'Viudo(a)',
      value: 'V',
    },
    {
      label: 'Divorciado(a)',
      value: 'D',
    },
    {
      label: 'Acompañado(a)',
      value: 'A',
    },
  ];

  const getFormData = (values) => {
    if (JSON.stringify(values) !== JSON.stringify(initialValues)) {
      change = true;
    } else {
      change = false;
    }
  };

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema: Yup.SchemaOf<IExpExpediente> = Yup.object({
    expCodigoAlternativo: Yup.string().notRequired(),
    expCodpaiNacionalidad: Yup.string().notRequired(),
    expProfesion: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(100, 'Ingrese máximo 100 caracteres.'),
    // .required("Profesion Requerida."),
    expCodpaiNacimiento: Yup.string()
      .min(1, 'Seleccione un país.')
      .required('Seleccione un país.'),
    expCoddepNac: Yup.number().when('expCodpaiNacimiento', {
      is: (expCodpaiNacimiento) => expCodpaiNacimiento != null,
      then: Yup.number()
        .min(1, 'Seleccione un departamento.')
        .required('Seleccione un departamento.'),
    }),
    expCodmunNac: Yup.number().when('expCoddepNac', {
      is: (expCoddepNac) => expCoddepNac > 0,
      then: Yup.number()
        .min(1, 'Seleccione un municipio.')
        .required('Seleccione un municipio.'),
    }),
    expEstadoCivil: Yup.string().required('Estado Civil Requerido.'),
    expFechaNac: Yup.date().notRequired(),
    expEmail: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(100, 'Ingrese máximo 100 caracteres.')
      .required('Correo requerido.'),
    expEmailInterno: Yup.string().notRequired(),
    expTelefonoMovil: Yup.string().matches(
      /^([0-9]{4})-?([0-9]{4})$/,
      'Teléfono1 debe tener el formato 1234-5678 o 12345678'
    ),
    // .matches(
    //   phoneRegExp,
    //   'Número de teléfono inválido, solo se aceptan numeros.'
    // ),
    expTelefonoInterno: Yup.string().notRequired(),
    expNombresApellidos: Yup.string().notRequired(),
    expPropertyBagData: Yup.string().notRequired(),
    expObservaciones: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(4000, 'Ingrese máximo 4000 caracteres.')
      .optional(),
  });

  return (
    <View bgColor={'white'} h={'100%'}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(model: IExpExpediente) => {
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
        }: FormikProps<IExpExpediente>) => {
          getFormData(values);
          return (
            <Box mb={3} px={6}>
              <ScrollView>
                <Box mb={3}>
                  <FormControl>
                    <FormControl.Label
                      mt={4}
                      _text={{
                        color: '#0077CD',
                        fontSize: 'xl',
                      }}
                    >
                      Datos Generales
                    </FormControl.Label>
                  </FormControl>
                  <FormControl>
                    <FormControl mb={4}>
                      <FormControl.Label>Nombre Completo</FormControl.Label>
                      <Input
                        placeholder='Nombre Completo'
                        size='md'
                        // lineHeight={"xl"}
                        color={'gray.500'}
                        // lineHeight={"xl"}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // variant="unstyled"
                        value={values.expNombresApellidos}
                        // onBlur={handleBlur("expNombresApellidos")}
                        // onChangeText={handleChange("expNombresApellidos")}
                        isDisabled={true}
                      />
                    </FormControl>
                    <FormControl mb={4}>
                      <FormControl.Label>Edad</FormControl.Label>
                      <Input
                        w={'15%'}
                        justifyContent={'center'}
                        placeholder='Edad'
                        color={'gray.500'}
                        // lineHeight={"xl"}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        size='md'
                        textAlign={'center'}
                        // lineHeight={"xl"}
                        // variant="unstyled"
                        value={getAge(values.expFechaNac).toString()}
                        isDisabled={true}
                      />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.expEstadoCivil && touched.expEstadoCivil
                      )}
                    >
                      <FormControl.Label>Estado Civil</FormControl.Label>
                      <ButtonSoup
                        array={civilStatus}
                        setfieldValue={setFieldValue}
                        field={'expEstadoCivil'}
                        value={values.expEstadoCivil}
                        isnew={true}
                      />
                      <FormErrorMessage message={errors.expEstadoCivil} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.expProfesion && touched.expProfesion
                      )}
                    >
                      <FormControl.Label>Profesión</FormControl.Label>
                      <Input
                        placeholder='Profesión'
                        size='md'
                        // lineHeight={"xl"}
                        color={'gray.500'}
                        // variant="unstyled"
                        value={values.expProfesion}
                        onBlur={handleBlur('expProfesion')}
                        onChangeText={handleChange('expProfesion')}
                        // isDisabled={isLoadingExpediente}
                      />
                      <FormErrorMessage message={errors.expProfesion} />
                    </FormControl>
                    <FormControl mb={4}>
                      <FormControl.Label>Nacionalidad</FormControl.Label>
                      {/* <Select
                        minWidth='200'
                        accessibilityLabel='Seleccione la nacionalidad'
                        placeholder='Seleccione la nacionalidad'
                        _selectedItem={{
                          endIcon: <CheckIcon size={5} />,
                        }}
                        size='md'
                        isDisabled={true}
                        selectedValue={values.expCodpaiNacionalidad}
                        mt='1'
                        onValueChange={(itemValue: string) => {
                          setFieldValue('expCodpaiNacionalidad', itemValue);
                        }}
                      >
                        {(paises ?? []).map((status) => {
                          return (
                            <Select.Item
                              key={status.value}
                              label={status.label}
                              value={status.value}
                            />
                          );
                        })}
                      </Select> */}
                      <Input
                        placeholder='Nacionalidad'
                        size='md'
                        // lineHeight={"xl"}
                        color={'gray.500'}
                        // lineHeight={"xl"}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // variant="unstyled"
                        value={
                          paises.find(
                            (x) => x.value == values.expCodpaiNacionalidad
                          )?.label == undefined
                            ? 'Nacionalidad'
                            : paises.find(
                                (x) => x.value == values.expCodpaiNacionalidad
                              )?.label
                        }
                        isDisabled={true}
                      />
                    </FormControl>
                    <FormControl mb={4}>
                      <FormControl.Label>Fecha de Nacimiento</FormControl.Label>
                      {/* <Datepicker
                        style={styles.picker}
                        date={new Date(values.expFechaNac)}
                        onSelect={(nextDate) =>
                          setFieldValue(
                            "expFechaNac",
                            new Date(nextDate.toLocaleDateString())
                          )
                        }
                        size="large"
                        max={yesterday}
                        min={new Date("01/01/1900")}
                        controlStyle={styles.controlDisabled}
                        disabled={true}
                      /> */}
                      <Input
                        placeholder='Fecha de Nacimiento'
                        size='md'
                        color={'gray.500'}
                        // lineHeight={"xl"}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        value={moment(values.expFechaNac)
                          .format('DD/MM/YYYY')
                          .toString()}
                        onBlur={handleBlur('expFechaNac')}
                        onChangeText={handleChange('expFechaNac')}
                        isDisabled={true}
                      />
                    </FormControl>

                    {/* <FormControl.Label>Otros Datos</FormControl.Label> */}
                    <FormControl.Label
                      _text={{ color: '#0077CD', fontSize: 'xl' }}
                    >
                      Lugar de Nacimiento
                    </FormControl.Label>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.expCodpaiNacimiento &&
                          touched.expCodpaiNacimiento
                      )}
                    >
                      <FormControl.Label>País</FormControl.Label>
                      <Pressable
                        onPress={isOpenPai ? onClosePai : onOpenPai}
                        borderColor='gray.300'
                        borderWidth={1}
                        borderRadius={'sm'}
                        p={3}
                        _disabled={{
                          bg: '#FBFBFB',
                          color: 'gray.100',
                        }}
                        isDisabled={isLoadingPaises}
                      >
                        <Text color={'gray.500'}>
                          {paises.find((x) => x.value == pai)?.label ==
                            undefined ||
                          paises.find((x) => x.value == pai)?.label == ''
                            ? 'Seleccione un pais'
                            : paises.find((x) => x.value == pai)?.label}
                        </Text>
                      </Pressable>
                      {/* <Input
                        onPressIn={isOpenPai ? onClosePai : onOpenPai}
                        placeholder="Seleccione un Pais"
                        size="md"
                        // lineHeight={"xl"}
                        color={"gray.500"}
                        // variant="unstyled"
                        value={paiName != '' ? paiName : paises.find((x) => x.value == pai)?.label}
                        _disabled={{
                          bg: 'gray.100',
                          color: 'gray.100',
                        }}
                        isDisabled={isLoadingPaises}
                      /> */}
                      <PlaceActionSheet
                        array={paises}
                        setFieldValue={setFieldValue}
                        field={'expCodpaiNacimiento'}
                        value={values.expCodpaiNacimiento}
                        isOpen={isOpenPai}
                        onOpen={onOpenPai}
                        onClose={onClosePai}
                        place={1}
                        // setNames={setPaiName}
                        setData={setPai}
                        setExtraData={setExtraData}
                      />
                      <FormErrorMessage message={errors.expCodpaiNacimiento} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.expCoddepNac && touched.expCoddepNac
                      )}
                    >
                      <FormControl.Label>Departamento</FormControl.Label>
                      <Pressable
                        onPress={isOpenDep ? onCloseDep : onOpenDep}
                        borderColor='gray.300'
                        borderWidth={1}
                        borderRadius={'sm'}
                        p={3}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        isDisabled={
                          isLoadingDepartamentos || departamentos.length < 2
                        }
                      >
                        <Text
                          color={
                            isLoadingDepartamentos || departamentos.length < 2
                              ? 'gray.300'
                              : 'gray.500'
                          }
                        >
                          {departamentos.find((x) => x.value == dep)?.label ==
                            '' ||
                          departamentos.find((x) => x.value == dep)?.label ==
                            undefined
                            ? 'Seleccione un departamento'
                            : sentenceCase(
                                departamentos.find((x) => x.value == dep)?.label
                              )}
                        </Text>
                      </Pressable>
                      {/* <Input
                        onPressIn={isOpenDep ? onCloseDep : onOpenDep}
                        placeholder="Seleccione un departamento"
                        size="md"
                        color={"gray.500"}
                        // lineHeight={"xl"}
                        // variant="unstyled"
                        value={
                          depName !== undefined || depName !== ""
                            ? sentenceCase(depName)
                            : sentenceCase(
                                departamentos.find((x) => x.value == dep)?.label
                              )
                        }
                        _disabled={{
                          bg: "gray.100",
                        }}
                        isDisabled={
                          isLoadingDepartamentos || departamentos.length < 2
                        }
                      /> */}
                      <PlaceActionSheet
                        array={departamentos}
                        setFieldValue={setFieldValue}
                        field={'expCoddepNac'}
                        value={values.expCoddepNac}
                        isOpen={isOpenDep}
                        onOpen={onOpenDep}
                        onClose={onCloseDep}
                        place={2}
                        // setNames={setDepName}
                        setData={setDep}
                        setExtraData={setExtraData}
                      />
                      <FormErrorMessage message={errors.expCoddepNac} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.expCodmunNac && touched.expCodmunNac
                      )}
                    >
                      <FormControl.Label>Municipio</FormControl.Label>
                      <Pressable
                        onPress={isOpenMun ? onCloseMun : onOpenMun}
                        borderColor='gray.300'
                        borderWidth={1}
                        borderRadius={'sm'}
                        p={3}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        isDisabled={
                          dep == 0 ||
                          isLoadingMunicipios ||
                          municipios.length < 2
                        }
                      >
                        <Text
                          color={
                            dep == 0 ||
                            isLoadingMunicipios ||
                            municipios.length < 2
                              ? 'gray.300'
                              : 'gray.500'
                          }
                        >
                          {municipios.find((x) => x.value == mun)?.label ==
                            '' ||
                          municipios.find((x) => x.value == mun)?.label ==
                            undefined
                            ? 'Seleccione un municipio'
                            : sentenceCase(
                                municipios.find((x) => x.value == mun)?.label
                              )}
                        </Text>
                      </Pressable>
                      {/* <Input
                        onPressIn={isOpenMun ? onCloseMun : onOpenMun}
                        placeholder="Seleccione un municipio"
                        size="md"
                        color={"gray.500"}
                        // lineHeight={"xl"}
                        // variant="unstyled"
                        value={
                          munName !== undefined || munName !== ""
                            ? sentenceCase(munName)
                            : sentenceCase(
                                municipios.find((x) => x.value == mun)?.label
                              )
                        }
                        _disabled={{
                          bg: "gray.100",
                        }}
                        isDisabled={
                          mun == 0 ||
                          isLoadingMunicipios ||
                          municipios.length < 2
                        }
                      /> */}
                      <PlaceActionSheet
                        array={municipios}
                        setFieldValue={setFieldValue}
                        field={'expCodmunNac'}
                        value={values.expCodmunNac}
                        isOpen={isOpenMun}
                        onOpen={onOpenMun}
                        onClose={onCloseMun}
                        place={3}
                        // setNames={setMunName}
                        setData={setMun}
                      />
                      <FormErrorMessage message={errors.expCodmunNac} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(errors.expEmail && touched.expEmail)}
                    >
                      <FormControl.Label>Email</FormControl.Label>
                      <Input
                        placeholder='Email'
                        size='md'
                        color={'gray.500'}
                        // lineHeight={"xl"}
                        // variant="unstyled"
                        value={values.expEmail}
                        onBlur={handleBlur('expEmail')}
                        onChangeText={handleChange('expEmail')}
                        // isDisabled={isLoadingExpediente}
                      />
                      <FormErrorMessage message={errors.expEmail} />
                    </FormControl>
                    <FormControl mb={4}>
                      <FormControl.Label>Email Interno</FormControl.Label>
                      <Input
                        placeholder='Email Interno'
                        size='md'
                        color={'gray.500'}
                        // lineHeight={"xl"}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // variant="unstyled"
                        value={values.expEmailInterno}
                        // onBlur={handleBlur("expEmailInterno")}
                        // onChangeText={handleChange("expEmailInterno")}
                        isDisabled={true}
                      />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.expTelefonoMovil && touched.expTelefonoMovil
                      )}
                    >
                      <FormControl.Label>Teléfono Móvil</FormControl.Label>
                      <Input
                        w={'50%'}
                        placeholder='Teléfono Móvil'
                        size='md'
                        color={'gray.500'}
                        // lineHeight={"xl"}
                        // variant="unstyled"
                        keyboardType='phone-pad'
                        value={values.expTelefonoMovil}
                        onBlur={handleBlur('expTelefonoMovil')}
                        onChangeText={handleChange('expTelefonoMovil')}
                        // isDisabled={isLoadingExpediente}
                      />
                      <FormErrorMessage message={errors.expTelefonoMovil} />
                    </FormControl>
                    <FormControl mb={4}>
                      <FormControl.Label>
                        Teléfono Móvil Interno
                      </FormControl.Label>
                      <Input
                        w={'50%'}
                        placeholder='Teléfono Móvil Interno'
                        size='md'
                        color={'gray.500'}
                        // lineHeight={"xl"}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // variant="unstyled"
                        keyboardType='phone-pad'
                        value={values.expTelefonoInterno}
                        // onBlur={handleBlur("expTelefonoInterno")}
                        // onChangeText={handleChange("expTelefonoInterno")}
                        isDisabled={true}
                      />
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Observación</FormControl.Label>
                      <Input
                        placeholder='Observación'
                        size='md'
                        color={'gray.500'}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        //// lineHeight={"xl"}
                        //variant="unstyled"
                        value={values.expObservaciones}
                        onBlur={handleBlur('expObservaciones')}
                        onChangeText={handleChange('expObservaciones')}
                      />
                    </FormControl>
                  </FormControl>
                </Box>
                {change && (
                  <Center>
                    <Button
                      w={'40%'}
                      disabled={loading}
                      onPress={() => {
                        console.log('Formik Errors:', errors);
                        // console.log('Formik Values:', values);

                        handleSubmit();
                      }}
                    >
                      {loading ? (
                        <Row>
                          <Spinner size={'sm'} color={'white'} />
                          <Text color={'white'}>{'  Cargando...'}</Text>
                        </Row>
                      ) : (
                        <Text color={'white'}>{'Guardar'}</Text>
                      )}
                    </Button>
                  </Center>
                )}
              </ScrollView>
              {/* {change && (
                <Center>
                  <Button w={"40%"} onPress={() => handleSubmit()}>
                    <Text color={"white"}>{"Guardar"}</Text>
                  </Button>
                </Center>

                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 70,
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    height: 70,
                    backgroundColor: "#007AB8",
                    borderRadius: 100,
                  }}
                  onPress={() => handleSubmit()}
                >
                  <MaterialIcons name={"save"} size={30} color="white" />
                </TouchableOpacity>
              )} */}
            </Box>
          );
        }}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    color: 'red',
  },
  controlDisabled: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FBFBFB',
  },
  control: {
    color: 'green',
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
  },
});

export default GeneralData;
