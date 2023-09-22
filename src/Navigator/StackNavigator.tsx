import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import API, { baseURL } from '../Axios';
import Construction from '../Components/Contruction';
import { Loading } from '../Components/Loading';
import { AppPermissions } from '../Helpers/AppPermissions';
import { colors } from '../Helpers/Colors';
import { ScreenNames } from '../Helpers/ScreenNames';
import { useHasPermissions } from '../hooks/usePermissions';
import { IGroupedClinicAppointment } from '../interfaces/rrhh/IClinic';
import {
  ChangeUserData,
  ResetUserData,
} from '../Redux/actions/auth/loginActions';
import { AuthState } from '../Redux/reducers/auth/loginReducer';
import { resetExtraData } from '../Redux/reducers/auth/profileSlice';
import { setClinicAppointments } from '../Redux/reducers/clinic/clinicAppointmentsSlice';
import { persistor } from '../Redux/storeConfig/store';
import LoginScreen from '../Screens/LoginScreen';
import ListNotificationsScreen from '../Screens/notifications/ListNotificationsScreen';
import { NotificationsModal } from '../Screens/NotificationsModal';
import RegisterScreen from '../Screens/RegisterScreen';
import RequestResetPasswordScreen from '../Screens/RequestResetPasswordScreen';
import ResetPasswordScreen from '../Screens/ResetPasswordScreen';
import Sign from '../Screens/rrhh/Expendients/Signature/Signature';
import AnnouncementDetailScreen from '../Screens/rrhh/News/NewsDetailScreen';
import NewsPendingReadScreen from '../Screens/rrhh/News/NewsPendingReadScreen';
import CouponExchangeScreen from '../Screens/rrhh/VirtualStore/Coupon';
import { ProductListScreen } from '../Screens/rrhh/VirtualStore/product-list/ProductList';
import ShoppingCartScreen from '../Screens/rrhh/VirtualStore/shopping-cart/ShoppingCart';
import { TokenLoginService } from '../Services/Auth';
import { navigationRef } from './RootNavigation';
import TabNavigator from './TabNavigator';

const { Navigator, Screen, Group } = createNativeStackNavigator();

const prefix = Linking.createURL('/');

const HomeNavigator = () => {
  // const [isLoadingToken, setIsLoadingToken] = React.useState(false);
  const user: AuthState = useSelector((state: any) => state.auth.login);
  const hasAccessToApp = useHasPermissions(AppPermissions.inicio);
  const dispatch = useDispatch();

  function manageErrorConnection(err: any) {
    if (
      err?.response &&
      err?.response?.status >= 400 &&
      err?.response?.status <= 500
    ) {
      const { status } = err?.response;
      if (status === 401) {
        dispatch(resetExtraData());
        dispatch(ResetUserData());
      }
      return Promise.reject(err);
    } else if (err.code === 'ECONNREFUSED') {
      return 'Connection Error';
    } else {
      return Promise.reject(err);
    }
  }

  (function () {
    if (user.token) {
      API.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    } else {
      API.defaults.headers.common['Authorization'] = '';
    }
    API.interceptors.response.use(
      (response: any) => response,
      manageErrorConnection
    );
  })();

  // const connectionHub = `${baseURL}/tickethub`;
  // const transport = HttpTransportType.WebSockets;
  // const protocol = new JsonHubProtocol();
  // const options: IHttpConnectionOptions = {
  //   transport,
  //   logMessageContent: true,
  //   logger: LogLevel.Debug,
  //   accessTokenFactory: () => user.token,
  //   // skipNegotiation: true,
  //   withCredentials: true,
  // };

  // const connection = new HubConnectionBuilder()
  //   .withUrl(connectionHub)
  //   .withHubProtocol(protocol)
  //   .withAutomaticReconnect()
  //   .configureLogging(LogLevel.Error)
  //   .build();

  // connection.on('clinic', (data: IGroupedClinicAppointment[]) => {
  //   // guardar en el estado todas las solicitudes pendientes
  //   dispatch(setClinicAppointments(data));
  // });

  // async function start() {
  //   try {
  //     if (connection.state === HubConnectionState.Disconnected) await connection.start();
  //     console.log('SignalR Connected.');
  //   } catch (err) {
  //     console.log(err);
  //     setTimeout(start, 5000);
  //   }
  // }

  // useEffect(() => {
  //   if (Platform.OS === 'web') {
  //     setIsLoadingToken(true);
  //     let params = new URL(document.location as any).searchParams;
  //     let token = params.get('token');
  //     console.log('🚀 ~ file: StackNavigator.tsx:111 ~ useEffect ~ token', document.location);
  //     API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  //     TokenLoginService()
  //       .then((res) => {
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, []);

  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={ScreenNames.MAIN}
    >
      {user && user.isLoggedIn && user.acceptedTerms && hasAccessToApp ? (
        <>
          <Screen name={ScreenNames.MAIN} component={TabNavigator} />
          <Screen
            name={ScreenNames.NEWS_DETAIL_STACK}
            component={AnnouncementDetailScreen}
          />
          <Screen
            name={ScreenNames.PENDING_READ_NEWS}
            component={NewsPendingReadScreen}
          />
          <Group
            screenOptions={{
              presentation: 'modal',
              contentStyle: { backgroundColor: colors.primary },
            }}
          >
            <Screen
              name={ScreenNames.NOTIFICATIONS_MODAL}
              component={NotificationsModal}
            />
          </Group>
          {/* <Screen name={ScreenNames.MAINTENANCE} component={DrawerNavigator} />
          <Screen name={ScreenNames.RRHH} component={RRHHNavigator} /> */}
          <Screen
            name={ScreenNames.NOTIFICATIONS}
            component={ListNotificationsScreen}
          />
          <Screen
            name={ScreenNames.VIRTUAL_STORE}
            component={ProductListScreen}
          />
          <Screen
            name={ScreenNames.SHOPPING_CART}
            component={ShoppingCartScreen}
          />
          <Screen
            name={ScreenNames.COUPON_EXCHANGE}
            component={CouponExchangeScreen}
          />
        </>
      ) : user && user.isLoggedIn && !user.acceptedTerms && hasAccessToApp ? (
        <Screen name={ScreenNames.SIGNATURE} component={Sign} />
      ) : (
        <>
          <Screen name={ScreenNames.LOGIN} component={LoginScreen} />
          <Screen
            name={ScreenNames.REQUEST_RESET_PASSWORD}
            component={RequestResetPasswordScreen}
          />
          <Screen
            name={ScreenNames.RESET_PASSWORD}
            component={ResetPasswordScreen}
          />
          <Screen name={ScreenNames.FAKE_FORM} component={RegisterScreen} />
        </>
      )}
    </Navigator>
  );
};

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        main: {
          initialRouteName: 'mainmenu',
          screens: {
            mainmenu: 'mainmenu',
            maintenance: 'maintenance',
            rrhh: 'rrhh',
            finance: 'finance',
          },
        },
        NotFound: '*',
      },
    },
  };

  const mutation = useMutation(
    (params: any) => {
      let token = params.get('token');
      API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      return TokenLoginService();
    },
    {
      onError: (error: any) => {
        mutation.reset();
      },
      onSettled: ({ data }: any, error: any, variables, context) => {
        console.log('RESULTADO', data.data);
        if (data.result) {
          if (
            data.data.permissions &&
            data.data.permissions.length > 0 &&
            data.data.permissions.includes?.(AppPermissions.inicio)
          ) {
            dispatch(
              ChangeUserData({
                email: data.data.email ?? '',
                employeeId: data.data.employeeId,
                isLoggedIn: true,
                permissions: data.data.permissions,
                profile: data.data.profile ?? 'User',
                token: data.data.token,
                username: data.data.username,
                name: data.data.name,
                employeePosition: data.data.employeePosition ?? '',
                __jsogObjectId: '1',
                acceptedTerms: data.data.acceptPolicy ?? true,
                picture: data.data.picture,
              })
            );
            window.location.replace(window.location.origin);
            console.log(
              '🚀 ~ file: StackNavigator.tsx:259 ~ AppNavigator ~ window.location.origin',
              window.location.origin
            );
            // window.history.pushState({}, document.title);
            // let params = new URL(document.location as any).searchParams;
            // params.delete('token');
            // window.location.reload();
          }
        }
      },
    }
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      let params = new URL(document.location as any).searchParams;
      if (params.get('token') !== null) {
        mutation.mutate(params);
        // let token = params.get('token');
        // console.log(
        //   '🚀 ~ file: StackNavigator.tsx:111 ~ useEffect ~ token',
        //   token
        // );
        // API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        // TokenLoginService()
        //   .then((res) => {
        //     console.log('hoal');
        //     console.log(res);
        //     dispatch(
        //       ChangeUserData({
        //         email: res.data.email ?? '',
        //         employeeId: res.data.employeeId,
        //         isLoggedIn: true,
        //         permissions: res.data.permissions,
        //         profile: res.data.profile ?? 'User',
        //         token: res.data.token,
        //         username: res.data.username,
        //         name: res.data.name,
        //         employeePosition: res.data.employeePosition ?? '',
        //         __jsogObjectId: '1',
        //         acceptedTerms: res.data.acceptPolicy ?? true,
        //         picture: res.data.picture,
        //       })
        //     );
        //     navigate(ScreenNames.MAIN);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
      }
    }
  }, []);

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <HomeNavigator />
      </PersistGate>
    </NavigationContainer>
  );
};
