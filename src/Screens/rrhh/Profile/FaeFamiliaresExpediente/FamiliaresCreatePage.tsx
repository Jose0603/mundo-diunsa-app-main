import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Actionsheet,
  Box,
  Button,
  Center,
  Modal,
  Row,
  Spinner,
  Text,
} from 'native-base';
import { IFaeFamiliares } from '../../../../interfaces/rrhh/IExpExpediente';
import { queryClient } from '../../../../Configs/QueryClient';
import { QueryKeys } from '../../../../Helpers/QueryKeys';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import FamiliaresCreateForm from './FamiliaresCreateForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import {
  SaveFamily,
  UpdateFamily,
} from '../../../../Services/rrhh/FaeFamiliaresExpediente';
import { useCustomToast } from '../../../../hooks/useCustomToast';
import { useUserFam } from '../../../../hooks/useExpediente';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import useAlert from '../../../../hooks/useAlert';
import { setChange } from '../../../../Redux/reducers/rrhh/expedienteSlice';

const FamiliaresCreatePage = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { family, isLoadingFamily } = useUserFam(route?.params?.params?.model);
  const user = useSelector((state: RootState) => state.auth.login);
  const showToast = useCustomToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [goBack, setGoBack] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [process, setProcess] = useState(0);
  const { change } = useSelector((state: RootState) => state.expediente);
  const alert = useAlert();

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      // console.log(
      //   "🚀 ~ file: FamiliaresCreatePage.tsx:50 ~ navigation.addListener ~ change",
      //   change
      // );
      // if (!change) {
      //   return;
      // }
      // e.preventDefault();

      // alert.show({
      //   onPress: () => {
      //     dispatch(setChange(false));
      //     navigation.dispatch(e.data.action);
      //   },
      //   isOpen: true,
      // });

      if (!change) {
        return;
      }

      e.preventDefault();

      if (process != 2) {
        if (change && process == 1) {
          //change && stop
          console.log('no change 1');
          navigation.navigate('Familiares', { screen: 'Fams' });

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
  //     return () => {
  //       navigation.goBack();
  //     };
  //   }, [goBack])
  // );

  useLayoutEffect(() => {
    const blur = navigation.addListener('blur', () => {
      setProcess(1);
      navigation.popToTop();
    });
  }, []);

  // const warningMessage = (e: any) => {
  //   return (
  //     <Modal isOpen={modalVisible} w={"full"}>
  //       <Modal.Content maxWidth="400px">
  //         <Modal.Body>
  //           <Modal.CloseButton
  //             onPress={() => {
  //               setModalVisible(false);
  //             }}
  //           />
  //           <Center>
  //             <Entypo name="warning" size={40} color="#0077CD" />
  //             <Text fontSize={18}>¿Desea salir sin guardar?{"\n"}</Text>
  //             <Text fontSize={14}>Se perderan todos sus cambios.</Text>
  //           </Center>
  //         </Modal.Body>
  //         <Modal.Footer borderTopWidth={0}>
  //           <Button.Group
  //             flex={1}
  //             justifyContent={"space-between"}
  //             flexDirection={"row"}
  //             mx={5}
  //           >
  //             <Button
  //               minW={"40%"}
  //               borderColor={"#0077CD"}
  //               borderRadius={"full"}
  //               variant={"outline"}
  //               onPress={() => {
  //                 navigation.goBack();
  //                 setModalVisible(false);
  //               }}
  //             >
  //               <Text color={"#0077CD"} fontSize={15}>
  //                 Aceptar
  //               </Text>
  //             </Button>
  //             <Button
  //               minW={"40%"}
  //               borderRadius={"full"}
  //               onPress={() => {
  //                 setModalVisible(false);
  //               }}
  //             >
  //               <Text color={"white"} fontSize={15}>
  //                 Cancelar
  //               </Text>
  //             </Button>
  //           </Button.Group>
  //         </Modal.Footer>
  //       </Modal.Content>
  //     </Modal>
  //   );
  // };

  const initialValues: IFaeFamiliares = {
    faeCodigo: family?.faeCodigo ?? 0,
    faeCodexp: family?.faeCodexp ?? 0,
    faeNombre: family?.faeNombre ?? '',
    faeCodprt: family?.faeCodprt ?? 0,
    faeCodprtName: family?.faeCodprtName ?? '',
    faeCodpaiNacionalidad: family?.faeCodpaiNacionalidad ?? '',
    faePais: family?.faePais ?? '',
    faeFechaNac: family?.faeFechaNac ?? new Date().toString(),
    faeSexo: family?.faeSexo ?? '',
    faeEstadoCivil: family?.faeEstadoCivil ?? '',
    faeOcupacion: family?.faeOcupacion ?? '',
    faeCodtdo: family?.faeCodtdo ?? 0,
    faeDocumento: family?.faeDocumento ?? '',
    faeTelefonoMovil: family?.faeTelefonoMovil ?? '',
    faeEstudia: family?.faeEstudia ?? false,
    faeBeca: family?.faeBeca ?? false,
    faeNivelEstudio: family?.faeNivelEstudio ?? '',
    faeLugarEstudio: family?.faeLugarEstudio ?? '',
    faeDepende: family?.faeDepende ?? false,
    faeEsBenefPrestLegales: family?.faeEsBenefPrestLegales ?? false,
    faeTrabaja: family?.faeTrabaja ?? false,
    faeCargo: family?.faeCargo ?? '',
    faeLugarTrabajo: family?.faeLugarTrabajo ?? '',
    faeTelefonoTrabajo: family?.faeTelefonoTrabajo ?? '',
    faeSalario: family?.faeSalario ?? 0,
    faeCodmon: family?.faeCodmon ?? '',
    faeFallecido: family?.faeFallecido ?? false,
    faeFechaFallecido: family?.faeFechaFallecido ?? new Date().toString(),
    faePropertyBagData: family?.faePropertyBagData ?? '',
    faeCreadoUsuario: family?.faeCreadoUsuario ?? true,
    faeObservacion: family?.faeObservacion ?? '',
    faeImagenes: family?.faeImagenes ?? [],
  };

  const handleSubmit = useCallback(async (actionModel: IFaeFamiliares) => {
    setLoading(true);
    try {
      if (actionModel?.faeCodigo == 0) {
        dispatch(setChange(false));
        if (!actionModel.faeFallecido) {
          actionModel.faeFechaFallecido = null;
        }
        if (actionModel.faeSalario <= 0) {
          actionModel.faeCodmon = null;
        }
        // if (actionModel.faeImagenes.length > 0) {
        //   for (var i = actionModel.faeImagenes.length - 1; i >= 0; i--) {
        //     actionModel.faeImagenes[i] = actionModel.faeImagenes[i]
        //       .split(".")
        //       .shift();
        //   }
        // }
        const response = await SaveFamily(actionModel, user.employeeId);
        console.log(response);
        if (response.result) {
          showToast({
            title: 'Familiar guardado con exito',
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
      } else if (actionModel?.faeCodigo > 0) {
        dispatch(setChange(false));
        if (!actionModel.faeFallecido) {
          actionModel.faeFechaFallecido = null;
        }
        if (actionModel.faeSalario <= 0) {
          actionModel.faeCodmon = null;
        }
        const response = await UpdateFamily(actionModel);
        if (response.result) {
          showToast({
            title: 'Familiar actualizado con exito',
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
      queryClient.refetchQueries([QueryKeys.FAMILIES]);
      setLoading(false);
    }
  }, []);

  return (
    <Box backgroundColor={'#fff'} mb={3} px={3} h={'100%'}>
      {/* {modalVisible && warningMessage} */}
      {loading || isLoadingFamily ? (
        <Box flex={1}>
          <Row flex={1} justifyContent='center' size={'100%'}>
            <Center>
              <Spinner size={'lg'} />
              <Text color={'#0077CD'} fontSize={'2xl'}>
                {family ? 'Actualizando...' : 'Cargando...'}
              </Text>
            </Center>
          </Row>
        </Box>
      ) : (
        <>
          <Box margin={'0'} style={styles.row} mt={5} mb={3}>
            <TouchableOpacity
              onPress={() => {
                // setGoBack(true);
                navigation.goBack();
                // setGoBack(true); /*navigation.goBack()*/
              }}
            >
              <Ionicons name='arrow-back' size={25} />
            </TouchableOpacity>
            <Text fontSize={20} flex={1} style={styles.text}>
              {initialValues.faeCodigo == 0
                ? 'Agregar Familiar'
                : initialValues.faeCreadoUsuario == false
                ? 'Ver Familiar'
                : 'Editar Familiar'}
            </Text>
          </Box>
          <Box style={styles.body}>
            <FamiliaresCreateForm
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              loading={loading}
              newItem={family ? false : true}
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

export default FamiliaresCreatePage;
