import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, Image, Text, VStack } from 'native-base';
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import { sentenceCase } from '../Helpers/FormatToSenteceCase';
import { ResetUserData } from '../Redux/actions/auth/loginActions';
import { resetExtraData } from '../Redux/reducers/auth/profileSlice';

export const DrawerHeader = (props: any): ReactElement => {
  const { user } = props;
  const dispatch = useDispatch();
  return (
    <Box safeArea mb={5}>
      <Box flexDirection="column" alignItems="center">
        <Image h={50} w={150} my={5} source={require('../../assets/logo_app.png')} alt="logo diunsa" />
        <HStack alignItems="center">
          <Image
            size="md"
            background="#eee"
            borderRadius={10}
            alt="perfil"
            source={{ uri: user.picture }}
            fallbackSource={require('../../assets/persona.png')}
          />
          <VStack ml={3}>
            <Text>{sentenceCase(user.username) ?? 'Usuario'}</Text>
            <HStack>
              <Ionicons name="md-key-outline" size={18} color="black" />
              <Text
                ml={1}
                bold
                onPress={() => {
                  dispatch(resetExtraData());
                  dispatch(ResetUserData());
                }}
              >
                Cerrar Sesión
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
};
