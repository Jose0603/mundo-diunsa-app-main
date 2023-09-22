import React from 'react';
import { Center, Image, VStack, Text } from 'native-base';
// import { Icon } from '@ui-kitten/components';
// import { Feather } from '@expo/vector-icons';

export const NoData = ({ message = 'No hay datos por el momento' }: any) => {
  // const TicketIcon = (props: any) => <Icon {...props} name="archive-outline" />;

  return (
    <Center flex={1} px="3">
      <VStack space={2} alignItems="center">
        {/* <Feather name="archive" size={40} color="black" /> */}
        <Image source={require('../../assets/no-data-2.png')} alt="No hay datos" size="xl" py={2} />

        <Text
          fontSize="xl"
          _dark={{
            color: 'warmGray.50',
          }}
          color="coolGray.400"
          textAlign="center"
        >
          {message}
        </Text>
      </VStack>
    </Center>
  );
};
