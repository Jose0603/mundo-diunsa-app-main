import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';

import Construction from '../Components/Contruction';
import { ScreenNames } from '../Helpers/ScreenNames';
import useAlert from '../hooks/useAlert';
import { RootState } from '../Redux/reducers/rootReducer';
import { MainMenuScreen } from '../Screens/MainMenuScreen';
import JobOffersScreen from '../Screens/rrhh/JobOffers/JobOffersScreen';
import RRHHNavigator from './RRHHNavigator';

const { Navigator, Screen } = createBottomTabNavigator();

export default function TabNavigator() {
  const isWeb = Platform.OS === 'web';
  const alert = useAlert();
  const change = useSelector((state: RootState) => state.expediente.change);
  return (
    <Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,

        headerStyle: {
          elevation: 0,
          shadowColor: 'transparent',
        },
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
        tabBarIcon: ({ focused }) => {
          let iconName = '';

          if (route.name === ScreenNames.MAINTENANCE) {
            return <Feather name="tool" size={24} color={focused ? '#0077CD' : '#000'} />;
          } else if (route.name === ScreenNames.RRHH) {
            return <Feather name="users" size={24} color={focused ? '#0077CD' : '#000'} />;
          } else if (route.name === ScreenNames.HOME_FINANCE) {
            return <Feather name="bar-chart-2" size={24} color={focused ? '#0077CD' : '#000'} />;
          } else if (route.name === ScreenNames.JOB_OFFER) {
            return <MaterialIcons name="work-outline" size={24} color={focused ? '#0077CD' : '#000'} />;
          } else if (route.name === ScreenNames.NOTIFICATIONS) {
            return <MaterialCommunityIcons name="monitor-multiple" size={20} color={focused ? '#0077CD' : '#000'} />;
          } else if (route.name === ScreenNames.MAIN_MENU) {
            return <Feather name="home" size={24} color={focused ? '#0077CD' : '#000'} />;
          }
        },
      })}
      initialRouteName={ScreenNames.MAIN_MENU}
      screenListeners={({ route, navigation }) => ({
        tabPress: (e) => {
          console.log('🚀 ~ file: profileData.tsx:89 ~ AlternativeData ~ change', change);

          if (!change) {
            return;
          }
          e.preventDefault();
          alert.show({
            onPress: () => {
              navigation.dispatch(CommonActions.navigate({ name: route.name }));
            },
            isOpen: true,
          });
        },
      })}
    >
      <Screen
        name={ScreenNames.MAIN_MENU}
        options={{
          tabBarLabel: '',
          lazy: true,
          tabBarStyle: { display: isWeb ? 'none' : 'flex' },
        }}
        component={MainMenuScreen}
      />
      <Screen
        name={ScreenNames.MAINTENANCE}
        options={{
          tabBarLabel: '',
          lazy: true,
          tabBarStyle: { display: isWeb ? 'none' : 'flex' },
        }}
        // children={DrawerNavigator}
        // children={() => {
        //   return <AnimationScreen />;
        // }}
        children={() => {
          return <Construction moduleName="Mantenimiento" />;
        }}
      />
      <Screen
        name={ScreenNames.RRHH}
        options={{
          tabBarLabel: '',
          lazy: true,
          tabBarStyle: { display: isWeb ? 'none' : 'flex' },
          unmountOnBlur: true,
        }}
        component={RRHHNavigator}
      />
      {/* <Screen
        name={ScreenNames.HOME_FINANCE}
        options={{
          tabBarLabel: '',
          lazy: true,
          tabBarStyle: { display: isWeb ? 'none' : 'flex' },
        }}
        children={() => {
          return <Construction moduleName="Finanzas" />;
        }}
      /> */}
      <Screen
        name={ScreenNames.JOB_OFFER}
        options={{
          tabBarLabel: '',
          lazy: true,
          tabBarStyle: { display: isWeb ? 'none' : 'flex' },
        }}
        component={JobOffersScreen}
      />
    </Navigator>
  );
}
