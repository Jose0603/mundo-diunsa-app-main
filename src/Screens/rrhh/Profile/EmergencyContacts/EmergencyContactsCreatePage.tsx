import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Actionsheet, Box, Center, Row, Spinner, Text } from 'native-base';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { queryClient } from '../../../../Configs/QueryClient';
import { QueryKeys } from '../../../../Helpers/QueryKeys';
import useAlert from '../../../../hooks/useAlert';
import { useCustomToast } from '../../../../hooks/useCustomToast';
import { useUserEmergencyContact } from '../../../../hooks/useExpediente';
import { IEmeEmergencia } from '../../../../interfaces/rrhh/IExpExpediente';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import { setChange } from '../../../../Redux/reducers/rrhh/expedienteSlice';
import { SaveEmergencyContact, UpdateEmergencyContact } from '../../../../Services/rrhh/EmeEmergenciaExpediente';
import EmergencyContactsCreateForm from './EmergencyContactsCreateForm';

const EmergencyContactsCreatePage = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.login);
  const { contact, isLoadingContact } = useUserEmergencyContact(route?.params?.params?.model);
  const showToast = useCustomToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [process, setProcess] = useState(0);
  const { change } = useSelector((state: RootState) => state.expediente);
  const alert = useAlert();

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      console.log('process', process, 'change', change);

      if (!change) {
        // setProcess(0);
        // navigation.navigate("Emergencia", { screen: "Contactos" });
        return;
      }

      e.preventDefault();

      if (process != 2) {
        if (change && process == 1) {
          //change && stop
          console.log('no change 1');
          navigation.navigate('Emergencia', { screen: 'Contactos' });

          return;
        }
        setProcess(2);
      }
      if (process == 2 && change) {
        //change && !stop
        console.log('no change 0');
        setProcess(1);
        alert.show({
          onPress: () => {
            dispatch(setChange(false));
            navigation.dispatch(e.data.action);
          },
          isOpen: true,
        });
        setProcess(0);
      }
    }),
      [navigation, change];
  });

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // if (tabPress) {
  //     return () => {
  //       navigation.goBack();
  //       dispatch(setTabPress(false));
  //     };
  //     // }
  //   }, [])
  // );

  useLayoutEffect(() => {
    const blur = navigation.addListener('blur', () => {
      setProcess(1);
      navigation.popToTop();
    });
  }, []);

  const initialValues: IEmeEmergencia = {
    emeCodigo: contact?.emeCodigo ?? 0,
    emeCodexp: contact?.emeCodexp ?? 0,
    emeSecuencial: contact?.emeSecuencial ?? 0,
    emeNombre: contact?.emeNombre ?? '',
    emeCodprt: contact?.emeCodprt ?? 0,
    emeCodprtName: contact?.emeCodprtName ?? '',
    emeDireccion: contact?.emeDireccion ?? '',
    emeTelefono: contact?.emeTelefono ?? '',
    emeTrabajo: contact?.emeTrabajo ?? '',
    emeTelefonoTrabajo: contact?.emeTelefonoTrabajo ?? '',
    emePropertyBagData: contact?.emePropertyBagData ?? '',
    emeCreadoUsuario: contact?.emeCreadoUsuario ?? false,
    emeObservacion: contact?.emeObservacion ?? '',
  };

  const handleSubmit = useCallback(async (actionModel: IEmeEmergencia) => {
    console.log(
      '🚀 ~ file: EmergencyContactsCreatePage.tsx:103 ~ handleSubmit ~ actionModel',
      JSON.stringify(actionModel, null, 4)
    );
    setLoading(true);
    try {
      if (actionModel?.emeCodigo == 0) {
        dispatch(setChange(false));

        const response = await SaveEmergencyContact(actionModel, user.employeeId);
        console.log('🚀 ~ file: EmergencyContactsCreatePage.tsx:121 ~ handleSubmit ~ response', response);

        if (response.result) {
          showToast({
            title: 'Contacto creado con exito',
            status: 'success',
          });
        } else {
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: response.message,
          });
        }
        navigation.goBack();
      } else if (actionModel?.emeCodigo > 0) {
        dispatch(setChange(false));

        const response = await UpdateEmergencyContact(actionModel);
        console.log('🚀 ~ file: EmergencyContactsCreatePage.tsx:121 ~ handleSubmit ~ response', response);
        if (response.result) {
          showToast({
            title: 'Contacto actualizado con exito',
            status: 'success',
          });
        } else {
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: response.message,
          });
        }
        navigation.goBack();
      }
    } catch (exception) {
    } finally {
      dispatch(setChange(false));
      queryClient.refetchQueries([QueryKeys.EMERGENCY_CONTACTS]);
      setLoading(false);
    }
  }, []);

  return (
    <Box backgroundColor={'#fff'} mb={3} px={3} h={'100%'}>
      {loading || isLoadingContact ? (
        <Box flex={1}>
          <Row flex={1} justifyContent="center" size={'100%'}>
            <Center>
              <Spinner size={'lg'} />
              <Text color={'#0077CD'} fontSize={'2xl'}>
                {contact ? 'Actualizando...' : 'Cargando...'}
              </Text>
            </Center>
          </Row>
        </Box>
      ) : (
        <>
          <Box margin={'0'} style={styles.row} mt={5} mb={3}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="arrow-back" size={25} />
            </TouchableOpacity>
            <Text fontSize={20} flex={1} style={styles.text}>
              {initialValues.emeCodigo == 0
                ? 'Crear Contacto de Emergencia'
                : initialValues.emeCreadoUsuario == false
                ? 'Ver Contacto de Emergencia'
                : 'Editar Contacto de Emergencia'}
            </Text>
          </Box>
          <Box style={styles.body}>
            <EmergencyContactsCreateForm
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              loading={loading}
              newItem={contact ? false : true}
              navigation={navigation}
              setProcess={setProcess}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#000',
  },
  content: {
    backgroundColor: '#fff',
    margin: 0,
  },
  text: { margin: 0, textAlign: 'center' },
  row: {
    flex: 1,
    backgroundColor: '#fff',
    // borderTopWidth: 2,
    // borderColor: "#DADADA",
    flexDirection: 'row',
  },
  body: { flex: 18, flexDirection: 'row' },
});

export default EmergencyContactsCreatePage;
