import { AntDesign, Entypo } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Drawer, DrawerItem, IndexPath } from '@ui-kitten/components';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { AppPermissions } from '../Helpers/AppPermissions';
import { ScreenNames } from '../Helpers/ScreenNames';
import { useHasPermissions } from '../hooks/usePermissions';
import { AuthState } from '../Redux/reducers/auth/loginReducer';
import ChatScreen from '../Screens/chat';
import { DashboardScreen } from '../Screens/Incidents/DashboardScreen';
import FormIncidentScreen from '../Screens/Incidents/FormIncidentScreen';
import { HomeIncidentsScreen } from '../Screens/Incidents/HomeIncidentsScreen';
import { IncidentDetailsScreen } from '../Screens/Incidents/IncidentDetailsScreen';
import { SolutionIncidentScreen } from '../Screens/Incidents/SolutionIncidentScreen';
import { DrawerHeader } from './DrawerHeader';
import { DrawerItemMND, DrawerItemMNDProps } from './DrawerItemMND';
import { PrivacyPolicyFooter } from './PrivacyPolicyFooter';

const { Navigator, Screen } = createDrawerNavigator();

const DrawerContent = (/*{ navigation, state }: any */ props) => {
  const { top } = useSafeAreaInsets();
  const auth: AuthState = useSelector((state: any) => state.auth.login);
  // const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>();

  const isTechnician = useHasPermissions([AppPermissions.tecnico]);

  const { state, navigation } = props;
  const selectedIndex = new IndexPath(state.index);

  // useEffect(() => {
  //   setSelectedIndex(state.index);
  // }, [state.index]);

  // return (
  //   <DrawerContentScrollView {...props}>
  //     {/* <DrawerItemList {...props} /> */}
  //     <Header user={auth} />
  //     {isTechnician && (
  //       <DrawerItemMND
  //         label="Dashboard"
  //         icon={({focused}: DrawerItemMNDProps) => <AntDesign name="dashboard" size={16} color={focused ? '#0077CD' : '#222A45'} />}
  //         onPress={() => navigation.navigate(ScreenNames.DASHBOARD_INCIDENTS)}
  //         focused={props.state.index === props.state.routes.findIndex(e => e.name === ScreenNames.DASHBOARD_INCIDENTS)}
  //       />
  //     )}
  //     <DrawerItemMND
  //       label="Lista de Incidencias"
  //       icon={({focused}: DrawerItemMNDProps) => <Entypo name="list" size={16} color={focused ? '#0077CD' : '#222A45'} />}
  //       onPress={() => navigation.navigate(ScreenNames.HOME_INCIDENTS)}
  //       focused={props.state.index === props.state.routes.findIndex(e => e.name === ScreenNames.HOME_INCIDENTS)}
  //     />
  //     <PrivacyPolicyFooter />
  //   </DrawerContentScrollView>
  // );

  return (
    <Drawer
      header={<DrawerHeader user={auth} />}
      ListFooterComponent={<PrivacyPolicyFooter />}
      selectedIndex={selectedIndex}
      // onSelect={(index) => setSelectedIndex(index)}
      appearance="noDivider"
    >
      {/* <DrawerItem title="Inicio" accessoryLeft={HomeIcon} onPress={() => navigation.navigate(ScreenNames.MAIN_MENU)} /> */}

      {/* <DrawerItem title="Chat" accessoryLeft={TicketIcon} onPress={() => navigation.navigate(ScreenNames.CHAT)} /> */}
      {isTechnician && (
        <DrawerItem
          key={2}
          title="Dashboard"
          accessoryLeft={() => <AntDesign name="dashboard" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.DASHBOARD_INCIDENTS)}
          // selected={props.state.index === props.state.routes.findIndex(e => e.name === ScreenNames.DASHBOARD_INCIDENTS)}
        />
      )}
      <DrawerItem
        key={1}
        title="Lista de Incidencias"
        accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
        onPress={() => navigation.navigate(ScreenNames.HOME_INCIDENTS)}
        // selected={props.state.index === props.state.routes.findIndex(e => e.name === ScreenNames.HOME_INCIDENTS)}
      />
      {/* <DrawerGroup title="Incidencias" accessoryLeft={FlagIcon}>
        <DrawerItem
          title="Dashboard"
          accessoryLeft={ChartIcon}
          onPress={() => navigation.navigate(ScreenNames.DASHBOARD_INCIDENTS)}
        />
        <DrawerItem
          title="Lista de incidencias"
          accessoryLeft={ListIcon}
          onPress={() => navigation.navigate(ScreenNames.HOME_INCIDENTS)}
        />
      </DrawerGroup> */}
    </Drawer>
  );
};

function DrawerNavigator() {
  const isTechnician = useHasPermissions([AppPermissions.tecnico]);
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  return (
    <Navigator
      screenOptions={({ route }: any) => ({
        headerStyle: {
          elevation: 0,
          shadowColor: 'transparent',
        },
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
        drawerType: isLargeScreen ? 'permanent' : 'slide',
        backBehavior: 'history',
      })}
      initialRouteName={ScreenNames.HOME_INCIDENTS}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      {isTechnician && <Screen name={ScreenNames.DASHBOARD_INCIDENTS} component={DashboardScreen} />}
      {isTechnician && <Screen name={ScreenNames.SOLUTION_INCIDENT} component={SolutionIncidentScreen} />}
      <Screen name={ScreenNames.HOME_INCIDENTS} component={HomeIncidentsScreen} />
      {/* <Screen name="Orders" component={DetailsScreen} /> */}
      <Screen name={ScreenNames.FORM_INCIDENT} component={FormIncidentScreen} />
      <Screen name={ScreenNames.DETAIL_INCIDENT} component={IncidentDetailsScreen} />
      <Screen name={ScreenNames.CHAT} component={ChatScreen} />
    </Navigator>
  );
}

export default DrawerNavigator;
