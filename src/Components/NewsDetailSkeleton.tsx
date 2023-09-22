import { View, Text, useWindowDimensions } from 'react-native';
import React from 'react';
import { HStack, Skeleton, VStack } from 'native-base';

const NewsDetailSkeleton = (props) => {
  const { width, height } = useWindowDimensions();
  return (
    <HStack
      {...props}
      w={width}
      // maxW="400"
      alignContent={'center'}
      justifyContent="center"
      borderWidth="0"
      // space={8}
      px={10}
      my={3}
      // _dark={{
      //   borderColor: 'coolGray.500',
      // }}
      // _light={{
      //   borderColor: 'coolGray.200',
      // }}
    >
      <Skeleton size="45" rounded="full" />
      <Skeleton.Text px="4" mt={2} startColor="blue.100" />
    </HStack>
  );
};

export default NewsDetailSkeleton;
