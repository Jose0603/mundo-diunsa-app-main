import React, { useState } from 'react';
import { Button, Modal, FormControl, Text, TextArea, useToast, Spinner, HStack, Box, Stack } from 'native-base';
import { useQuery } from 'react-query';
import { QueryKeys } from '../Helpers/QueryKeys';
import { GetBonusActivities, GetExtrasBonusActivities } from '../Services/rrhh/Gamification';
import { IBonusActivity, IExtraBonusActivity } from '../interfaces/rrhh/Gamification/IBonusActivity';
import { useWindowDimensions } from 'react-native';
import { Loading } from './Loading';
import * as RootNavigation from '../Navigator/RootNavigation';
import { ScreenNames } from '../Helpers/ScreenNames';

interface IProps {
  showModal: boolean;
  closeModal: () => void;
}

const GamificationDescriptionModal = ({ showModal, closeModal }: IProps) => {
  const { isLoading, data } = useQuery([QueryKeys.BONUS_ACTIVITIES], () => GetBonusActivities());
  const { isLoading: isLoadingExtra, data: extraData } = useQuery([QueryKeys.BONUS_ACTIVITIES_DOUBLE], () =>
    GetExtrasBonusActivities()
  );
  const { width } = useWindowDimensions();

  const renderTableHeader = (first_header: string, second_header: string) => {
    return (
      <HStack space={2} justifyContent="space-between">
        <Text bold fontSize={16}>
          {first_header}
        </Text>
        <Text bold fontSize={16}>
          {second_header}
        </Text>
      </HStack>
    );
  };

  return (
    <Modal isOpen={showModal} onClose={closeModal}>
      <Modal.Content width={width - 20}>
        <Modal.Header>
          <Box justifyContent="center" alignItems="center">
            <Text bold fontSize={18} textAlign="center">
              Acumularás puntos al realizar estas actividades
            </Text>
          </Box>
        </Modal.Header>
        <Modal.Body>
          <Box px={2}>
            {!isLoading ? (
              <Stack>
                {renderTableHeader('Actividad', 'Puntos')}
                {data &&
                  data.data &&
                  data.data.map((item: IBonusActivity) => {
                    if (item.status) {
                      return (
                        <HStack key={item.id} space={2} px={3} justifyContent="space-between">
                          <Text>{item.name}</Text>
                          <Text>{item.points}</Text>
                        </HStack>
                      );
                    }
                    return null;
                  })}
              </Stack>
            ) : (
              <Loading message="Cargando detalle de actividades..." />
            )}
            {!isLoadingExtra ? (
              <Stack>
                {renderTableHeader('Extras', 'Multiplicador')}
                {extraData &&
                  extraData.data &&
                  extraData.data.map((item: IExtraBonusActivity) => {
                    if (item.status) {
                      return (
                        <HStack key={item.id} space={2} px={3} justifyContent="space-between">
                          <Text>{item.name}</Text>
                          <Text>x{item.multiplier}</Text>
                        </HStack>
                      );
                    }
                    return null;
                  })}
              </Stack>
            ) : (
              <Loading message="Cargando detalle de actividades..." />
            )}
            <Text fontSize={12} textAlign="center" pt={4} pb={2} color="warmGray.500">
              Al tener los puntos suficientes, podrás canjearlos por productos en{' '}
              <Text
                color="blue.500"
                onPress={() => {
                  RootNavigation.navigate(ScreenNames.VIRTUAL_STORE);
                }}
              >
                Nuestra tienda virtual
              </Text>
            </Text>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Box justifyContent="center" alignItems="center">
            <Button
              variant="solid"
              colorScheme="green"
              onPress={() => {
                closeModal();
              }}
            >
              Entendido
            </Button>
          </Box>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default GamificationDescriptionModal;
