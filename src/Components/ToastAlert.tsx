import { Alert, HStack, Text, VStack } from 'native-base';
import React from 'react';

export const ToastAlert = ({ id, status, variant, title, description, isClosable = false, ...rest }) => (
  <Alert
    maxWidth="100%"
    alignSelf="center"
    flexDirection="row"
    status={status ? status : 'info'}
    variant={variant}
    {...rest}
  >
    <VStack space={1} flexShrink={1} w="100%">
      <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
        <HStack space={2} flexShrink={1} alignItems="center">
          <Alert.Icon />
          <Text
            fontSize="md"
            fontWeight="medium"
            flexShrink={1}
            color={variant === 'solid' ? 'lightText' : variant !== 'outline' ? 'darkText' : null}
          >
            {title}
          </Text>
        </HStack>
      </HStack>
      <Text px="6" color={variant === 'solid' ? 'lightText' : variant !== 'outline' ? 'darkText' : null}>
        {description}
      </Text>
    </VStack>
  </Alert>
);
