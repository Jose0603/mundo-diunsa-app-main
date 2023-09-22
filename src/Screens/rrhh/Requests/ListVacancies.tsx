import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Box, Checkbox, FlatList, Heading, HStack, Image, Pressable, Text, VStack, Switch } from 'native-base';
// import { Switch } from 'react-native';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loading } from '../../../Components/Loading';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { useVacancies } from '../../../hooks/useRequest';
import { RootState } from '../../../Redux/reducers/rootReducer';
import {
  addSelected,
  addSelectedVacancy,
  removeSelectedVacancy,
  setAllVacancies,
} from '../../../Redux/reducers/rrhh/requisitionSlice';
import TopMainBar from '../../../Components/TopMainBar';

interface IProps extends DrawerScreenProps<any, any> {}

export default function ListVacancies({ navigation }: IProps) {
  const { vacancies, isLoadingVacancies } = useVacancies();

  const selectedVacancies = useSelector((root: RootState) => root.requisition.selectedVacancies);
  const dispatch = useDispatch();

  useEffect(() => {
    if (vacancies.length > 0) {
      dispatch(setAllVacancies(vacancies));
    }

    return () => {};
  }, [vacancies]);

  return (
    <Box safeAreaTop bg="#fff" flex={1}>
      {/* <HStack alignItems="center" justifyContent="space-between" ml={5} pb={2}>
        <Image
          source={require('../../../../assets/logo_app.png')}
          fallbackSource={require('../../../../assets/logo_app.png')}
          alt="Logo Diunsa"
          // size="lg"
          height={35}
          width={100}
          ml={2}
        />
        <Pressable
          flexDir="row"
          mr={3}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text>Continuar</Text>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </Pressable>
      </HStack> */}
      <TopMainBar showMenu={false} showBack={false} />
      {!isLoadingVacancies ? (
        <Box
          _web={{
            marginX: '48',
          }}
          flex={1}
        >
          <FlatList
            data={
              selectedVacancies.length > 0
                ? vacancies.filter((x) => selectedVacancies.map((e) => e.codUnidad).includes(x.codUnidad))
                : vacancies
            }
            keyExtractor={(e) => `${e.codPlaza}`}
            ListHeaderComponent={
              <Box mx={3} py={2} flexDir="row" justifyContent="space-between">
                <Heading size="md">Plazas Vacantes</Heading>
                <Pressable
                  flexDir="row"
                  mr={3}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Text>Continuar</Text>
                  <Ionicons name="arrow-forward" size={24} color="black" />
                </Pressable>
              </Box>
            }
            ListEmptyComponent={
              <Box justifyContent="center" alignItems="center">
                <Box mx={5} borderWidth={1} borderColor="coolGray.200" borderRadius="md" p={2}>
                  <Text>
                    {selectedVacancies.length > 0
                      ? 'Ya has seleccionado las plazas disponibles'
                      : 'No se encontraron plazas'}
                  </Text>
                </Box>
              </Box>
            }
            renderItem={({ item, index }) => {
              const isSelected = selectedVacancies.some((x) => item.codPlaza === x.codPlaza);
              console.log('🚀 ~ file: ListVacancies.tsx:97 ~ ListVacancies ~ isSelected:', isSelected);
              return (
                <HStack px={3} py={1} bg={index % 2 === 0 ? 'coolGray.100' : 'transparent'}>
                  <VStack w="80%">
                    <Text fontSize="xs" color="coolGray.400">
                      Plazas disponibles
                    </Text>
                    <Text fontSize="xs">{item.disponibles}</Text>
                    <Text fontSize="xs" color="coolGray.400">
                      Centro de Trabajo
                    </Text>
                    <Text fontSize="xs">{item.nombreCentroTrabajo}</Text>
                    <Text fontSize="xs" color="coolGray.400">
                      Unidad
                    </Text>
                    <Text fontSize="xs">{item.nombreUnidad}</Text>
                    {/* <Text fontSize="xs" color="coolGray.400">
                    Puesto
                  </Text>
                  <Text>{item.nombrePuesto}</Text> */}
                    <Text fontSize="xs" color="coolGray.400">
                      Plaza
                    </Text>
                    <Text fontSize="xs">{item.nombrePlaza}</Text>
                  </VStack>
                  <Box w="20%">
                    {/* <Switch
                    size="lg"
                    onChange={() => {
                      if(isSelected)
                      dispatch(addSelectedVacancy(item));
                      else
                      dispatch(removeSelectedVacancy(item));
                    }}
                    colorScheme="success"
                    value={isSelected}
                  /> */}
                    <Checkbox
                      isChecked={isSelected}
                      // defaultIsChecked={isSelected}
                      value={String(item.codPlaza)}
                      colorScheme="green"
                      onChange={() => {
                        if (isSelected) dispatch(removeSelectedVacancy(item));
                        else dispatch(addSelectedVacancy(item));
                      }}
                    />
                    {/* 
                  <Switch
                    trackColor={{ false: '#D9D9D9', true: '#526DFC1A' }}
                    thumbColor={isSelected ? '#526DFC' : '#A9A9A9'}
                    // ios_backgroundColor="#3e3e3e"
                    onValueChange={() => {
                      dispatch(addSelectedVacancy(item));
                    }}
                    value={isSelected}
                  /> */}
                  </Box>
                </HStack>
              );
            }}
          />
        </Box>
      ) : (
        <Box flex={1}>
          <Loading message="Cargando plazas..." />
        </Box>
      )}
    </Box>
  );
}
