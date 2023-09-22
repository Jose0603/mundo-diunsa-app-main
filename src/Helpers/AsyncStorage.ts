import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getData = async (key: string): Promise<string | boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    return false;
  }
};
