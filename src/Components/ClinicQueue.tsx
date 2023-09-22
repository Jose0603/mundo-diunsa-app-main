import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, PresenceTransition, Pressable, Skeleton, Text, VStack } from 'native-base';
import React from 'react';

import { queryClient } from '../Configs/QueryClient';
import { QueryKeys } from '../Helpers/QueryKeys';
import { useClinicQueue } from '../hooks/useClinicQueue';

function ClinicQueue() {
  const { attendingTickets, myTickets, clinicName, loadingQueue, isFetchingAppointments, isLoadingAppointments } =
    useClinicQueue();

  const refetchAppointments = async () => {
    await queryClient.invalidateQueries(QueryKeys.CLINIC_PENDING_APPOINTMENTS);
  };

  return myTickets.length > 0 ? (
    <PresenceTransition
      visible={true}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 150,
        },
      }}
    >
      {/* <Pressable
        onPress={() => {
          refetchAppointments();
        }}
      > */}
      <Box
        borderRadius={15}
        justifyContent="space-around"
        alignContent="center"
        display={'flex'}
        height={90}
        bg={{
          linearGradient: {
            colors: ['rgba(1, 122, 133, 100)', 'rgba(34, 189, 203, 100)'],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        shadow="9"
      >
        <Box position="absolute" top={15} left={5}>
          <Skeleton
            startColor={isLoadingAppointments || isFetchingAppointments ? 'amber.500' : 'green.500'}
            size="3"
            rounded="full"
          />
        </Box>
        {/* <Box position="absolute" top={15} right={5}>
            <Ionicons name="reload" size={14} color="#fff" />
          </Box> */}
        <Text color="white" textAlign="center" fontSize="xs" bold>
          Atención en Clinica {clinicName}
        </Text>
        <HStack justifyContent="space-around">
          <VStack>
            {loadingQueue || isLoadingAppointments ? (
              <Skeleton h="3" rounded="full" startColor="white" />
            ) : (
              <Text color="white" textAlign="center" fontSize="lg" bold>
                {attendingTickets.length > 0
                  ? attendingTickets.map((appointment) => appointment.ticketNumber).join(' - ')
                  : 'En espera'}
              </Text>
            )}
            <Text color="white" textAlign="center" fontSize="xs">
              Atendiendo
            </Text>
          </VStack>
          <VStack>
            {loadingQueue || isLoadingAppointments ? (
              <Skeleton h="3" rounded="full" startColor="white" />
            ) : (
              <Text color="white" textAlign="center" fontSize="lg" bold>
                {myTickets.length > 0 ? myTickets.map((appointment) => appointment.ticketNumber).join(' - ') : 0}
              </Text>
            )}
            <Text color="white" textAlign="center" fontSize="xs">
              {myTickets.map((appointment) => appointment.ticketNumber).length > 1 ? 'Tus tickets' : 'Tu ticket'}
            </Text>
          </VStack>
        </HStack>
      </Box>
      {/* </Pressable> */}
    </PresenceTransition>
  ) : (
    <></>
  );
}

export default React.memo(ClinicQueue);
