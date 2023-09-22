import { AntDesign, Entypo, Feather, FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Drawer, DrawerGroup, DrawerItem, IndexPath } from '@ui-kitten/components';
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
import { MainMenuScreen } from '../Screens/MainMenuScreen';
import { NotificationsModal } from '../Screens/NotificationsModal';
import { DrawerHeader } from './DrawerHeader';
import { DrawerItemMND, DrawerItemMNDProps } from './DrawerItemMND';
import { PrivacyPolicyFooter } from './PrivacyPolicyFooter';

const { Navigator, Screen, Group } = createDrawerNavigator();

const DrawerContent = (/*{ navigation, state }: any */ props) => {
  const { top } = useSafeAreaInsets();
  const auth: AuthState = useSelector((state: any) => state.auth.login);
  // const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>();

  const isTechnician = useHasPermissions([AppPermissions.tecnico]);

  const { state, navigation } = props;
  const selectedIndex = new IndexPath(state.index);

  const isAuthorizer = useHasPermissions([
    AppPermissions.aprobar_solicitudes,
    AppPermissions.aprobar_asistencia,
    AppPermissions.aprobar_constancia,
    AppPermissions.aprobar_constancia_CBA,
    AppPermissions.aprobar_constancia_TGU,
    AppPermissions.aprobar_acciones_personal,
    AppPermissions.aprobar_planillas,
    AppPermissions.aprobar_vacaciones,
  ]);

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
      <DrawerItem
        title="Inicio"
        key={0}
        accessoryLeft={() => <Feather name="home" size={16} color="black" />}
        onPress={() => navigation.navigate(ScreenNames.DASHBOARD_RRHH)}
      />
      {/* <DrawerItem
        title="Dashboard"
        key={1}
        accessoryLeft={ChartIcon}
        onPress={() => navigation.navigate(ScreenNames.DASHBOARD_RRHH)}
      /> */}
      {/* <DrawerItem title="Chat" accessoryLeft={TicketIcon} onPress={() => navigation.navigate(ScreenNames.CHAT)} /> */}
      <DrawerGroup title="Solicitudes" accessoryLeft={() => <FontAwesome5 name="wpforms" size={16} color="black" />}>
        <DrawerItem
          key={1}
          title="Mis Solicitudes"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() =>
            // navigation.navigate(ScreenNames.MAIN_MENU, {
            //   screen: ScreenNames.RRHH,
            // })
            navigation.goBack()
          }
        />
        {isAuthorizer ? (
          <DrawerItem
            key={2}
            title="Solicitudes Por Aprobar"
            accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
            onPress={() => navigation.navigate(ScreenNames.LIST_PENDING_APPROVAL_REQUESTS)}
          />
        ) : (
          <></>
        )}
        <DrawerItem
          key={3}
          title="Nueva Solicitud"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.HOME_REQUESTS)}
        />
      </DrawerGroup>
      <DrawerGroup title="Consultas" accessoryLeft={() => <Feather name="inbox" size={16} color="black" />}>
        <DrawerItem
          key={4}
          title="Recibos de Pago"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.RECEIPT_OF_PAYMENT)}
        />
        <DrawerItem
          key={5}
          title="Saldo de Vacaciones"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.VACATION_BALANCE)}
        />
        <DrawerItem
          key={6}
          title="Tiempo Compensatorio"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.COMPENSATORY_TIME_BALANCE)}
        />
        <DrawerItem
          key={7}
          title="Control de Asistencia"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.MARKS)}
        />
      </DrawerGroup>
      <DrawerItem
        key={8}
        title="Noticias"
        accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
        onPress={() => navigation.navigate(ScreenNames.HOME_NEWS)}
      />
      <DrawerItem
        key={9}
        title="Canjeo de Puntos"
        accessoryLeft={() => <SimpleLineIcons name="diamond" size={16} color="black" />}
        onPress={() => navigation.navigate(ScreenNames.VIRTUAL_STORE)}
      />
    </Drawer>
  );
};

function MainNavigator() {
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
      initialRouteName={ScreenNames.MAIN_NEWS}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Screen name={ScreenNames.MAIN_NEWS} component={MainMenuScreen} />
      <Screen name={ScreenNames.NOTIFICATIONS_MODAL} component={NotificationsModal} />
      {/* <Screen name="Orders" component={DetailsScreen} /> */}
      <Screen name={ScreenNames.FORM_INCIDENT} component={FormIncidentScreen} />
      <Screen name={ScreenNames.DETAIL_INCIDENT} component={IncidentDetailsScreen} />
      <Screen name={ScreenNames.CHAT} component={ChatScreen} />
    </Navigator>
  );
}

export default MainNavigator;
