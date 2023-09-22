import React, { useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  Input,
  Pressable,
  Select,
  Text,
  View,
  WarningOutlineIcon,
  ScrollView,
  useDisclose,
} from 'native-base';
// import { ScrollView } from "react-native";
import useIncidents from '../../../../hooks/useIncidents';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import { ExpedienteService } from '../../../../Services/rrhh/ExpExpediente';
import {
  IDexDirecciones,
  IExpExpediente,
} from '../../../../interfaces/rrhh/IExpExpediente';
import {
  usePaises,
  useDepartamentos,
  useMunicipios,
  useExpediente,
  useAdressTypes,
} from '../../../../hooks/useExpediente';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import PlaceActionSheet from '../PlaceActionSheet';
import ButtonSoup from '../../../../Components/ButtonSoup';
import { FormErrorMessage } from '../../../../Components/FormErrorMessage';
import { setChange } from '../../../../Redux/reducers/rrhh/expedienteSlice';
import { sentenceCase } from '../../../../Helpers/FormatToSenteceCase';

interface FormProps {
  initialValues: IDexDirecciones;
  loading: boolean;
  handleSubmit: (model: IDexDirecciones) => any; // accion submit (create/update)
  newItem: boolean;
  navigation: any;
  setProcess: (value: number) => void;
}

const DirectionCreateForm = ({
  initialValues,
  loading,
  handleSubmit,
  newItem,
  navigation,
  setProcess,
}: FormProps): React.ReactElement => {
  const dispatch = useDispatch();
  const [pai, setPai] = useState(initialValues.dexPais);
  const [dep, setDep] = useState(initialValues.dexDep);
  const [mun, setMun] = useState(initialValues.dexCodmun);

  const { paises, isLoadingPaises } = usePaises();
  const { departamentos, isLoadingDepartamentos } = useDepartamentos(pai);
  const { municipios, isLoadingMunicipios } = useMunicipios(dep);
  const { adressTypes } = useAdressTypes();
  var change = false;
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

  const setExtraData = (place: number) => {
    if (place == 1) {
      setDep(0);
      setMun(0);
    } else if (place == 2) {
      setMun(0);
    }
  };

  const [formData, setFormData] = useState<IDexDirecciones>(initialValues);

  const getFormData = (values) => {
    if (JSON.stringify(values) !== JSON.stringify(formData)) {
      change = true;
    } else {
      change = false;
    }
    dispatch(setChange(change));
  };

  const propertyType = [
    {
      label: 'Financiada',
      value: 'Financiada',
    },
    {
      label: 'Propia',
      value: 'Propia',
    },
    {
      label: 'Heredada',
      value: 'Heredada',
    },
    {
      label: 'Alquilada',
      value: 'Alquilada',
    },
    {
      label: 'Otro',
      value: 'Otro',
    },
  ];

  const validationSchema: Yup.SchemaOf<IDexDirecciones> = Yup.object({
    dexCodigo: Yup.number().required(),
    dexCodexp: Yup.number().notRequired(),
    dexDireccion: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(150, 'Ingrese máximo 150 caracteres.')
      .required('Dirección requerido.'),
    dexTipoPropiedad: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(25, 'Ingrese máximo 25 caracteres.')
      .required('Tipo de dirección requerido.'),
    dexPais: Yup.string()
      .min(1, 'Seleccione un país.')
      .required('Seleccione un país.'),
    dexDep: Yup.number().when('dexPais', {
      is: (dexPais) => dexPais != null,
      then: Yup.number()
        .min(1, 'Seleccione un departamento.')
        .required('Seleccione un departamento.'),
    }),
    dexCodmun: Yup.number().when('dexDep', {
      is: (dexDep) => dexDep > 0,
      then: Yup.number()
        .min(1, 'Seleccione un municipio.')
        .required('Seleccione un municipio.'),
    }),
    dexBarrio: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(50, 'Ingrese máximo 50 caracteres.')
      .required('Barrio requerido.'),
    dexCodigoPostal: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(50, 'Ingrese máximo 50 caracteres.')
      .notRequired(),
    dexTelefono: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(20, 'Ingrese máximo 20 caracteres.')
      .matches(
        /^([0-9]{4})-?([0-9]{4})$/,
        'Teléfono debe tener el formato 1234-5678 o 12345678'
      )
      .required('Teléfono requerido.'),
    dexCodtid: Yup.number()
      .min(1, 'Seleccione un tipo de dirección.')
      .required('Seleccione un tipo de dirección.'),
    dexCodtName: Yup.string().notRequired(),
    dexObservacion: Yup.string()
      .max(4000, 'Ingrese máximo 4000 caracteres.')
      .optional(),
    dexCreadoUsuario: Yup.boolean().notRequired(),
  });

  return (
    <ScrollView>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(model: IDexDirecciones) => {
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
        }: FormikProps<IDexDirecciones>) => {
          getFormData(values);
          return (
            <Box mb={3} px={3}>
              <Box mb={3}>
                <FormControl.Label>
                  Código: {values.dexCodigo ? values.dexCodigo : 'Nuevo'}
                </FormControl.Label>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.dexDireccion && touched.dexDireccion
                  )}
                >
                  <FormControl.Label>Dirección</FormControl.Label>
                  <Input
                    placeholder='Dirección'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // lineHeight={"xl"}
                    // variant="unstyled"
                    value={values.dexDireccion}
                    isDisabled={
                      newItem
                        ? false
                        : values.dexCreadoUsuario
                        ? false
                        : initialValues.dexDireccion != ''
                    }
                    onBlur={handleBlur('dexDireccion')}
                    onChangeText={handleChange('dexDireccion')}
                    // isDisabled={isLoadingExpediente}
                  />
                  <FormErrorMessage message={errors.dexDireccion} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.dexTipoPropiedad && touched.dexTipoPropiedad
                  )}
                >
                  <FormControl.Label>Tipo de Propiedad</FormControl.Label>
                  <ButtonSoup
                    array={propertyType}
                    setfieldValue={setFieldValue}
                    field={'dexTipoPropiedad'}
                    value={values.dexTipoPropiedad}
                    creator={values.dexCreadoUsuario}
                    isnew={newItem}
                  />
                  <FormErrorMessage message={errors.dexTipoPropiedad} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.dexPais && touched.dexPais)}
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
                      {paises.find((x) => x.value == pai)?.label == undefined ||
                      paises.find((x) => x.value == pai)?.label == ''
                        ? 'Seleccione un pais'
                        : paises.find((x) => x.value == pai)?.label}
                    </Text>
                  </Pressable>
                  {/* <Input
                    onPressIn={isOpenPai ? onClosePai : onOpenPai}
                    placeholder="Seleccione un país"
                    size="md"
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // lineHeight={"xl"}
                    // variant="unstyled"
                    value={paiName != '' ? paiName : paises.find((x) => x.value == pai)?.label}
                    isDisabled={
                      isLoadingPaises ||
                      (newItem ? false : values.dexCreadoUsuario ? false : initialValues.dexPais != '')
                    }
                  /> */}
                  <PlaceActionSheet
                    array={paises}
                    setFieldValue={setFieldValue}
                    field={'dexPais'}
                    value={values.dexPais}
                    isOpen={isOpenPai}
                    onOpen={onOpenPai}
                    onClose={onClosePai}
                    place={1}
                    setData={setPai}
                    setExtraData={setExtraData}
                  />
                  <FormErrorMessage message={errors.dexPais} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.dexDep && touched.dexDep)}
                >
                  <FormControl.Label>Departamentos</FormControl.Label>
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
                      {departamentos.find((x) => x.value == dep)?.label == '' ||
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
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // lineHeight={"xl"}
                    // variant="unstyled"
                    value={depName != '' ? depName : departamentos.find((x) => x.value == dep)?.label}
                    isDisabled={
                      isLoadingDepartamentos ||
                      pai == '' ||
                      departamentos.length == 0 ||
                      (newItem ? false : values.dexCreadoUsuario ? false : initialValues.dexDep > 0)
                    }
                  /> */}
                  <PlaceActionSheet
                    array={departamentos}
                    setFieldValue={setFieldValue}
                    field={'dexDep'}
                    value={values.dexDep}
                    isOpen={isOpenDep}
                    onOpen={onOpenDep}
                    onClose={onCloseDep}
                    place={2}
                    setData={setDep}
                    setExtraData={setExtraData}
                  />
                  <FormErrorMessage message={errors.dexDep} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.dexCodmun && touched.dexCodmun)}
                >
                  <FormControl.Label>Municipios</FormControl.Label>
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
                      dep == 0 || isLoadingMunicipios || municipios.length < 2
                    }
                  >
                    <Text
                      color={
                        dep == 0 || isLoadingMunicipios || municipios.length < 2
                          ? 'gray.300'
                          : 'gray.500'
                      }
                    >
                      {municipios.find((x) => x.value == mun)?.label == '' ||
                      municipios.find((x) => x.value == mun)?.label == undefined
                        ? 'Seleccione un municipio'
                        : sentenceCase(
                            municipios.find((x) => x.value == mun)?.label
                          )}
                    </Text>
                  </Pressable>
                  {/* <Input
                    onPressIn={isOpenMun ? onCloseMun : onOpenMun}
                    placeholder="Seleccione un Municipio"
                    size="md"
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // lineHeight={"xl"}
                    // variant="unstyled"
                    value={munName != '' ? munName : municipios.find((x) => x.value == initialValues.dexCodmun)?.label}
                    isDisabled={
                      dep == 0 ||
                      isLoadingMunicipios ||
                      municipios.length == 0 ||
                      (newItem ? false : values.dexCreadoUsuario ? false : initialValues.dexCodmun > 0)
                    }
                  /> */}
                  <PlaceActionSheet
                    array={municipios}
                    setFieldValue={setFieldValue}
                    field={'dexCodmun'}
                    value={values.dexCodmun}
                    isOpen={isOpenMun}
                    onOpen={onOpenMun}
                    onClose={onCloseMun}
                    place={3}
                    setData={setMun}
                  />
                  <FormErrorMessage message={errors.dexCodmun} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.dexBarrio && touched.dexBarrio)}
                >
                  <FormControl.Label>Barrio</FormControl.Label>
                  <Input
                    placeholder='Barrio'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    isDisabled={
                      newItem
                        ? false
                        : values.dexCreadoUsuario
                        ? false
                        : initialValues.dexBarrio != ''
                    }
                    // // lineHeight={"xl"}
                    // variant="unstyled"
                    value={values.dexBarrio}
                    onBlur={handleBlur('dexBarrio')}
                    onChangeText={handleChange('dexBarrio')}
                  />
                  <FormErrorMessage message={errors.dexBarrio} />
                </FormControl>
                <FormControl flexDirection={'row'} w={'full'}>
                  <Box flex={1} mr={2}>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.dexCodigoPostal && touched.dexCodigoPostal
                      )}
                    >
                      <FormControl.Label>Código Postal</FormControl.Label>
                      <Input
                        placeholder='Código Postal'
                        size='md'
                        color={'gray.500'}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // w={"50%"}
                        // // lineHeight={"xl"}
                        // variant="unstyled"
                        value={values.dexCodigoPostal}
                        onBlur={handleBlur('dexCodigoPostal')}
                        onChangeText={handleChange('dexCodigoPostal')}
                        isDisabled={
                          newItem
                            ? false
                            : values.dexCreadoUsuario
                            ? false
                            : initialValues.dexCodigoPostal != ''
                        }
                      />
                      <FormErrorMessage message={errors.dexCodigoPostal} />
                    </FormControl>
                  </Box>
                  <Box flex={1}>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.dexTelefono && touched.dexTelefono
                      )}
                    >
                      <FormControl.Label>Teléfono</FormControl.Label>
                      <Input
                        placeholder='Teléfono'
                        size='md'
                        color={'gray.500'}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // w={"50%"}
                        // // lineHeight={"xl"}
                        keyboardType='phone-pad'
                        // variant="unstyled"
                        value={values.dexTelefono}
                        onBlur={handleBlur('dexTelefono')}
                        onChangeText={handleChange('dexTelefono')}
                        isDisabled={
                          newItem
                            ? false
                            : values.dexCreadoUsuario
                            ? false
                            : initialValues.dexTelefono != ''
                        }
                      />
                      <FormErrorMessage message={errors.dexTelefono} />
                    </FormControl>
                  </Box>
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.dexCodtid && touched.dexCodtid)}
                >
                  <FormControl.Label>Tipo Dirección</FormControl.Label>
                  <Select
                    minWidth='200'
                    accessibilityLabel='Seleccione el Tipo Dirección'
                    placeholder='Seleccione el Tipo Dirección'
                    _selectedItem={{
                      endIcon: <CheckIcon size={5} />,
                    }}
                    size='md'
                    color={'gray.500'}
                    isDisabled={
                      newItem
                        ? false
                        : values.dexCreadoUsuario
                        ? false
                        : initialValues.dexCodtid >= 1
                    }
                    selectedValue={values.dexCodtid.toString()}
                    mt='1'
                    onValueChange={(itemValue: string) => {
                      setFieldValue('dexCodtid', +itemValue);
                    }}
                  >
                    {(adressTypes ?? []).map((status) => {
                      return (
                        <Select.Item
                          key={status.value}
                          label={status.label}
                          value={status.value}
                        />
                      );
                    })}
                  </Select>
                  <FormErrorMessage message={errors.dexCodtid} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.dexObservacion && touched.dexObservacion
                  )}
                >
                  <FormControl.Label>Observación</FormControl.Label>
                  <Input
                    placeholder='Observación'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // // lineHeight={"xl"}
                    // variant="unstyled"
                    value={values.dexObservacion}
                    onBlur={handleBlur('dexObservacion')}
                    onChangeText={handleChange('dexObservacion')}
                  />
                  <FormErrorMessage message={errors.dexObservacion} />
                </FormControl>
              </Box>
              <View
                style={
                  newItem
                    ? {
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 8,
                      }
                    : values.dexCreadoUsuario
                    ? {
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 8,
                      }
                    : change
                    ? {
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 8,
                      }
                    : { justifyContent: 'center', alignItems: 'center' }
                }
                flex={1}
                flexDirection={'row'}
                justifyContent={'space-between'}
                mx={8}
              >
                <Button
                  w={'40%'}
                  onPress={() => navigation.goBack()}
                  disabled={loading}
                  variant={'outline'}
                >
                  {newItem
                    ? 'Cancelar'
                    : values.dexCreadoUsuario
                    ? 'Salir'
                    : change
                    ? 'Cancelar'
                    : 'Salir'}
                </Button>

                <Button
                  w={'40%'}
                  style={
                    newItem
                      ? {}
                      : values.dexCreadoUsuario
                      ? {}
                      : change
                      ? {}
                      : { display: 'none' }
                  }
                  onPress={() => {
                    setProcess(1);
                    console.log(errors);
                    handleSubmit();
                  }}
                  disabled={loading}
                >
                  Guardar
                </Button>
              </View>
            </Box>
          );
        }}
      </Formik>
    </ScrollView>
  );
};

export default DirectionCreateForm;
