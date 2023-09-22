import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import { Badge, Box, HStack, Icon, Text, VStack } from 'native-base';
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
    <HStack py={3} borderBottomWidth="1" borderColor={'gray.400'} justifyContent="center">
      <VStack w="40%">
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
          <VStack w="60%" alignItems="flex-start" bgColor="#EFEFEF" px={2} mr={3} borderRadius="lg">
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
        <HStack space={3} justifyContent="space-between" my={2}>
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
          <VStack w="60%" alignItems="flex-start" bgColor="#EFEFEF" px={2} mr={3} borderRadius="lg">
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
      </VStack>
      <VStack w="40%">
        {/* <HStack space={3} justifyContent="space-between" mb={1}>
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
     </HStack> */}
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
          <VStack w="60%" alignItems="flex-start" bgColor="#EFEFEF" px={2} mr={2} borderRadius="lg">
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
        <HStack space={3} justifyContent="space-between" my={2}>
          <VStack w="30%">
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              bold
            >
              Estado
            </Text>
          </VStack>
          <VStack w="60%" alignItems="flex-start">
            <Badge w="30%" colorScheme={ticketStatus.type} rounded="sm">
              {ticketStatus.label}
            </Badge>
          </VStack>
        </HStack>
      </VStack>
      <Box w="20%" alignItems="center">
        <Text
          _dark={{
            color: 'warmGray.50',
          }}
          color="coolGray.800"
          bold
        >
          Ver Detalles
        </Text>
        <Icon
          as={AntDesign}
          size="md"
          name="arrowright"
          _dark={{
            color: 'warmGray.50',
          }}
          color="#eeeeee"
          bgColor="#2777CC"
          borderRadius="full"
          // p={2}
        />
      </Box>
    </HStack>
  );
}
