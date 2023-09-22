import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { initializeApp } from 'firebase/app';
import moment from 'moment-timezone';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AppState, LogBox, Platform } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from 'react-query';
import { Provider, useDispatch } from 'react-redux';

// import VersionCheck from 'react-native-version-check-expo';
import API, { baseURL } from './src/Axios';
import DialogAlert from './src/Components/DialogAlert';
import { queryClient } from './src/Configs/QueryClient';
import { getData, storeData } from './src/Helpers/AsyncStorage';
import { AppNavigator } from './src/Navigator/StackNavigator';
import { ChangeUserData } from './src/Redux/actions/auth/loginActions';
import { store } from './src/Redux/storeConfig/store';
import { SaveEntranceUserConnection, SaveExitUserConnection, TokenLoginService } from './src/Services/Auth';
import { ThemeContext } from './src/themeContext';

import './src/sheets.tsx';
import 'expo-dev-client';
import 'moment/locale/es';

moment.locale('es');
moment.tz.setDefault('America/Tegucigalpa');

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

LogBox.ignoreLogs(['Setting a timer']);
const prefix = Linking.createURL('/');

export default () => {
  const appState = useRef(AppState.currentState);

  let [fontsLoaded] = useFonts({
    'BRFirma-Regular': require('./assets/fonts/BRFirma-Regular.ttf'),
    'BRFirma-Bold': require('./assets/fonts/BRFirma-Bold.ttf'),
    'BRFirma-Medium': require('./assets/fonts/BRFirma-Medium.ttf'),
    'BRFirma-Light': require('./assets/fonts/BRFirma-Light.ttf'),
    'BRFirma-SemiBold': require('./assets/fonts/BRFirma-SemiBold.ttf'),
    'BRFirma-Thin': require('./assets/fonts/BRFirma-Thin.ttf'),
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }
  const [theme, setTheme] = useState<string>('light');

  // const customUpdater = new ExpoCustomUpdater({
  //   minRefreshSeconds: 600,
  //   showDebugInConsole: true, // Only for debugging update issues
  //   beforeCheckCallback: () => {
  //     setShowLoadingScreen(true);
  //   },
  //   beforeDownloadCallback: () => setUpdateMessage('A new version of the app is being downloaded'),
  //   afterCheckCallback: () => {
  //     setShowLoadingScreen(false);
  //   },
  //   awaitForUpdate: false, // Set to true to wait for the update process, useful for simple apps keeping the splash screen up until update is completed
  // });

  useEffect(() => {
    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          // Alert.alert(
          //   'Actualización disponible',
          //   'Se ha detectado una actualización disponible, por favor reinicie la aplicación para aplicar los cambios.',
          //   [
          //     {
          //       text: 'Actualizar',
          //       onPress: () => {
          //         Updates.reloadAsync();
          //       },
          //     },
          //   ],
          //   { cancelable: false }
          // );
        }
      } catch (e) {
        // HANDLE ERROR HERE
      }
    })();
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const closeCurrentConnection = async () => {
    const connectionId = await getData('connectionId');

    if (typeof connectionId === 'string' && connectionId.length > 0) {
      await SaveExitUserConnection(connectionId, Platform.OS);
      await storeData('connectionId', '');
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    try {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        await closeCurrentConnection();
        const guid = await SaveEntranceUserConnection();
        await storeData('connectionId', guid);
      } else {
        await closeCurrentConnection();
      }

      appState.current = nextAppState;
      // setAppStateVisible(appState.current);
    } catch (error) {
      console.log('🚀 ~ file: App.tsx ~ line 102 ~ handleAppStateChange ~ error', error);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const firebaseConfig = {
    apiKey: 'AIzaSyBgI-EFWOl2xO1GHEhxaHmZnjMt_z7dfS4',
    authDomain: 'mundo-diunsa.firebaseapp.com',
    databaseURL: 'https://mundo-diunsa-default-rtdb.firebaseio.com',
    projectId: 'mundo-diunsa',
    storageBucket: 'mundo-diunsa.appspot.com',
    messagingSenderId: '171099508566',
    appId: 'com.diunsa.mundo',
  };

  initializeApp(firebaseConfig);

  const config = {
    dependencies: {
      'linear-gradient': require('expo-linear-gradient').LinearGradient,
    },
  };

  const customTheme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#E3F2F9',
        100: '#C5E4F3',
        200: '#A2D4EC',
        300: '#7AC1E4',
        400: '#47A9DA',
        500: '#1160A3',
        600: '#007AB8',
        700: '#006BA1',
        800: '#005885',
        900: '#003F5E',
      },
      // Redefinig only one shade, rest of the color will remain same.
      amber: {
        400: '#d97706',
      },
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: 'light',
    },
    fontConfig: {
      BRFirma: {
        100: {
          normal: 'BRFirma-Thin',
        },
        200: {
          normal: 'BRFirma-Light',
        },
        300: {
          normal: 'BRFirma-Light',
        },
        400: {
          normal: 'BRFirma-Regular',
        },
        500: {
          normal: 'BRFirma-Medium',
        },
        600: {
          normal: 'BRFirma-Medium',
        },
        700: {
          normal: 'BRFirma-Bold',
        },
        800: {
          normal: 'BRFirma-Bold',
        },
      },
      fonts: {
        heading: 'BRFirma-Bold',
        body: 'BRFirma-Regular',
        mono: 'BRFirma-Regular',
      },
    },
  });

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <NativeBaseProvider config={config} theme={customTheme}>
              <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <ApplicationProvider {...eva} theme={eva[theme]}>
                  <SheetProvider>
                    <StatusBar style="auto" backgroundColor="#005FA8" />
                    <DialogAlert />
                    <AppNavigator />
                  </SheetProvider>
                </ApplicationProvider>
              </SafeAreaProvider>
            </NativeBaseProvider>
          </ThemeContext.Provider>
        </Provider>
      </QueryClientProvider>
    </>
  );
};
