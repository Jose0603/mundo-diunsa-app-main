import React, { useState } from 'react';
import {
  Button,
  Modal,
  FormControl,
  Text,
  TextArea,
  useToast,
  Spinner,
  HStack,
  Box,
  Stack,
  Divider,
  Badge,
} from 'native-base';
import { useWindowDimensions } from 'react-native';
import { Loading } from './Loading';
import * as RootNavigation from '../Navigator/RootNavigation';
import { ScreenNames } from '../Helpers/ScreenNames';
import { IExchangeDetail, IExchangeHeader } from '../interfaces/rrhh/Gamification/IProductExchange';

interface IProps {
  showModal: boolean;
  closeModal: () => void;
  exchange: IExchangeHeader | undefined;
}

const ExchangeDetailModal = ({ showModal, closeModal, exchange }: IProps) => {
  const { width } = useWindowDimensions();

  const renderTableHeader = (first_header: string, second_header: string, third_header: string) => {
    return (
      <HStack space={2} justifyContent="space-between">
        <Text bold fontSize={16}>
          {first_header}
        </Text>
        <Text bold fontSize={16}>
          {second_header}
        </Text>
        <Text bold fontSize={16}>
          {third_header}
        </Text>
      </HStack>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return { color: 'coolGray', label: 'Pendiente' };
      case 'Entregado':
        return { color: 'success', label: 'Entregado' };
      case 'Cancelado':
        return { color: 'danger', label: 'Cancelado' };
      default:
        return { color: 'coolGray', label: 'Pendiente' };
    }
  };

  return (
    <Modal isOpen={showModal} onClose={closeModal}>
      <Modal.Content width={width - 20}>
        <Modal.Header>
          <Box justifyContent="center" alignItems="center">
            <Text bold fontSize={18} textAlign="center">
              Detalle de Canje
            </Text>
            <Badge colorScheme={getStatusColor(exchange?.status).color} alignSelf="center" variant="subtle">
              {getStatusColor(exchange?.status).label}
            </Badge>
          </Box>
        </Modal.Header>
        <Modal.Body>
          <Box px={2}>
            <Stack>
              {renderTableHeader('Producto', 'Puntos', 'Total')}
              {exchange &&
                exchange.detail &&
                exchange.detail.length > 0 &&
                exchange.detail.map((item: IExchangeDetail) => {
                  return (
                    <>
                      <Divider my={2} />
                      <HStack key={item.id} space={2} px={3} justifyContent="space-between">
                        <Text>
                          {item.productName} x{item.quantity}
                        </Text>
                        <Text>{item.pointsRequired / item.quantity}</Text>
                        <Text>{item.pointsRequired}</Text>
                      </HStack>
                      <Divider my={2} />
                    </>
                  );
                })}
              <HStack space={2} justifyContent="space-between" pr={3}>
                <Text bold fontSize={16}>
                  Total Puntos:
                </Text>
                <Text bold fontSize={16}>
                  {exchange?.detail?.reduce((acc, a) => acc + a.pointsRequired, 0).toString()}
                </Text>
              </HStack>
            </Stack>
            {/* <Text fontSize={12} textAlign="center" pt={4} pb={2} color="warmGray.500">
              Al tener los puntos suficientes, podrás canjearlos por productos en{' '}
              <Text
                color="blue.500"
                onPress={() => {
                  RootNavigation.navigate(ScreenNames.VIRTUAL_STORE);
                }}
              >
                Nuestra tienda virtual
              </Text>
            </Text> */}
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
              Cerrar
            </Button>
          </Box>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ExchangeDetailModal;
