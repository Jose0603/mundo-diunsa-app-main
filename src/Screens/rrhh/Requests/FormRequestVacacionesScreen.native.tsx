import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, NativeDateService, RangeDatepicker, Spinner, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Formik } from 'formik';
import moment from 'moment-timezone';
import { ArrowBackIcon, Box, FormControl, HStack, ScrollView, Switch, Text, useToast, View, WarningOutlineIcon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import { Loading } from '../../../Components/Loading';
import { NoData } from '../../../Components/NoData';
import TopMainBar from '../../../Components/TopMainBar';
import { localeDateService } from '../../../Helpers/LocaleDate';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { useCustomToast } from '../../../hooks/useCustomToast';
import { RangeDate } from '../../../interfaces/rrhh/IRequestConstancia';
import { IRequestVacation } from '../../../interfaces/rrhh/IRequestVacation';
import { AuthState } from '../../../Redux/reducers/auth/loginReducer';
import { GetBusinessDays, GetGeneralParam } from '../../../Services/rrhh/Request';
import { GetRemainingDays, SaveRequestVacations } from '../../../Services/rrhh/Vacations';

// moment.updateLocale('es', {
//   workingWeekdays: [1, 2, 3, 4, 5, 6],
// });

moment.locale('es');
moment.tz.setDefault('America/Tegucigalpa');

interface IProps extends NativeStackScreenProps<any, any> {}

// public static double GetBusinessDays(DateTime startD, DateTime endD)
//     {
//         double calcBusinessDays =
//             1 + ((endD - startD).TotalDays * 6 -
//             (startD.DayOfWeek - endD.DayOfWeek) * 1) / 7;

//         if (startD.DayOfWeek == DayOfWeek.Sunday) calcBusinessDays--;

//         return calcBusinessDays;
//     }
function calcBusinessDays(startDate, endDate) {
  var day = startDate;

  let start = startDate.startOf('day');
  let end = endDate.endOf('day');

  var businessDays = 1 + (endDate.diff(startDate) * 6 - (startDate.day() - endDate.day()) * 1) / 7;

  if (startDate.day() === 0) {
    businessDays--;
  }

  return businessDays;

  // while (day.isSameOrBefore(endDate, 'day')) {
  //   if (day.day() != 0 && day.day() != 6) businessDays++;
  //   day.add(1, 'd');
  // }
  // return businessDays;
}

const FormRequestVacacionesScreen = ({ navigation, route }: IProps): React.ReactElement => {
  const user: AuthState = useSelector((state: any) => state.auth.login);
  const showToast = useCustomToast();
  // const toast = useToast();
  const [remainingDays, setRemainingDays] = useState(0);
  const [requestedDays, setRequestedDays] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [range, setRange] = useState<RangeDate>();
  const [showPaidBtn, setShowPaidBtn] = useState(false);

  const mutation = useMutation(
    (values: any) => {
      return SaveRequestVacations(values);
    },
    {
      onSettled: (response: any, error: any, variables, context) => {
        if (!response.result) {
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: response.message ?? 'Ocurrio un error inesperado',
          });
        } else {
          variables.resetForm();
          setRequestedDays(0);
          showToast({
            title: `Se ha enviado la solicitud`,
            status: 'success',
            // description: data.Message ?? 'Ocurrio un error inesperado',
          });
          // navigation.goBack();
          navigation.navigate(ScreenNames.LIST_REQUESTS);
        }
      },
    }
  );

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const resShowPaidBtn = await GetGeneralParam('PermitePagoSalarioAnticipadoVac');
        if (typeof resShowPaidBtn === 'boolean') {
          setShowPaidBtn(resShowPaidBtn);
        }
        try {
          const resDays = await GetRemainingDays(user.employeeId);
          setRemainingDays(resDays);
        } catch (error) {
          console.error(error);
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: 'Error al buscar los dias de vacaciones disponibles',
          });
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (range && range.startDate && range.endDate) {
        try {
          const resDays = await GetBusinessDays(range);
          if (resDays.result) {
            setRequestedDays(resDays.data);
          } else if (!resDays.result) {
            showToast({
              title: 'Hubo un error',
              status: 'error',
              description: resDays.message,
            });
          }
        } catch (error) {
          console.error(error);
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: 'Ocurrio un error al consultar la cantidad de dias seleccionados',
          });
        }
      }
    })();
  }, [range]);

  const requestSchema = Yup.object().shape({
    range: Yup.string().required('Debe seleccionar un intervalo de tiempo').nullable(),
    // diasSolicitados: Yup.number().required('Seleccione la fecha de sus vacaciones'),
    // fechaInicio: Yup.date().default(null),
    // dates: Yup.default(null),
    paid: Yup.bool().default(false),
  });

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

  return (
    <Box safeArea height="100%" backgroundColor="#fff">
      <TopNavigation alignment="center" title="Nueva Solicitud de Vacaciones" accessoryLeft={<RenderLeftActions />} />
      {/* <TopMainBar /> */}
      {!isLoading ? (
        remainingDays > 0 ? (
          <ScrollView
            _contentContainerStyle={{
              _web: {
                marginX: '48',
              },
            }}
          >
            <Formik
              initialValues={{
                codEmp: user.employeeId,
                requestedDays: 0,
                dates: { startDate: null, endDate: null },
                paid: false,
                range: null,
              }}
              validationSchema={requestSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                values.requestedDays = requestedDays;
                mutation.mutate({ ...values, resetForm });
                setSubmitting(false);
              }}
            >
              {({ handleSubmit, isSubmitting, errors, touched, setFieldValue, values }) => {
                return (
                  <>
                    <Box mb={3} px={5}>
                      <FormControl isRequired marginY={1} isInvalid={errors.range && touched.range ? true : false}>
                        <FormControl.Label>Rango de fechas en las que desea tomar las vacaciones:</FormControl.Label>
                        <RangeDatepicker
                          range={values.dates}
                          // dateService={localeDateService}
                          min={new Date()}
                          max={new Date(new Date().setMonth(new Date().getMonth() + 12))}
                          onSelect={(nextRange) => {
                            // console.log(moment.utc(nextRange.startDate).startOf('day'));
                            // console.log(moment.utc(nextRange.endDate).endOf('day'));
                            // setRequestedDays(0);
                            if (nextRange.startDate !== null && nextRange.endDate !== null) {
                              setRange({
                                startDate: moment.utc(nextRange.startDate).startOf('day'),
                                endDate: moment.utc(nextRange.endDate).endOf('day'),
                              });
                              setFieldValue('range', 'yes');
                            }
                            setFieldValue('dates', nextRange);
                          }}
                          // filter={(d) => moment(d).weekday() !== 6}
                        />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          {errors.range}
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <HStack justifyContent="space-around" alignItems="center" mt={3} mb={5}>
                        <Text
                          bold
                          color={'gray.600'}
                          _dark={{
                            color: 'warmGray.200',
                          }}
                          fontSize="sm"
                        >
                          Dias Solicitados: {requestedDays}
                        </Text>
                        <Text
                          bold
                          color={'gray.600'}
                          _dark={{
                            color: 'warmGray.200',
                          }}
                          fontSize="sm"
                        >
                          Dias Disponibles: {remainingDays}
                        </Text>
                      </HStack>
                      {showPaidBtn && (
                        <FormControl flexDirection="row" my={5} alignItems="center">
                          <FormControl.Label>¿Pago de salario anticipado?:</FormControl.Label>
                          <Switch
                            value={values.paid}
                            isChecked={values.paid}
                            onChange={() => {
                              setFieldValue('paid', !values.paid);
                            }}
                          />
                        </FormControl>
                      )}
                      <Button
                        style={{ marginTop: 10 }}
                        onPress={() => {
                          handleSubmit();
                        }}
                        disabled={mutation.isLoading}
                        accessoryLeft={mutation.isLoading ? LoadingIndicator : undefined}
                      >
                        {mutation.isLoading ? 'Enviando Solicitud' : 'Enviar Solicitud'}
                      </Button>
                    </Box>
                  </>
                );
              }}
            </Formik>
          </ScrollView>
        ) : (
          <NoData message="No tienes dias de vacaciones disponibles" />
        )
      ) : (
        <Loading message="Buscando dias disponibles de vacaciones" />
      )}
    </Box>
  );
};

export default FormRequestVacacionesScreen;
