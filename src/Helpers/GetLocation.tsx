import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export const GetLocation = async () => {
  const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted' && !canAskAgain) {
    // Linking.openSettings();
    // const res = await Location.getForegroundPermissionsAsync();
    // console.log('respuesta de permisos', res);
    // Alert.alert('El permiso de ubicación no está activado');
    return;
  }

  return await Location.getCurrentPositionAsync({});
};
