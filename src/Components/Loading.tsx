import { Box, Center, Heading, HStack, Icon, Spinner } from 'native-base';
import React from 'react';

interface IProps {
  message?: string;
  color?: string;
  isFlex?: boolean;
}

export const Loading = ({ message = 'Cargando...', isFlex = true, color = 'blue.500' }: IProps) => {
  return (
    <Center px="3" flex={isFlex ? 1 : 0}>
      <HStack space={2} alignItems="center">
        <Spinner accessibilityLabel="Cargando" color={color} />
        <Heading color={color} fontSize="md">
          {message}
        </Heading>
      </HStack>
    </Center>
  );
};
