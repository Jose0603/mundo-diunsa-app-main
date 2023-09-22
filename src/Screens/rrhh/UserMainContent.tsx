import { AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Box, Circle, HStack, Image, Pressable, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../../Helpers/Colors';
import { appVersion } from '../../Helpers/Constants';
import { sentenceCase } from '../../Helpers/FormatToSenteceCase';
import { QueryKeys } from '../../Helpers/QueryKeys';
import { ScreenNames } from '../../Helpers/ScreenNames';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { ICouponCount } from '../../interfaces/rrhh/IRequestFreetimeCupon';
import * as RootNavigation from '../../Navigator/RootNavigation';
import { setExtraData, setProfile } from '../../Redux/reducers/auth/profileSlice';
import { RootState } from '../../Redux/reducers/rootReducer';
import { GetCouponCount } from '../../Services/rrhh/Request';
import { GetVacationPeriods } from '../../Services/rrhh/Vacations';
import { GetExtraData, getMyPoints } from '../../Services/User';

export const UserMainContent = () => {
  const profile = useSelector((state: RootState) => state.profile);
  const user = useSelector((state: RootState) => state.auth.login);
  const isMounted = useIsMountedRef().current;
  const dispatch = useDispatch();
  const [couponDetail, setCouponDetail] = useState<ICouponCount>();
  const {
    isLoading,
    isError,
    error,
    isFetching,
    data: periods,
  } = useQuery([QueryKeys.VACATION_PERIODS, user.employeeId], () => GetVacationPeriods(user.employeeId));

  const fetchPoints = async () => {
    if (profile.points === 0) {
      try {
        const res = await getMyPoints();
        if (res.result && isMounted) {
          dispatch(setProfile(res.data.points));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchFreeTimeCoupons = async () => {
    try {
      const res = await GetCouponCount();
      if (res) setCouponDetail(res);
    } catch (error) {
    } finally {
    }
  };
  const fetchExtraData = async () => {
    try {
      const res = await GetExtraData();
      if (res.result && isMounted) {
        dispatch(setExtraData(res.data));
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    // fetchPoints();
    fetchFreeTimeCoupons();
    fetchExtraData();
  }, []);

  const ItemContainer = ({ children, navigateTo, label }: any) => {
    return (
      <Pressable
        w={'47%'}
        h={150}
        borderRadius={10}
        borderColor="#fff"
        borderWidth={1}
        mb={10}
        overflow="hidden"
        onPress={() => RootNavigation.navigate(navigateTo)}
      >
        {children}
        <Box
          justifyContent="center"
          alignItems="center"
          alignSelf="flex-end"
          backgroundColor={colors.secondary}
          h="30%"
          w="100%"
          borderRadius={10}
          position="absolute"
          bottom={0}
          left={0}
        >
          <Text color="#fff">{label}</Text>
        </Box>
      </Pressable>
    );
  };

  return (
    <ScrollView
      _contentContainerStyle={{
        alignItems: 'center',
      }}
    >
      <Box borderRadius={10} backgroundColor={colors.primary} mx={3} mb={10}>
        <HStack alignItems="center" justifyContent="space-around" px={10}>
          <Image
            size="md"
            ml={-5}
            background="#eee"
            borderRadius={10}
            alt="perfil"
            source={{ uri: user.picture }}
            fallbackSource={require('../../../assets/persona.png')}
          />
          <VStack>
            <HStack alignItems="center" pt={5} maxWidth="80%">
              <Image size="sm" source={require('../../../assets/persona.png')} alt="perfil" />
              <VStack>
                <Text color="#fff" bold fontSize={14}>
                  {user?.employeePosition ?? ''}
                </Text>
                <HStack>
                  <Text color="#fff">{sentenceCase(user.name)}</Text>
                </HStack>
              </VStack>
            </HStack>
            <HStack alignItems="center" mt={-3}>
              <Image size="sm" source={require('../../../assets/tiempo.png')} alt="cronometro" />
              <HStack alignItems="center">
                <Text color="#4BC9E3" bold fontSize={16}>
                  Puntos {profile.points}
                </Text>
                <Image size="xs" source={require('../../../assets/fuego.png')} alt="icono fuego" />
              </HStack>
            </HStack>
          </VStack>
        </HStack>
        <HStack justifyContent="space-around" px={5}>
          <Box
            my={5}
            // backgroundColor="#000"
            alignItems="flex-start"
            justifyContent="center"
          >
            <VStack alignItems="center" justifyContent="center">
              <Text color="#fff" fontSize={16}>
                Antigüedad
              </Text>
              <Text color="#4BC9E3" bold fontSize={42}>
                {profile.antiquity}
                <Text fontSize={18}>a</Text>
              </Text>
            </VStack>
          </Box>
          <Box
            px={5}
            my={5}
            // backgroundColor="#000"
            borderRightColor="#fff"
            borderRightWidth={1}
            borderLeftWidth={1}
            borderLeftColor="#fff"
            alignItems="center"
            justifyContent="center"
          >
            <VStack alignItems="center" justifyContent="center">
              <Text color="#fff" fontSize={16} mb={3} mt={-3}>
                {profile.gender === 'F' ? 'Voluntaria' : 'Voluntario'}
              </Text>
              {profile.isVolunteer ? (
                <AntDesign name="checkcircleo" size={42} color="#4BC9E3" />
              ) : (
                <AntDesign name="closecircleo" size={42} color="#4BC9E3" />
              )}
              {/* <Image size="sm" source={require('../../../assets/persona.png')} /> */}
            </VStack>
          </Box>
          <Box my={5} alignItems="center" justifyContent="center">
            <VStack alignItems="center" justifyContent="center">
              <Text color="#fff" fontSize={16}>
                {profile.gender === 'F' ? 'Colaboradora' : 'Colaborador'}
              </Text>
              <Text color="#4BC9E3" bold fontSize={42}>
                {user.employeeId}
              </Text>
            </VStack>
          </Box>
        </HStack>
        <HStack px={3} justifyContent="space-around">
          <ItemContainer navigateTo={ScreenNames.HOME_REQUESTS} label="Solicitudes">
            <Image
              h="100%"
              w="100%"
              borderRadius={10}
              source={require('../../../assets/Solicitudes.jpg')}
              alt="Solicitudes"
            />
          </ItemContainer>
          <ItemContainer navigateTo={ScreenNames.RECEIPT_OF_PAYMENT} label="Claridad de Pago">
            <Image h="100%" w="100%" borderRadius={10} source={require('../../../assets/Pagos.jpg')} alt="Pagos" />
          </ItemContainer>
        </HStack>

        <HStack px={3} justifyContent="space-around">
          <Pressable
            w={'47%'}
            h={150}
            borderRadius={10}
            borderColor="#fff"
            borderWidth={1}
            mb={10}
            overflow="hidden"
            onPress={() => RootNavigation.navigate(ScreenNames.VACATION_BALANCE)}
          >
            <Image
              h="100%"
              w="100%"
              borderRadius={10}
              source={require('../../../assets/Vacaciones.jpg')}
              alt="Vacaciones"
            />
            <Box
              justifyContent="center"
              alignItems="center"
              alignSelf="flex-end"
              backgroundColor={colors.secondary}
              h="30%"
              w="100%"
              borderRadius={10}
              position="absolute"
              bottom={0}
              left={0}
              flexDirection="row"
            >
              <Text color="#fff">Vacaciones</Text>
              <Circle w="5" h="5" bg="#eee" ml={2}>
                <Text color="#000" fontSize={10} bold>
                  {periods && periods.length && periods.length > 0
                    ? periods.map((item) => item.saldo).reduce((prev, next) => prev + next)
                    : 0}
                </Text>
              </Circle>
            </Box>
          </Pressable>
          <ItemContainer navigateTo={ScreenNames.MARKS} label="Control de Asistencia">
            <Image
              h="100%"
              w="100%"
              borderRadius={10}
              source={require('../../../assets/Asistencia.jpg')}
              alt="Asistencia"
            />
          </ItemContainer>
        </HStack>
        <HStack px={3} justifyContent="space-around">
          <ItemContainer navigateTo={ScreenNames.SURVEY} label="Evaluaciones">
            <Image
              h="100%"
              w="100%"
              borderRadius={10}
              source={require('../../../assets/Solicitudes.jpg')}
              alt="Evaluaciones"
            />
          </ItemContainer>
          {!profile.isTemporary && (
            <Pressable
              w={'47%'}
              h={150}
              borderRadius={10}
              borderColor="#fff"
              borderWidth={1}
              mb={10}
              overflow="hidden"
              onPress={() => RootNavigation.navigate(ScreenNames.FORM_REQUEST_COUPON_FREETIME)}
              // onPress={() => RootNavigation.navigate(ScreenNames.LIST_REQUESTS)}
            >
              <Image
                h="100%"
                w="100%"
                borderRadius={10}
                mt={-10}
                source={require('../../../assets/Libre.jpg')}
                alt="Tiempo libre"
              />
              <Box
                justifyContent="center"
                alignItems="center"
                alignSelf="flex-end"
                backgroundColor={colors.secondary}
                h="30%"
                w="100%"
                borderRadius={10}
                position="absolute"
                bottom={0}
                left={0}
                flexDirection="row"
              >
                <Text color="#fff">Tiempo Libre</Text>
                <Circle w="5" h="5" bg="#eee" ml={2}>
                  <Text color="#000" fontSize={10} bold>
                    {couponDetail?.saldo ?? 0}
                  </Text>
                </Circle>
              </Box>
            </Pressable>
          )}
        </HStack>
      </Box>
      <Box alignItems="flex-end" mr={5}>
        {/* <Text color='coolGray.500' italic>
          v. {Constants.manifest.version}
        </Text> */}
        {/* <Text color='coolGray.500' italic>
          v. {Constants.expoConfig.version}
        </Text> */}
        <Text color="coolGray.500" italic>
          v. {appVersion}
        </Text>
      </Box>
    </ScrollView>
  );
};
