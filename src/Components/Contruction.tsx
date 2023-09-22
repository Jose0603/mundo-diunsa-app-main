import React from 'react';
import { Button, Center, Text, Box } from 'native-base';
import * as RootNavigation from '../Navigator/RootNavigation';
import { RootState } from '../Redux/reducers/rootReducer';
import TopMainBar from './TopMainBar';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IProps {
  moduleName: string;
}

const Construction = ({ moduleName }: IProps) => {
  const insets = useSafeAreaInsets();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  return (
    <Box flex={1} backgroundColor="#fff" pb={0} style={{ paddingTop: Math.max(insets.top, 16) }}>
      <TopMainBar showIconBadge={notifications && notifications.length > 0} />
      <Center flex={1} safeArea>
        <Text fontSize="md" textAlign="center">
          Estamos trabajando en el modulo de {moduleName}
        </Text>
        <Text fontSize="md" textAlign="center">
          🛎Pronto podrás utilizarlo 🛎
        </Text>
        <Button
          mt={2}
          onPress={() => {
            RootNavigation.goBack();
          }}
        >
          Regresar
        </Button>
      </Center>
    </Box>
  );
};

export default Construction;
