import { ArrowBackIcon, Center, HStack, Image, Pressable, Text, VStack } from 'native-base';
import React from 'react';
import * as RootNavigation from '../Navigator/RootNavigation';

// import { Icon } from '@ui-kitten/components';
// import { Feather } from '@expo/vector-icons';

export const EmptyCart = ({ message = 'Tu carrito parece estar vacio', showBtn = false }: any) => {
  // const TicketIcon = (props: any) => <Icon {...props} name="archive-outline" />;

  return (
    <Center flex={1} px="3">
      <VStack space={2} alignItems="center">
        {/* <Feather name="archive" size={40} color="black" /> */}
        <Image source={require('../../assets/no-data-3.png')} alt="No hay datos" size="xl" />

        <Text
          fontSize="xl"
          _dark={{
            color: 'warmGray.50',
          }}
          color="coolGray.400"
        >
          {message}
        </Text>

        {showBtn && (
          <Pressable
            onPress={() => {
              RootNavigation.goBack();
            }}
            bg="#eee"
            p={5}
            borderRadius="lg"
          >
            <HStack alignItems="center" justifyContent="center">
              <ArrowBackIcon size="sm" />
              <Text>Regresar</Text>
            </HStack>
          </Pressable>
        )}
      </VStack>
    </Center>
  );
};
