import { Formik, FormikProps } from 'formik';
import { Box, Button, Center, FormControl, Input, Row, Spinner, Text, View } from 'native-base';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import ButtonSoup from '../../../../Components/ButtonSoup';
import { FormErrorMessage } from '../../../../Components/FormErrorMessage';
import { queryClient } from '../../../../Configs/QueryClient';
import { QueryKeys } from '../../../../Helpers/QueryKeys';
import { useCustomToast } from '../../../../hooks/useCustomToast';
import useIncidents from '../../../../hooks/useIncidents';
import { IAdditional } from '../../../../interfaces/rrhh/IExpExpediente';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import { UpdateAdditionalData } from '../../../../Services/rrhh/ExpExpediente';

const religion = [
  { label: 'Adventista', value: 'Adventismo' },
  { label: 'Catolicismo', value: 'Catolicismo' },
  { label: 'Protestantismo', value: 'Protestantismo' },
  { label: 'Judaísmo', value: 'Judaismo' },
  { label: 'Testigos de Jehová', value: 'Testigo de jehová' },
  { label: 'Islamismo', value: 'Islamismo' },
  {
    label: 'Santos de los Últimos Días',
    value: 'Santos de los últimos días',
  },
  { label: 'Otra', value: 'Otra' },
  { label: 'Ninguna', value: 'Ninguna' },
];

const bloodType = ['  O-  ', ' O+  ', '  A-  ', ' A+  ', '  B-  ', ' B+  ', ' AB- ', 'AB+'];
const bloodTypeList = bloodType.map((value) => ({ value, label: value }));

const ShirtSize = ['XXXS', ' XXS ', '  XS  ', '   S   ', '   M   ', '   L   ', '  XL  ', ' XXL ', 'XXXL'];
const ShirtSizeList = ShirtSize.map((value) => ({ value, label: value }));

const transportTypeList = [
  { label: 'Vehiculo Propio', value: 'VehiculoPropio' },
  { label: 'Motocicleta', value: 'Motocicleta' },
  { label: 'Taxi', value: 'Taxi' },
  { label: 'Bus', value: 'Bus' },
  { label: 'Vehiculo Familiar - Motocicleta', value: 'VehiculoFamiliar-motocicleta' },
  { label: 'Vehiculo Familiar - Automóvil', value: 'VehiculoFamiliar-automovil' },
  // { label: 'Otro', value: 'Otro' },
];
const AdditionalData = (): React.ReactElement => {
  const user = useSelector((state: RootState) => state.auth.login);
  const {
    ExpedienteExtraData: { data: extraData },
  } = useIncidents();
  // const { extraData, isLoadingExtraData } = useExpedienteExtraData(
  //   user.employeeId
  // );
  // var listData: IAdditional = isLoadingExtraData ? null : extraData;
  const [loading, setLoading] = useState(false);
  const showToast = useCustomToast();

  var change = false;

  const handleSubmit = useCallback(async (actionModel: IAdditional) => {
    setLoading(true);

    try {
      if (actionModel?.codigo != null) {
        const response = await UpdateAdditionalData(actionModel);
        if (response.result) {
          queryClient.refetchQueries([QueryKeys.EXTRADATA]);
          showToast({
            title: 'Datos actualizado con exito',
            status: 'success',
          });
        } else {
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: response.message,
          });
        }
      }
    } catch (exception) {
    } finally {
      setLoading(false);
    }
  }, []);

  const validationSchema: Yup.SchemaOf<IAdditional> = Yup.object({
    codigo: Yup.string().notRequired(),
    tipoSangre: Yup.string().required('Tipo de sangre es requerido'),
    tipoTransporte: Yup.string().required('Tipo de transporte es requerido'),
    peso: Yup.number().typeError('Ingrese solo números').required(`Peso es requerido`),
    altura: Yup.number().typeError('Ingrese solo números').required(`Altura es requerido`),
    religion: Yup.string().required('Religión es requerido'),
    talla: Yup.string().required('Talla es requerido'),
    extension: Yup.string().matches(/^\d+$/, 'Ingrese solo números'),
  });

  const initialValues: IAdditional = {
    codigo: user.employeeId,
    tipoSangre: extraData?.tipoSangre ?? '',
    tipoTransporte: extraData?.tipoTransporte ?? '',
    peso: isNaN(extraData?.peso ?? 0) ? 0 : Number(extraData?.peso),
    altura: isNaN(extraData?.altura ?? 0) ? 0 : Number(extraData?.altura),
    religion: extraData?.religion ?? '',
    talla: extraData?.talla ?? '',
    extension: extraData?.extension ?? '',
  };

  const getFormData = (values) => {
    if (JSON.stringify(values) !== JSON.stringify(initialValues)) {
      change = true;
    } else {
      change = false;
    }
  };

  return (
    <View bgColor={'white'} h={'100%'}>
      <Formik
        flex={1}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(model: IAdditional) => {
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
        }: FormikProps<IAdditional>) => {
          getFormData(values);
          return (
            <Box mb={3} px={3}>
              <ScrollView>
                <Box mb={3}>
                  <FormControl.Label
                    mt={4}
                    _text={{
                      color: '#0077CD',
                      fontSize: 'xl',
                    }}
                  >
                    Adicional
                  </FormControl.Label>
                  <FormControl mb={4} isInvalid={Boolean(errors.tipoSangre && touched.tipoSangre)}>
                    <FormControl.Label>Tipo de Sangre</FormControl.Label>

                    <ButtonSoup
                      array={bloodTypeList}
                      setfieldValue={setFieldValue}
                      field={'tipoSangre'}
                      value={values.tipoSangre}
                      isnew={true}
                    />
                    <Center>
                      <Text
                        fontSize="sm"
                        color="red.500"
                        _dark={{
                          color: 'red.500',
                        }}
                      >
                        * Asegure de seleccionar el tipo de sangre correcto *
                      </Text>
                    </Center>
                    <FormErrorMessage message={errors.tipoSangre} />
                  </FormControl>
                  <FormControl flexDirection={'row'} w={'full'}>
                    <Box flex={1} m={1}>
                      <FormControl mb={4} isInvalid={Boolean(errors.peso && touched.peso)}>
                        <FormControl.Label>Peso</FormControl.Label>
                        <Input
                          placeholder="Peso"
                          size="md"
                          selection={{
                            start: `${values.peso} lb`.length - 3,
                            end: `${values.peso} lb`.length - 3,
                          }}
                          keyboardType="numeric"
                          // lineHeight={"xl"}
                          //variant="unstyled"
                          value={`${values.peso} lb`}
                          onBlur={handleBlur('peso')}
                          // onChangeText={handleChange("peso")}
                          onChangeText={(itemValue: string) => {
                            var data = itemValue.split(' ');
                            setFieldValue('peso', data[0]);
                          }}
                          // isDisabled={isLoadingExpediente}
                        />
                        <FormErrorMessage message={errors.peso} />
                      </FormControl>
                    </Box>
                    <Box flex={1} m={1}>
                      <FormControl mb={4} isInvalid={Boolean(errors.altura && touched.altura)}>
                        <FormControl.Label>Altura</FormControl.Label>

                        <Input
                          placeholder="Altura"
                          size="md"
                          selection={{
                            start: `${values.altura} m`.length - 2,
                            end: `${values.altura} m`.length - 2,
                          }}
                          keyboardType="numeric"
                          // lineHeight={"xl"}
                          //variant="unstyled"
                          value={`${values.altura} m`}
                          onBlur={handleBlur('altura')}
                          // onChangeText={handleChange("altura")}
                          onChangeText={(itemValue: string) => {
                            var data = itemValue.split(' ');
                            setFieldValue('altura', data[0]);
                          }}
                          // isDisabled={isLoadingExpediente}
                        />
                        <FormErrorMessage message={errors.altura} />
                      </FormControl>
                    </Box>
                  </FormControl>
                  <FormControl mb={4} isInvalid={Boolean(errors.talla && touched.talla)}>
                    <FormControl.Label>Talla de Camisa</FormControl.Label>
                    <ButtonSoup
                      array={ShirtSizeList}
                      setfieldValue={setFieldValue}
                      field={'talla'}
                      value={values.talla}
                      isnew={true}
                    />
                    <FormErrorMessage message={errors.talla} />
                  </FormControl>
                  <FormControl mb={4} isInvalid={Boolean(errors.extension && touched.extension)}>
                    <FormControl.Label>Extensión de Télefono</FormControl.Label>
                    <Input
                      placeholder="Extensión de Télefono"
                      size="md"
                      // lineHeight={"xl"}
                      keyboardType="numeric"
                      //variant="unstyled"
                      value={values.extension}
                      onBlur={handleBlur('extension')}
                      onChangeText={handleChange('extension')}
                      // isDisabled={isLoadingExpediente}
                    />
                    <FormErrorMessage message={errors.extension} />
                  </FormControl>
                  <FormControl mb={4} isInvalid={Boolean(errors.religion && touched.religion)}>
                    <FormControl.Label>Religión</FormControl.Label>
                    <ButtonSoup
                      array={religion}
                      setfieldValue={setFieldValue}
                      field={'religion'}
                      value={values.religion}
                      isnew={true}
                      sizeCols={3}
                    />
                    <FormErrorMessage message={errors.religion} />
                  </FormControl>
                  <FormControl mb={4} isInvalid={Boolean(errors.tipoTransporte && touched.tipoTransporte)}>
                    <FormControl.Label>Tipo de Transporte</FormControl.Label>
                    <ButtonSoup
                      array={transportTypeList}
                      setfieldValue={setFieldValue}
                      field={'tipoTransporte'}
                      value={values.tipoTransporte}
                      isnew={true}
                    />
                    <FormErrorMessage message={errors.talla} />
                  </FormControl>
                </Box>
                {change && (
                  <Center>
                    <Button
                      w={'40%'}
                      disabled={loading}
                      onPress={() => {
                        // console.log('Formik Errors: ', errors);
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
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 70,
                  position: "absolute",
                  bottom: "3%",
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

export default AdditionalData;
