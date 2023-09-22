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
  useDisclose,
  View,
  WarningOutlineIcon,
} from 'native-base';
import { ScrollView } from 'react-native';
import useIncidents from '../../../../hooks/useIncidents';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import { ExpedienteService } from '../../../../Services/rrhh/ExpExpediente';
import { IEmeEmergencia } from '../../../../interfaces/rrhh/IExpExpediente';
import { useParentescos } from '../../../../hooks/useExpediente';
import { FormErrorMessage } from '../../../../Components/FormErrorMessage';
import SearchAbleActionSheet from '../SearchAbleActionSheet';
import { setChange } from '../../../../Redux/reducers/rrhh/expedienteSlice';

interface FormProps {
  initialValues: IEmeEmergencia;
  loading: boolean;
  handleSubmit: (model: IEmeEmergencia) => any; // accion submit (create/update)
  newItem: boolean;
  navigation: any;
  setProcess: (value: number) => void;
}

const EmergencyContactsCreateForm = ({
  initialValues,
  loading,
  handleSubmit,
  newItem,
  navigation,
  setProcess,
}: FormProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { parentescos, isLoadingParentescos } = useParentescos();
  const [parentescoName, setParentescoName] = useState('');
  var change = false;

  const [formData, setFormData] = useState<IEmeEmergencia>(initialValues);
  const { isOpen, onOpen, onClose } = useDisclose();

  const getFormData = (values) => {
    if (JSON.stringify(values) !== JSON.stringify(formData)) {
      change = true;
      dispatch(setChange(change));
    } /*if (JSON.stringify(values) === JSON.stringify(formData))*/ else {
      change = false;
      dispatch(setChange(change));
    }
    console.log(
      '🚀 ~ file: EmergencyContactsCreateForm.tsx:59 ~ getFormData ~ change',
      change
    );
  };

  const validationSchema: Yup.SchemaOf<IEmeEmergencia> = Yup.object({
    emeCodigo: Yup.number().required(),
    emeCodexp: Yup.number().notRequired(),
    emeSecuencial: Yup.number().notRequired(),
    emeNombre: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(50, 'Ingrese máximo 50 caracteres.')
      .required('Nombre requerido.'),
    emeCodprt: Yup.number()
      .min(1, 'Seleccione un parentesco.')
      .required('Seleccione un parentesco.'),
    emeCodprtName: Yup.string().notRequired(),
    emeDireccion: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(100, 'Ingrese máximo 100 caracteres.')
      .required('Dirección requerido.'),
    emeTelefono: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(25, 'Ingrese máximo 25 caracteres.')
      .matches(
        /^([0-9]{4})-?([0-9]{4})$/,
        'Teléfono debe tener el formato 1234-5678 o 12345678'
      )
      .required('Teléfono requerido.'),
    emeTrabajo: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(90, 'Ingrese máximo 90 caracteres.')
      .required('Lugar de Trabajo requerido.'),
    emeTelefonoTrabajo: Yup.string()
      .min(1, 'Ingrese mínimo 1 caracteres.')
      .max(25, 'Ingrese máximo 25 caracteres.')
      .matches(
        /^([0-9]{4})-?([0-9]{4})$/,
        'Teléfono debe tener el formato 1234-5678 o 12345678'
      )
      .optional(),
    emePropertyBagData: Yup.string().notRequired(),
    emeCreadoUsuario: Yup.boolean().notRequired(),
    emeObservacion: Yup.string()
      .max(4000, 'Ingrese máximo 4000 caracteres.')
      .optional(),
  });

  return (
    <ScrollView>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(model: IEmeEmergencia) => {
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
        }: FormikProps<IEmeEmergencia>) => {
          getFormData(values);
          return (
            <Box mb={3} px={3}>
              <Box mb={3}>
                <FormControl.Label>
                  Código: {values.emeCodigo ? values.emeCodigo : 'Nuevo'}
                </FormControl.Label>

                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.emeNombre && touched.emeNombre)}
                >
                  <FormControl.Label>Nombre</FormControl.Label>
                  <Input
                    placeholder='Nombre'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    //// lineHeight={"xl"}
                    //variant="unstyled"
                    value={values.emeNombre}
                    onBlur={handleBlur('emeNombre')}
                    onChangeText={handleChange('emeNombre')}
                    isDisabled={
                      newItem
                        ? false
                        : values.emeCreadoUsuario
                        ? false
                        : initialValues.emeNombre != ''
                    }
                  />
                  <FormErrorMessage message={errors.emeNombre} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.emeCodprt && touched.emeCodprt)}
                >
                  <FormControl.Label>Parentesco</FormControl.Label>
                  <Pressable
                    onPress={isOpen ? onClose : onOpen}
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
                        : values.emeCreadoUsuario
                        ? false
                        : initialValues.emeCodprt > 0)
                    }
                  >
                    <Text
                      color={
                        isLoadingParentescos ||
                        (newItem
                          ? false
                          : values.emeCreadoUsuario
                          ? false
                          : initialValues.emeCodprt > 0)
                          ? 'gray.300'
                          : 'gray.500'
                      }
                    >
                      {values.emeCodprt > 0
                        ? parentescos.find((x) => x.value == values.emeCodprt)
                            ?.label
                        : 'Seleccione un Parentesco'}
                      {/* {parentescoName == ""
                        ? "Seleccione un Parentesco"
                        : parentescoName != ""
                        ? parentescoName
                        : parentescos.find(
                            (x) => x.value == initialValues.emeCodprt
                          )?.label} */}
                    </Text>
                  </Pressable>
                  {/* <Input
                    onPressIn={isOpen ? onClose : onOpen}
                    placeholder="Seleccione un Parentesco"
                    size="md"
                    color={"gray.500"}
                    _disabled={{
                      bg: "gray.100",
                    }}
                    // lineHeight={"xl"}
                    // variant="unstyled"
                    value={
                      parentescoName != ""
                        ? parentescoName
                        : parentescos.find(
                            (x) => x.value == initialValues.emeCodprt
                          )?.label
                    }
                    isDisabled={
                      isLoadingParentescos ||
                      (newItem
                        ? false
                        : values.emeCreadoUsuario
                        ? false
                        : initialValues.emeCodprt > 0)
                    }
                  /> */}
                  <SearchAbleActionSheet
                    array={parentescos}
                    setFieldValue={setFieldValue}
                    field={'emeCodprt'}
                    value={values.emeCodprt}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                    // setNames={setParentescoName}
                    data={'Parentescos'}
                  />
                  <FormErrorMessage message={errors.emeCodprt} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.emeDireccion && touched.emeDireccion
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
                    //// lineHeight={"xl"}
                    //variant="unstyled"
                    value={values.emeDireccion}
                    onBlur={handleBlur('emeDireccion')}
                    onChangeText={handleChange('emeDireccion')}
                    isDisabled={
                      newItem
                        ? false
                        : values.emeCreadoUsuario
                        ? false
                        : initialValues.emeDireccion != ''
                    }
                  />
                  <FormErrorMessage message={errors.emeDireccion} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(errors.emeTelefono && touched.emeTelefono)}
                >
                  <FormControl.Label>Teléfono</FormControl.Label>
                  <Input
                    placeholder='Teléfono'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    w={'50%'}
                    //// lineHeight={"xl"}
                    keyboardType='phone-pad'
                    //variant="unstyled"
                    value={values.emeTelefono}
                    onBlur={handleBlur('emeTelefono')}
                    onChangeText={handleChange('emeTelefono')}
                    isDisabled={
                      newItem
                        ? false
                        : values.emeCreadoUsuario
                        ? false
                        : initialValues.emeTelefono != ''
                    }
                  />
                  <FormErrorMessage message={errors.emeTelefono} />
                </FormControl>
                <FormControl
                  isInvalid={Boolean(errors.emeTrabajo && touched.emeTrabajo)}
                  mb={4}
                >
                  <FormControl.Label>Lugar de Trabajo</FormControl.Label>
                  <Input
                    placeholder='Lugar de Trabajo'
                    size='md'
                    color={'gray.500'}
                    _disabled={{
                      bg: 'gray.100',
                    }}
                    //// lineHeight={"xl"}
                    //variant="unstyled"
                    value={values.emeTrabajo}
                    onBlur={handleBlur('emeTrabajo')}
                    onChangeText={handleChange('emeTrabajo')}
                    isDisabled={
                      newItem
                        ? false
                        : values.emeCreadoUsuario
                        ? false
                        : initialValues.emeTrabajo != ''
                    }
                  />
                  <FormErrorMessage message={errors.emeTrabajo} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.emeTelefonoTrabajo && touched.emeTelefonoTrabajo
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
                    w={'50%'}
                    //// lineHeight={"xl"}
                    //variant="unstyled"
                    keyboardType='phone-pad'
                    value={values.emeTelefonoTrabajo}
                    onBlur={handleBlur('emeTelefonoTrabajo')}
                    onChangeText={handleChange('emeTelefonoTrabajo')}
                    isDisabled={
                      newItem
                        ? false
                        : values.emeCreadoUsuario
                        ? false
                        : initialValues.emeTelefonoTrabajo != ''
                    }
                  />
                  <FormErrorMessage message={errors.emeTelefonoTrabajo} />
                </FormControl>
                <FormControl
                  mb={4}
                  isInvalid={Boolean(
                    errors.emeObservacion && touched.emeObservacion
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
                    //// lineHeight={"xl"}
                    //variant="unstyled"
                    value={values.emeObservacion}
                    onBlur={handleBlur('emeObservacion')}
                    onChangeText={handleChange('emeObservacion')}
                  />
                  <FormErrorMessage message={errors.emeObservacion} />
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
                    : values.emeCreadoUsuario
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
                    : values.emeCreadoUsuario
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
                      : values.emeCreadoUsuario
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

export default EmergencyContactsCreateForm;
