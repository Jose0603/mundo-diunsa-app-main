import { View, Text } from 'react-native';
import React from 'react';
import { Skeleton, VStack } from 'native-base';

const NewsSkeleton = () => {
  return (
    <VStack
      w="100%"
      // maxW="400"
      alignContent={'center'}
      justifyContent="center"
      borderWidth="0"
      space={8}
      overflow="hidden"
      rounded="md"
      my={3}
      // _dark={{
      //   borderColor: 'coolGray.500',
      // }}
      // _light={{
      //   borderColor: 'coolGray.200',
      // }}
    >
      <Skeleton h="220" />
      <Skeleton.Text px="4" mt={2} startColor="blue.100" />
    </VStack>
  );
};

export default NewsSkeleton;
