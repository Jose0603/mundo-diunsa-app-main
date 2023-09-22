import moment from 'moment';
import { Badge, Box, HStack, Text, VStack } from 'native-base';
import React from 'react';

import { EntityTypes, IRequestPendingApproval } from '../../../../interfaces/rrhh/IRequestPendingApproval';

interface IProps {
  item: IRequestPendingApproval;
  ticketStatus: {
    label: string;
    type: string;
  };
}

export default function PendingApprovalItem({ item, ticketStatus }: IProps) {
  return (
    <Box py={3} borderBottomWidth="1" borderColor={'gray.400'} justifyContent="center">
      <VStack w="100%">
        <Badge w="30%" colorScheme={ticketStatus.type} rounded="sm">
          {ticketStatus.label}
        </Badge>
        <HStack space={3} justifyContent="space-between" mb={1} mt={1}>
          <VStack w="30%">
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              bold
            >
              Solicitud
            </Text>
          </VStack>
          <VStack w="60%" alignItems="flex-start">
            <Text
              color="coolGray.800"
              _dark={{
                color: 'warmGray.200',
              }}
            >
              {item.iraEntitysetName === EntityTypes.entidadAdicional ? 'CuponTiempoLibre' : item.iraEntitysetName}
            </Text>
          </VStack>
        </HStack>
        <HStack space={3} justifyContent="space-between" mb={1}>
          <VStack w="30%">
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              bold
            >
              Empleado que digita
            </Text>
          </VStack>
          <VStack w="60%" alignItems="flex-start">
            <Text
              color="coolGray.800"
              _dark={{
                color: 'warmGray.200',
              }}
            >
              {item.usrNombreUsuario}
            </Text>
          </VStack>
        </HStack>
        <HStack space={3} justifyContent="space-between" mb={1}>
          <VStack w="30%">
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              bold
            >
              Sujeto de Acción
            </Text>
          </VStack>
          <VStack w="60%" alignItems="flex-start">
            <Text
              color="coolGray.800"
              _dark={{
                color: 'warmGray.200',
              }}
            >
              {item.nombreSujetoAccion}
            </Text>
          </VStack>
        </HStack>
        <HStack space={3} justifyContent="space-between" mb={1}>
          <VStack w="30%">
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              bold
            >
              Fecha Inicio
            </Text>
          </VStack>
          <VStack w="60%" alignItems="flex-start">
            <Text
              color="coolGray.800"
              _dark={{
                color: 'warmGray.200',
              }}
            >
              {moment(item.ainFechaPendiente).format('DD/MM/YYYY')}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}
