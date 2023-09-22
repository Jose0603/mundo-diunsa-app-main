import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Box, Checkbox, FlatList, Heading, HStack, Image, Pressable, Switch, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Loading } from '../../../Components/Loading';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { useSubordinates } from '../../../hooks/useRequest';
import { RootState } from '../../../Redux/reducers/rootReducer';
import { addSelected, removeSelected } from '../../../Redux/reducers/rrhh/requisitionSlice';
import { SearchBar } from '../../../Components/SearchBar';
import TopMainBar from '../../../Components/TopMainBar';

interface IProps extends DrawerScreenProps<any, any> {}

export default function ListActiveEmployees({ navigation }: IProps) {
  const { subordinates, isLoadingSubordinates } = useSubordinates();
  const requisition = useSelector((root: RootState) => root.requisition);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = subordinates.filter((item) => item.nombre.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box safeArea bg="#fff" flex={1} height="100%" margin={1}>
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
            navigation.navigate(ScreenNames.REQUISITION_SUBSTITUTION);
          }}
        >
          <Text>Continuar</Text>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </Pressable>
      </HStack> */}
      <TopMainBar showMenu={false} showBack={false} />
      {!isLoadingSubordinates ? (
        <Box
          _web={{
            marginX: '48',
          }}
          flex={1}
        >
          <Box px="5">
            <SearchBar handleChange={(query) => setSearchQuery(query)} handleSearch={() => {}} value={searchQuery} />
          </Box>
          <FlatList
            data={filteredData}
            ListHeaderComponent={
              <Box mx={3} py={2} flexDir="row" justifyContent="space-between">
                <Heading size="md">Colaboradores Activos</Heading>
                <Pressable
                  flexDir="row"
                  mr={3}
                  onPress={() => {
                    navigation.navigate(ScreenNames.REQUISITION_SUBSTITUTION);
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
                  <Text>No se encontraron colaboradores activos</Text>
                </Box>
              </Box>
            }
            renderItem={({ item, index }) => {
              const isSelected = requisition.selectedPositions.some(
                (x) => item.codigoAlternativo === x.codigoAlternativo
              );
              return (
                <HStack px={3} py={1} bg={index % 2 === 0 ? 'coolGray.100' : 'transparent'}>
                  <VStack w="80%">
                    <Text fontSize="xs" color="coolGray.400">
                      Colaborador
                    </Text>
                    <Text>
                      {item.codigoAlternativo} - {item.nombre}
                    </Text>
                    <Text fontSize="xs" color="coolGray.400">
                      Centro de Trabajo
                    </Text>
                    <Text>{item.nombreCentroTrabajo}</Text>
                    <Text fontSize="xs" color="coolGray.400">
                      Unidad
                    </Text>
                    <Text>{item.nombreUnidad}</Text>
                    <Text fontSize="xs" color="coolGray.400">
                      Puesto
                    </Text>
                    <Text>{item.nombrePuesto}</Text>
                    <Text fontSize="xs" color="coolGray.400">
                      Plaza
                    </Text>
                    <Text>{item.nombrePlaza}</Text>
                  </VStack>
                  <Box w="20%">
                    {/* <Switch
                      size="lg"
                      onChange={() => {
                        dispatch(addSelected(item));
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
                        if (isSelected) dispatch(removeSelected(item));
                        else dispatch(addSelected(item));
                      }}
                    />
                  </Box>
                </HStack>
              );
            }}
          />
        </Box>
      ) : (
        <Box flex={1}>
          <Loading message="Cargando colaboradores..." />
        </Box>
      )}
    </Box>
  );
}
