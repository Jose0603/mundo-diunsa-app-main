import React, { useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  PresenceTransition,
  Pressable,
  Text,
  View,
  Image,
  useDisclose,
  Switch,
} from 'native-base';
import { ScrollView, StyleSheet } from 'react-native';
import { IFaeFamiliares } from '../../../../interfaces/rrhh/IExpExpediente';
import {
  useCurrency,
  useDocs,
  usePaises,
  useParentescos,
} from '../../../../hooks/useExpediente';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';
import { pickImage, takeImage } from '../../../../Components/UploadImage';
import { Loading } from '../../../../Components/Loading';
import { IUploadingImage } from '../../../../interfaces/IUploadingImage';
import { FamilyDocsFileUpload } from '../../../../Services/rrhh/FaeFamiliaresExpediente';
import ImageDetailViewer from '../../../../Components/ImageDetailViewer';
import { useCustomToast } from '../../../../hooks/useCustomToast';
import { baseURL } from '../../../../Axios';
import { FormErrorMessage } from '../../../../Components/FormErrorMessage';
import SearchAbleActionSheet from '../SearchAbleActionSheet';
import FaeButtonSoup from './FaeButtonSoup';
import ButtonSoup from '../../../../Components/ButtonSoup';
import { Datepicker, Layout } from '@ui-kitten/components';
import { setChange } from '../../../../Redux/reducers/rrhh/expedienteSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/reducers/rootReducer';

interface FormProps {
  initialValues: IFaeFamiliares;
  loading: boolean;
  handleSubmit: (model: IFaeFamiliares) => any; // accion submit (create/update)
  newItem: boolean;
  navigation: any;
  setProcess: (value: number) => void;
}

const FamiliaresCreateForm = ({
  initialValues,
  loading,
  handleSubmit,
  newItem,
  navigation,
  setProcess,
}: FormProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { parentescos, isLoadingParentescos } = useParentescos();
  const { paises, isLoadingPaises } = usePaises();
  const { documentos, isLoadingDocumentos } = useDocs();
  const { currencies, isLoadingCurrencies } = useCurrency();

  const [parentescoName, setParentescoName] = useState('');
  const [paiName, setPaiName] = useState('');
  const [documentoName, setDocumentoName] = useState('');
  const [currencyName, setCurrencyName] = useState('');

  const [visible, setVisible] = useState(false);
  const showToast = useCustomToast();
  const [showingImages, setshowingImages] = useState<string[]>([
    ...initialValues.faeImagenes,
  ]);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [estudiaBool, setEstudiaBool] = useState(false);

  const [fecha, setFecha] = useState(false);
  const refContainer = React.useRef('');

  var change = false;
  const now = new Date();
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  const {
    isOpen: isOpenParentesco,
    onOpen: onOpenParentesco,
    onClose: onCloseParentesco,
  } = useDisclose();
  const {
    isOpen: isOpenPai,
    onOpen: onOpenPai,
    onClose: onClosePai,
  } = useDisclose();
  const {
    isOpen: isOpenDocumento,
    onOpen: onOpenDocumento,
    onClose: onCloseDocumento,
  } = useDisclose();
  const {
    isOpen: isOpenCurrency,
    onOpen: onOpenCurrency,
    onClose: onCloseCurrency,
  } = useDisclose();

  const [formData, setFormData] = useState<IFaeFamiliares>(initialValues);

  const getFormData = (values) => {
    // console.log(
    //   "🚀 ~ file: FamiliaresCreateForm.tsx:107 ~ getFormData ~ values",
    //   values
    // );
    if (JSON.stringify(values) !== JSON.stringify(formData)) {
      change = true;
    } else {
      change = false;
    }
    dispatch(setChange(change));
  };

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const handleUpload = async (res: IUploadingImage) => {
    try {
      setIsUploading(true);
      const uploadResponse = await FamilyDocsFileUpload(
        res,
        initialValues.faeCodigo
      );
      if (uploadResponse.result) {
        const newShowingImages = [...showingImages, uploadResponse.data.name];
        setshowingImages(newShowingImages);
      } else {
        showToast({
          title: 'Hubo un error',
          status: 'error',
          description: uploadResponse.message,
        });
      }
    } catch (error) {
      showToast({
        title: 'Hubo un error',
        status: 'error',
        description: 'Ha ocurrido un error al subir la imagen',
      });
      console.error('ha ocurrido un error al subir la imagen', error);
    } finally {
      setIsUploading(false);
    }
  };

  const sex = [
    {
      label: 'Femenino',
      value: 'F',
    },
    {
      label: 'Masculino',
      value: 'M',
    },
  ];

  const booleans = [
    {
      label: ' Si ',
      value: true,
    },
    {
      label: 'No',
      value: false,
    },
  ];

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

  const validationSchema: Yup.SchemaOf<IFaeFamiliares> = Yup.object({
    faeCodigo: Yup.number().required(),
    faeCodexp: Yup.number().notRequired(),
    faeNombre: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(100, 'Ingrese máximo 100 caracteres.')
      .required('Nombre requerido.'),
    faeCodprt: Yup.number()
      .min(1, 'Seleccione un parentesco.')
      .required('Seleccione un parentesco.'),
    faeCodprtName: Yup.string().notRequired(),
    faeCodpaiNacionalidad: Yup.string().required('Seleccione la nacionalidad.'),
    faePais: Yup.string().notRequired(),
    faeFechaNac: Yup.string()
      // .max(new Date(), "El dia no puede ser mayor que hoy.")
      .required('Fecha de nacimiento requerida.'),
    faeSexo: Yup.string().required('Seleccione un genero.'),
    faeEstadoCivil: Yup.string().required('Seleccione un estado civil.'),
    faeOcupacion: Yup.string()
      .max(100, 'Ingrese máximo 100 caracteres.')
      .optional(),
    faeCodtdo: Yup.number()
      .min(1, 'Seleccione un tipo de documento.')
      .required('Seleccione un tipo de documento.'),
    faeDocumento: Yup.string()
      .max(20, 'Ingrese máximo 20 caracteres.')
      .optional(),
    faeTelefonoMovil: Yup.string()
      .when('faeFallecido', {
        is: true,
        then: Yup.string().notRequired(),
      })
      .when('faeFallecido', {
        is: false,
        then: Yup.string()
          .max(20, 'Ingrese máximo 20 caracteres.')
          .matches(
            /^([0-9]{4})-?([0-9]{4})$/,
            'Teléfono debe tener el formato 1234-5678 o 12345678'
          )
          .required('Teléfono requerido.'),
      }),
    faeEstudia: Yup.boolean(),
    faeBeca: Yup.boolean(),
    faeNivelEstudio: Yup.string()
      .when('faeEstudia', {
        is: true,
        then: Yup.string()
          .max(30, 'Ingrese máximo 30 caracteres.')
          .required('Ingrese nivel de estudio.'),
      })
      .when('faeEstudia', {
        is: false,
        then: Yup.string().notRequired(),
      }),
    faeLugarEstudio: Yup.string()
      .when('faeEstudia', {
        is: true,
        then: Yup.string()
          .max(150, 'Ingrese máximo 150 caracteres.')
          .required('Lugar de estudio requerido.'),
      })
      .when('faeEstudia', {
        is: false,
        then: Yup.string().notRequired(),
      }),
    faeDepende: Yup.boolean(),
    faeEsBenefPrestLegales: Yup.boolean(),
    faeTrabaja: Yup.boolean(),
    faeCargo: Yup.string()
      .when('faeTrabaja', {
        is: true,
        then: Yup.string()
          .max(100, 'Ingrese máximo 100 caracteres.')
          .required('Cargo requerido.'),
      })
      .when('faeTrabaja', {
        is: false,
        then: Yup.string().notRequired(),
      }),
    faeLugarTrabajo: Yup.string()
      .when('faeTrabaja', {
        is: true,
        then: Yup.string()
          .max(100, 'Ingrese máximo 100 caracteres.')
          .required('Lugar de trabajo requerido.'),
      })
      .when('faeTrabaja', {
        is: false,
        then: Yup.string().notRequired(),
      }),
    faeTelefonoTrabajo: Yup.string()
      .when('faeTrabaja', {
        is: true,
        then: Yup.string()
          .max(20, 'Ingrese máximo 20 caracteres.')
          .matches(
            /^([0-9]{4})-?([0-9]{4})$/,
            'Teléfono debe tener el formato 1234-5678 o 12345678'
          )
          .optional(),
      })
      .when('faeTrabaja', {
        is: false,
        then: Yup.string().notRequired(),
      }),
    faeSalario: Yup.number()
      .typeError('Ingrese solo números')
      .when('faeTrabaja', {
        is: false,
        then: Yup.number().notRequired(),
      })
      .when('faeTrabaja', {
        is: true,
        then: Yup.number()
          .min(1, 'Ingrese minimo 1 numeros.')
          .max(8, 'Ingrese máximo 8 numeros.')
          .optional(),
      }),

    faeCodmon: Yup.string()
      .when('faeSalario', {
        is: (faeSalario) => faeSalario > 0,
        then: Yup.string()
          .nullable()
          .min(1, 'Seleccione una moneda.')
          .required('Seleccione una moneda.'),
      })
      .when('faeSalario', {
        is: (faeSalario) => faeSalario <= 0,
        then: Yup.string().notRequired(),
      })
      .when('faeSalario', {
        is: (faeSalario) => faeSalario == '',
        then: Yup.string().notRequired(),
      }),
    faeFallecido: Yup.boolean(),
    faeFechaFallecido: Yup.string()
      .when('faeFallecido', {
        is: true,
        then: Yup.string()
          // .max(new Date(), "El dia no puede ser mayor que hoy.")
          .nullable()
          .required('Fecha de fallecimiento requerida.'),
      })
      .when('faeFallecido', {
        is: false,
        then: Yup.string().nullable().notRequired(),
      }),
    faePropertyBagData: Yup.string().notRequired(),
    faeCreadoUsuario: Yup.boolean().notRequired(),
    faeObservacion: Yup.string().optional(),
    faeImagenes: Yup.array()
      .when('faeCodprt', {
        is: 13,
        then: Yup.array().min(1, 'Debe subir al menos una imagen.'),
      })
      .when('faeCodprt', {
        is: 14,
        then: Yup.array().min(1, 'Debe subir al menos una imagen.'),
      }) /*.when({
      is: showingImages.length > initialValues.faeImagenes.length,
      then: Yup.array().max(3, "Debe subir máximo 3 imágenes."),
    })*/,
  });
  // console.log("hfuehfuuewfuwueofguoefw");

  return (
    <ScrollView>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(model: IFaeFamiliares) => {
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
        }: FormikProps<IFaeFamiliares>) => {
          getFormData(values);
          useEffect(() => {
            setFieldValue('faeImagenes', showingImages);
          }, [showingImages]);
          return (
            <Box mb={3} px={3}>
              <Box mb={3}>
                <FormControl.Label>
                  Código: {values.faeCodigo ? values.faeCodigo : 'Nuevo'}
                </FormControl.Label>

                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.faeNombre && touched.faeNombre)}
                >
                  <FormControl.Label>Nombre Completo</FormControl.Label>
                  <Input
                    placeholder='Nombre Completo'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // lineHeight={"xl"}
                    //variant="unstyled"
                    value={values.faeNombre}
                    onBlur={handleBlur('faeNombre')}
                    onChangeText={handleChange('faeNombre')}
                    isDisabled={
                      newItem
                        ? false
                        : values.faeCreadoUsuario
                        ? false
                        : initialValues.faeNombre != ''
                    }
                  />
                  <FormErrorMessage message={errors.faeNombre} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.faeCodprt && touched.faeCodprt)}
                >
                  <FormControl.Label>Parentesco</FormControl.Label>
                  <Pressable
                    onPress={
                      isOpenParentesco ? onCloseParentesco : onOpenParentesco
                    }
                    borderColor='gray.300'
                    borderWidth={1}
                    borderRadius={'sm'}
                    p={3}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    isDisabled={
                      isLoadingParentescos ||
                      (newItem
                        ? false
                        : values.faeCreadoUsuario
                        ? false
                        : initialValues.faeCodprt > 0)
                    }
                  >
                    <Text
                      color={
                        isLoadingParentescos ||
                        (newItem
                          ? false
                          : values.faeCreadoUsuario
                          ? false
                          : initialValues.faeCodprt > 0)
                          ? 'gray.300'
                          : 'gray.500'
                      }
                    >
                      {values.faeCodprt > 0
                        ? parentescos.find((x) => x.value == values.faeCodprt)
                            ?.label
                        : 'Seleccione un Parentesco'}
                    </Text>
                  </Pressable>
                  {/* <Input
                    onPressIn={isOpenParentesco ? onCloseParentesco : onOpenParentesco}
                    placeholder="Seleccione un Parentesco"
                    size="md"
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // lineHeight={"xl"}
                    // //variant="unstyled"
                    value={
                      parentescoName != ''
                        ? parentescoName
                        : parentescos.find((x) => x.value == initialValues.faeCodprt)?.label
                    }
                    isDisabled={
                      isLoadingParentescos ||
                      (newItem ? false : values.faeCreadoUsuario ? false : initialValues.faeCodprt > 0)
                    }
                  /> */}
                  <SearchAbleActionSheet
                    array={parentescos}
                    setFieldValue={setFieldValue}
                    field={'faeCodprt'}
                    value={values.faeCodprt}
                    isOpen={isOpenParentesco}
                    onOpen={onOpenParentesco}
                    onClose={onCloseParentesco}
                    // setNames={setParentescoName}
                    data={'Parentescos'}
                  />
                  {values.faeCreadoUsuario == true &&
                    (values.faeCodprt == 14 || values.faeCodprt == 13) && (
                      <Center>
                        <Text
                          fontSize='sm'
                          color='red.500'
                          _dark={{
                            color: 'red.500',
                          }}
                          textAlign='center'
                        >
                          * Los parentescos de cónyuge o hijo(a) no se podrán
                          modificar al crearlos *
                        </Text>
                      </Center>
                    )}
                  <FormErrorMessage message={errors.faeCodprt} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.faeCodpaiNacionalidad &&
                      touched.faeCodpaiNacionalidad
                  )}
                >
                  <FormControl.Label>Nacionalidad</FormControl.Label>
                  <Pressable
                    onPress={isOpenPai ? onClosePai : onOpenPai}
                    borderColor='gray.300'
                    borderWidth={1}
                    borderRadius={'sm'}
                    p={3}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    isDisabled={
                      isLoadingPaises ||
                      (newItem
                        ? false
                        : values.faeCreadoUsuario
                        ? false
                        : initialValues.faeCodpaiNacionalidad != '')
                    }
                  >
                    <Text
                      color={
                        isLoadingPaises ||
                        (newItem
                          ? false
                          : values.faeCreadoUsuario
                          ? false
                          : initialValues.faeCodpaiNacionalidad != '')
                          ? 'gray.300'
                          : 'gray.500'
                      }
                    >
                      {values.faeCodpaiNacionalidad != ''
                        ? paises.find(
                            (x) => x.value == values.faeCodpaiNacionalidad
                          )?.label
                        : 'Seleccione la nacionalidad'}
                    </Text>
                  </Pressable>
                  {/* <Input
                    onPressIn={isOpenPai ? onClosePai : onOpenPai}
                    placeholder="Seleccione su Nacionalidad"
                    size="md"
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // lineHeight={"xl"}
                    // //variant="unstyled"
                    value={
                      paiName != ''
                        ? paiName
                        : paises.find((x) => x.value == initialValues.faeCodpaiNacionalidad)?.label
                    }
                    isDisabled={
                      isLoadingPaises ||
                      (newItem ? false : values.faeCreadoUsuario ? false : initialValues.faeCodpaiNacionalidad != '')
                    }
                  /> */}
                  <SearchAbleActionSheet
                    array={paises}
                    setFieldValue={setFieldValue}
                    field={'faeCodpaiNacionalidad'}
                    value={values.faeCodpaiNacionalidad}
                    isOpen={isOpenPai}
                    onOpen={onOpenPai}
                    onClose={onClosePai}
                    data={'Paises'}
                  />
                  <FormErrorMessage message={errors.faeCodpaiNacionalidad} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.faeFechaNac && touched.faeFechaNac)}
                >
                  <FormControl.Label>Fecha Nacimiento</FormControl.Label>
                  <Pressable
                    onPress={() => setFecha(true)}
                    borderColor='gray.300'
                    borderWidth={1}
                    borderRadius={'sm'}
                    p={3}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    isDisabled={
                      newItem
                        ? false
                        : values.faeCreadoUsuario
                        ? false
                        : initialValues.faeFechaNac != ''
                    }
                  >
                    <Text
                      color={
                        newItem
                          ? 'gray.500'
                          : values.faeCreadoUsuario
                          ? 'gray.500'
                          : initialValues.faeFechaNac == ''
                          ? 'gray.500'
                          : 'gray.300'
                      }
                    >
                      {refContainer.current != ''
                        ? refContainer.current
                        : values.faeFechaNac != ''
                        ? moment(values.faeFechaNac)
                            .startOf('day')
                            .format('DD/MM/YYYY')
                        : 'Seleccione una Fecha'}
                    </Text>
                  </Pressable>
                  {/* <Input
                    onPressIn={() => setFecha(true)}
                    placeholder='Fecha de Nacimiento'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    showSoftInputOnFocus={false}
                    // lineHeight={"xl"}
                    // variant="unstyled"
                    value={moment(values.faeFechaNac).format('DD/MM/YYYY')}
                    isDisabled={
                      newItem ? false : values.faeCreadoUsuario ? false : true
                    }
                  /> */}
                  {fecha && (
                    <RNDateTimePicker
                      value={moment(values.faeFechaNac).toDate()}
                      mode='date'
                      display='default'
                      minimumDate={moment('01/01/1900').toDate()}
                      maximumDate={now}
                      timeZoneOffsetInMinutes={0}
                      onChange={(e, selectedDate) => {
                        refContainer.current = moment(selectedDate)
                          // .startOf('day')
                          .format('DD/MM/YYYY')
                          .toString();
                        setFecha(false);
                        setFieldValue('faeFechaNac', selectedDate.toString());
                      }}
                    />
                  )}
                  {/* <Datepicker
                    style={styles.picker}
                    date={moment(values.faeFechaNac)}
                    onSelect={(nextDate) =>
                      setFieldValue(
                        'faeFechaNac',
                        moment(nextDate).format('YYYY-MM-DD').toString()
                      )
                    }
                    size='large'
                    max={yesterday}
                    min={new Date('01/01/1900')}
                    controlStyle={
                      newItem
                        ? styles.control
                        : values.faeCreadoUsuario
                        ? styles.control
                        : styles.controlDisabled
                    }
                    status='basic'
                    disabled={
                      newItem ? false : values.faeCreadoUsuario ? false : true
                    }
                  /> */}
                  <FormErrorMessage message={errors.faeFechaNac} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.faeSexo && touched.faeSexo)}
                >
                  <FormControl.Label>Sexo</FormControl.Label>
                  <ButtonSoup
                    array={sex}
                    setfieldValue={setFieldValue}
                    field={'faeSexo'}
                    value={values.faeSexo}
                    creator={values.faeCreadoUsuario}
                    isnew={newItem}
                  />
                  <FormErrorMessage message={errors.faeSexo} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.faeEstadoCivil && touched.faeEstadoCivil
                  )}
                >
                  <FormControl.Label>Estado Civil</FormControl.Label>
                  <ButtonSoup
                    array={civilStatus}
                    setfieldValue={setFieldValue}
                    field={'faeEstadoCivil'}
                    value={values.faeEstadoCivil}
                    creator={values.faeCreadoUsuario}
                    isnew={newItem}
                  />
                  <FormErrorMessage message={errors.faeEstadoCivil} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.faeOcupacion && touched.faeOcupacion
                  )}
                >
                  <FormControl.Label>Ocupación</FormControl.Label>
                  <Input
                    placeholder='Ocupación'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // lineHeight={"xl"}
                    //variant="unstyled"
                    value={values.faeOcupacion}
                    onBlur={handleBlur('faeOcupacion')}
                    onChangeText={handleChange('faeOcupacion')}
                    isDisabled={
                      newItem
                        ? false
                        : values.faeCreadoUsuario
                        ? false
                        : initialValues.faeOcupacion != ''
                    }
                  />
                  <FormErrorMessage message={errors.faeOcupacion} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={
                    Boolean(errors.faeCodtdo && touched.faeCodtdo) &&
                    values.faeCodtdo == 0
                  }
                >
                  <FormControl.Label>Tipo Documento</FormControl.Label>
                  <Pressable
                    onPress={
                      isOpenDocumento ? onCloseDocumento : onOpenDocumento
                    }
                    borderColor='gray.300'
                    borderWidth={1}
                    borderRadius={'sm'}
                    p={3}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    isDisabled={
                      isLoadingDocumentos ||
                      (newItem
                        ? false
                        : values.faeCreadoUsuario
                        ? false
                        : initialValues.faeCodtdo >= 0)
                    }
                  >
                    <Text
                      color={
                        isLoadingDocumentos ||
                        (newItem
                          ? false
                          : values.faeCreadoUsuario
                          ? false
                          : initialValues.faeCodtdo >= 0)
                          ? 'gray.300'
                          : 'gray.500'
                      }
                    >
                      {values.faeCodtdo > 0
                        ? documentos.find((x) => x.value == values.faeCodtdo)
                            ?.label
                        : 'Seleccione un documento'}
                    </Text>
                  </Pressable>
                  {/* <Input
                    onPressIn={
                      isOpenDocumento ? onCloseDocumento : onOpenDocumento
                    }
                    placeholder="Seleccione un documento"
                    size="md"
                    color={"gray.500"}
                    _disabled={{
                      bg: "gray.100",
                    }}
                    // lineHeight={"xl"}
                    // //variant="unstyled"
                    value={
                      paiName != ""
                        ? documentoName
                        : documentos.find(
                            (x) => x.value == initialValues.faeCodtdo
                          )?.label
                    }
                    isDisabled={
                      isLoadingDocumentos ||
                      (newItem
                        ? false
                        : values.faeCreadoUsuario
                        ? false
                        : initialValues.faeCodtdo >= 0)
                    }
                  /> */}
                  <SearchAbleActionSheet
                    array={documentos}
                    setFieldValue={setFieldValue}
                    field={'faeCodtdo'}
                    value={values.faeCodtdo}
                    isOpen={isOpenDocumento}
                    onOpen={onOpenDocumento}
                    onClose={onCloseDocumento}
                    // setNames={setDocumentoName}
                    data={'Tipo de Documento'}
                  />
                  <FormErrorMessage message={errors.faeCodtdo} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.faeImagenes && touched.faeImagenes)}
                >
                  {((newItem &&
                    (values.faeCodprt == 14 || values.faeCodprt == 13)) ||
                    !newItem) && (
                    <Center>
                      <ImageDetailViewer
                        visible={visible}
                        toggleVisible={toggleVisible}
                        showingImages={showingImages}
                        selectedImage={selectedImage}
                      />
                      <ScrollView horizontal>
                        {showingImages &&
                          showingImages.map((imageName: string, i: number) => {
                            return (
                              <Pressable
                                m={2}
                                key={`attachment-${i}`}
                                onPress={() => {
                                  setSelectedImage(i);
                                  setVisible(!visible);
                                }}
                              >
                                <PresenceTransition
                                  visible={true}
                                  initial={{
                                    opacity: 0,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    transition: {
                                      duration: 250,
                                    },
                                  }}
                                >
                                  <Image
                                    key={`image-${i}`}
                                    source={{
                                      uri: `${baseURL}/images/${imageName}`,
                                    }}
                                    size={100}
                                    alt={`attachment-${imageName}`}
                                  />
                                  {/* <Text>{imageName}</Text> */}
                                </PresenceTransition>
                              </Pressable>
                            );
                          })}
                      </ScrollView>
                      <HStack space={6} mt={2}>
                        {isUploading && values.faeCodigo >= 0 ? (
                          <Loading message='Subiendo imagen...' />
                        ) : (
                          <>
                            {values.faeCreadoUsuario == true && (
                              <>
                                <Pressable
                                  onPress={async () => {
                                    try {
                                      let res = await takeImage();
                                      if (res !== null) {
                                        handleUpload(res);
                                        setFieldValue('faeImagenes', [
                                          ...showingImages,
                                        ]);
                                      }
                                    } catch (error) {
                                      console.error(error);
                                    }
                                  }}
                                >
                                  <Center>
                                    <Feather
                                      name='camera'
                                      size={24}
                                      color='black'
                                    />
                                    <Text fontSize='sm'>Hacer Foto</Text>
                                  </Center>
                                </Pressable>
                                <Pressable
                                  onPress={async () => {
                                    try {
                                      let res = await pickImage();
                                      if (res !== null) {
                                        handleUpload(res);
                                        setFieldValue('faeImagenes', [
                                          ...showingImages,
                                        ]);
                                      }
                                    } catch (error) {
                                      console.error(error);
                                    }
                                  }}
                                >
                                  <Center>
                                    <Feather
                                      name='file'
                                      size={24}
                                      color='black'
                                    />
                                    <Text fontSize='sm'>Subir Imagen</Text>
                                  </Center>
                                </Pressable>
                              </>
                            )}
                          </>
                        )}
                      </HStack>
                    </Center>
                  )}
                  <FormErrorMessage message={errors.faeImagenes} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.faeDocumento && touched.faeDocumento
                  )}
                >
                  <FormControl.Label>Número de Documento</FormControl.Label>
                  <Input
                    placeholder='N° Documento'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    // lineHeight={"xl"}
                    //variant="unstyled"
                    value={values.faeDocumento}
                    onBlur={handleBlur('faeDocumento')}
                    onChangeText={handleChange('faeDocumento')}
                    isDisabled={
                      newItem
                        ? false
                        : values.faeCreadoUsuario
                        ? false
                        : initialValues.faeDocumento != ''
                    }
                  />
                  <FormErrorMessage message={errors.faeDocumento} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.faeTelefonoMovil && touched.faeTelefonoMovil
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
                    w={'60%'}
                    // lineHeight={"xl"}
                    //variant="unstyled"
                    keyboardType='phone-pad'
                    value={values.faeTelefonoMovil}
                    onBlur={handleBlur('faeTelefonoMovil')}
                    onChangeText={handleChange('faeTelefonoMovil')}
                    isDisabled={
                      newItem
                        ? false
                        : values.faeCreadoUsuario
                        ? false
                        : initialValues.faeTelefonoMovil != ''
                    }
                  />
                  <FormErrorMessage message={errors.faeTelefonoMovil} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.faeEstudia && touched.faeEstudia)}
                >
                  <FormControl.Label>
                    ¿El familiar estudia actualmente?
                  </FormControl.Label>
                  <HStack>
                    <Text mt={5}>No{'  '}</Text>
                    <Switch
                      size='lg'
                      colorScheme='primary'
                      value={values.faeEstudia}
                      onChange={() => {
                        setEstudiaBool(!values.faeEstudia);
                        setFieldValue('faeEstudia', !values.faeEstudia);
                        setFieldValue('faeBeca', false);
                        setFieldValue('faeNivelEstudio', '');
                        setFieldValue('faeLugarEstudio', '');
                      }}
                      disabled={
                        newItem ? false : values.faeCreadoUsuario ? false : true
                      }
                    />
                    <Text mt={5}>{'  '}Si</Text>
                  </HStack>
                  <FormErrorMessage message={errors.faeEstudia} />
                </FormControl>
                {estudiaBool && (
                  <>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(errors.faeBeca && touched.faeBeca)}
                    >
                      <FormControl.Label>¿Tiene beca?</FormControl.Label>
                      <HStack>
                        <Text mt={5}>No{'  '}</Text>
                        <Switch
                          size='lg'
                          colorScheme='primary'
                          value={values.faeBeca}
                          onChange={() =>
                            setFieldValue('faeBeca', !values.faeBeca)
                          }
                          disabled={
                            newItem
                              ? false
                              : values.faeCreadoUsuario
                              ? false
                              : true
                          }
                        />
                        <Text mt={5}>{'  '}Si</Text>
                      </HStack>
                      <FormErrorMessage message={errors.faeBeca} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.faeNivelEstudio && touched.faeNivelEstudio
                      )}
                    >
                      <FormControl.Label>Nivel Estudio</FormControl.Label>
                      <Input
                        placeholder='Nivel Estudio'
                        size='md'
                        color={'gray.500'}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // lineHeight={"xl"}
                        //variant="unstyled"
                        value={values.faeNivelEstudio}
                        onBlur={handleBlur('faeNivelEstudio')}
                        onChangeText={handleChange('faeNivelEstudio')}
                        isDisabled={
                          newItem
                            ? false
                            : values.faeCreadoUsuario
                            ? false
                            : initialValues.faeNivelEstudio != ''
                        }
                      />
                      <FormErrorMessage message={errors.faeNivelEstudio} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.faeLugarEstudio && touched.faeLugarEstudio
                      )}
                    >
                      <FormControl.Label>Lugar Estudio</FormControl.Label>
                      <Input
                        placeholder='Lugar Estudio'
                        size='md'
                        color={'gray.500'}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // lineHeight={"xl"}
                        //variant="unstyled"
                        value={values.faeLugarEstudio}
                        onBlur={handleBlur('faeLugarEstudio')}
                        onChangeText={handleChange('faeLugarEstudio')}
                        isDisabled={
                          newItem
                            ? false
                            : values.faeCreadoUsuario
                            ? false
                            : initialValues.faeLugarEstudio != ''
                        }
                      />
                      <FormErrorMessage message={errors.faeLugarEstudio} />
                    </FormControl>
                  </>
                )}
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.faeDepende && touched.faeDepende)}
                >
                  <FormControl.Label>¿Depende?</FormControl.Label>
                  <HStack>
                    <Text mt={5}>No{'  '}</Text>
                    <Switch
                      size='lg'
                      colorScheme='primary'
                      value={values.faeDepende}
                      onChange={() =>
                        setFieldValue('faeDepende', !values.faeDepende)
                      }
                      disabled={
                        newItem ? false : values.faeCreadoUsuario ? false : true
                      }
                    />
                    <Text mt={5}>{'  '}Si</Text>
                  </HStack>
                  <FormErrorMessage message={errors.faeDepende} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.faeEsBenefPrestLegales &&
                      touched.faeEsBenefPrestLegales
                  )}
                >
                  <FormControl.Label>
                    ¿Es beneficiario de prestaciones legales en caso de
                    fallecimiento?
                  </FormControl.Label>
                  <HStack>
                    <Text mt={5}>No{'  '}</Text>
                    <Switch
                      size='lg'
                      colorScheme='primary'
                      value={values.faeEsBenefPrestLegales}
                      onChange={() =>
                        setFieldValue(
                          'faeEsBenefPrestLegales',
                          !values.faeEsBenefPrestLegales
                        )
                      }
                      disabled={
                        newItem ? false : values.faeCreadoUsuario ? false : true
                      }
                    />
                    <Text mt={5}>{'  '}Si</Text>
                  </HStack>
                  <FormErrorMessage message={errors.faeEsBenefPrestLegales} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.faeTrabaja && touched.faeTrabaja)}
                >
                  <FormControl.Label>
                    ¿El familiar trabaja actualmente?
                  </FormControl.Label>
                  <HStack>
                    <Text mt={5}>No{'  '}</Text>
                    <Switch
                      size='lg'
                      colorScheme='primary'
                      value={values.faeTrabaja}
                      onChange={() => {
                        setFieldValue('faeTrabaja', !values.faeTrabaja);
                        setFieldValue('faeCargo', '');
                        setFieldValue('faeLugarTrabajo', '');
                        setFieldValue('faeTelefonoTrabajo', '');
                        setFieldValue('faeSalario', 0);
                        setFieldValue('faeCodmon', '');
                      }}
                      disabled={
                        newItem ? false : values.faeCreadoUsuario ? false : true
                      }
                    />
                    <Text mt={5}>{'  '}Si</Text>
                  </HStack>

                  <FormErrorMessage message={errors.faeTrabaja} />
                </FormControl>
                {values.faeTrabaja && (
                  <>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(errors.faeCargo && touched.faeCargo)}
                    >
                      <FormControl.Label>Cargo</FormControl.Label>
                      <Input
                        placeholder='Cargo'
                        size='md'
                        color={'gray.500'}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // lineHeight={"xl"}
                        //variant="unstyled"
                        value={values.faeCargo}
                        onBlur={handleBlur('faeCargo')}
                        onChangeText={handleChange('faeCargo')}
                        isDisabled={
                          newItem
                            ? false
                            : values.faeCreadoUsuario
                            ? false
                            : initialValues.faeCargo != ''
                        }
                      />
                      <FormErrorMessage message={errors.faeCargo} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.faeLugarTrabajo && touched.faeLugarTrabajo
                      )}
                    >
                      <FormControl.Label>Lugar Trabajo</FormControl.Label>
                      <Input
                        placeholder='Lugar Trabajo'
                        size='md'
                        color={'gray.500'}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // lineHeight={"xl"}
                        //variant="unstyled"
                        value={values.faeLugarTrabajo}
                        onBlur={handleBlur('faeLugarTrabajo')}
                        onChangeText={handleChange('faeLugarTrabajo')}
                        isDisabled={
                          newItem
                            ? false
                            : values.faeCreadoUsuario
                            ? false
                            : initialValues.faeLugarTrabajo != ''
                        }
                      />
                      <FormErrorMessage message={errors.faeLugarTrabajo} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.faeTelefonoTrabajo && touched.faeTelefonoTrabajo
                      )}
                    >
                      <FormControl.Label>Teléfono de Trabajo</FormControl.Label>
                      <Input
                        placeholder='Teléfono de Trabajo'
                        size='md'
                        color={'gray.500'}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        // lineHeight={"xl"}
                        w={'50%'}
                        //variant="unstyled"
                        keyboardType='phone-pad'
                        value={values.faeTelefonoTrabajo}
                        onBlur={handleBlur('faeTelefonoTrabajo')}
                        onChangeText={handleChange('faeTelefonoTrabajo')}
                        isDisabled={
                          newItem
                            ? false
                            : values.faeCreadoUsuario
                            ? false
                            : initialValues.faeTelefonoTrabajo != ''
                        }
                      />
                      <FormErrorMessage message={errors.faeTelefonoTrabajo} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.faeSalario && touched.faeSalario
                      )}
                    >
                      <FormControl.Label>Salario</FormControl.Label>
                      <Input
                        placeholder='Salario'
                        size='md'
                        color={'gray.500'}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        keyboardType='numeric'
                        // lineHeight={"xl"}
                        w={'50%'}
                        //variant="unstyled"
                        value={values.faeSalario.toString()}
                        onBlur={handleBlur('faeSalario')}
                        onChangeText={handleChange('faeSalario')}
                        isDisabled={
                          newItem
                            ? false
                            : values.faeCreadoUsuario
                            ? false
                            : initialValues.faeSalario >= 0
                        }
                      />
                      <FormErrorMessage message={errors.faeSalario} />
                    </FormControl>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(errors.faeCodmon && touched.faeCodmon)}
                    >
                      <FormControl.Label>Moneda</FormControl.Label>
                      <Pressable
                        onPress={
                          isOpenCurrency ? onCloseCurrency : onOpenCurrency
                        }
                        borderColor='gray.300'
                        borderWidth={1}
                        borderRadius={'sm'}
                        p={3}
                        _disabled={{
                          bg: 'gray.100',
                        }}
                        isDisabled={
                          isLoadingCurrencies ||
                          (newItem
                            ? false
                            : values.faeCreadoUsuario
                            ? false
                            : initialValues.faeCodmon != '')
                        }
                      >
                        <Text
                          color={
                            isLoadingCurrencies ||
                            (newItem
                              ? false
                              : values.faeCreadoUsuario
                              ? false
                              : initialValues.faeCodmon != '')
                              ? 'gray.300'
                              : 'gray.500'
                          }
                        >
                          {values.faeCodmon !== ''
                            ? currencies.find(
                                (x) => x.value == values.faeCodmon
                              )?.label
                            : 'Seleccione una Moneda'}
                        </Text>
                      </Pressable>
                      {/* <Input
                        onPressIn={
                          isOpenCurrency ? onCloseCurrency : onOpenCurrency
                        }
                        placeholder="Seleccione una Moneda"
                        size="md"
                        color={"gray.500"}
                        _disabled={{
                          bg: "gray.100",
                        }}
                        w={"50%"}
                        // lineHeight={"xl"}
                        // //variant="unstyled"
                        value={
                          currencyName != ""
                            ? currencyName
                            : currencies.find(
                                (x) => x.value == initialValues.faeCodmon
                              )?.label
                        }
                        isDisabled={
                          isLoadingCurrencies ||
                          (newItem
                            ? false
                            : values.faeCreadoUsuario
                            ? false
                            : initialValues.faeCodmon != "")
                        }
                      /> */}
                      <SearchAbleActionSheet
                        array={currencies}
                        setFieldValue={setFieldValue}
                        field={'faeCodmon'}
                        value={values.faeCodmon}
                        isOpen={isOpenCurrency}
                        onOpen={onOpenCurrency}
                        onClose={onCloseCurrency}
                        // setNames={setCurrencyName}
                        data={'Monedas'}
                      />
                      <FormErrorMessage message={errors.faeCodmon} />
                    </FormControl>
                  </>
                )}
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.faeFallecido && touched.faeFallecido
                  )}
                >
                  <FormControl.Label>¿Fallecido?</FormControl.Label>
                  <HStack>
                    <Text mt={5}>No{'  '}</Text>
                    <Switch
                      size='lg'
                      colorScheme='primary'
                      value={values.faeFallecido}
                      onChange={() => {
                        setFieldValue('faeFallecido', !values.faeFallecido);
                        setFieldValue('faeFechaFallecido', yesterday);
                      }}
                      disabled={
                        newItem ? false : values.faeCreadoUsuario ? false : true
                      }
                    />
                    <Text mt={5}>{'  '}Si</Text>
                  </HStack>
                  {values.faeFallecido == false}
                  <FormErrorMessage message={errors.faeFallecido} />
                </FormControl>
                {values.faeFallecido && (
                  <>
                    <FormControl
                      mb={4}
                      isInvalid={Boolean(
                        errors.faeFechaFallecido && touched.faeFechaFallecido
                      )}
                    >
                      <FormControl.Label>Fecha Fallecimiento</FormControl.Label>
                      <Datepicker
                        style={styles.picker}
                        date={new Date(values.faeFechaFallecido)}
                        onSelect={(nextDate) =>
                          setFieldValue(
                            'faeFechaFallecido',
                            new Date(nextDate.toLocaleDateString())
                          )
                        }
                        size='large'
                        max={yesterday}
                        min={new Date('01/01/1900')}
                        controlStyle={
                          newItem
                            ? styles.control
                            : values.faeCreadoUsuario
                            ? styles.control
                            : styles.controlDisabled
                        }
                        status='basic'
                        disabled={
                          newItem
                            ? false
                            : values.faeCreadoUsuario
                            ? false
                            : true
                        }
                      />
                      <FormErrorMessage message={errors.faeFechaFallecido} />
                    </FormControl>
                  </>
                )}
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.faeObservacion && touched.faeObservacion
                  )}
                >
                  <FormControl.Label>Observación</FormControl.Label>
                  <Input
                    placeholder='Observación'
                    size='md'
                    // lineHeight={"xl"}
                    //variant="unstyled"
                    value={values.faeObservacion}
                    onBlur={handleBlur('faeObservacion')}
                    onChangeText={handleChange('faeObservacion')}
                  />
                  <FormErrorMessage message={errors.faeObservacion} />
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
                    : values.faeCreadoUsuario
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
                    : values.faeCreadoUsuario
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
                      : values.faeCreadoUsuario
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

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    color: 'red',
  },
  controlDisabled: {
    backgroundColor: '#F5F5F5',
  },
  control: {
    color: 'green',
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
  },
});

export default React.memo(FamiliaresCreateForm);
