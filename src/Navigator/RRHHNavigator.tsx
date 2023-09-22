import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Drawer,
  DrawerGroup,
  DrawerItem,
  IndexPath,
} from "@ui-kitten/components";
import { View } from "native-base";
import React, { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

import { AppPermissions } from "../Helpers/AppPermissions";
import { ScreenNames } from "../Helpers/ScreenNames";
import { useIsBoss } from "../hooks/useExpediente";
import useIncidents from "../hooks/useIncidents";
import { useHasPermissions } from "../hooks/usePermissions";
import { AuthState } from "../Redux/reducers/auth/loginReducer";
import { RootState } from "../Redux/reducers/rootReducer";
import CompensatoryTimeBalanceScreen from "../Screens/rrhh/Consults/CompensatoryTimeBalanceScreen";
import HomeConsultsScreen from "../Screens/rrhh/Consults/HomeConsultsScreen";
import MarksScreen from "../Screens/rrhh/Consults/MarksScreen";
import ReceiptOfPaymentScreen from "../Screens/rrhh/Consults/ReceiptOfPaymentScreen";
import VacationBalanceScreen from "../Screens/rrhh/Consults/VacationBalanceScreen";
import { DashboardRRHHScreen } from "../Screens/rrhh/DashBoardRRHHScreen";
import HomeExpedientsScreen from "../Screens/rrhh/Expendients/HomeExpedientsScreen";
import HomeAnnouncement from "../Screens/rrhh/News/HomeNewsScreen";
import { ProfilesScreen } from "../Screens/rrhh/Profile/ProfilesScreen";
import HomeQuizzesScreen from "../Screens/rrhh/Quizzes/HomeQuizzesScreen";
import FormRequestClinicScreen from "../Screens/rrhh/Requests/FormRequestClinicScreen";
import FormRequestConstanciaScreen from "../Screens/rrhh/Requests/FormRequestConstanciaScreen";
import FormRequestFreetimeCouponScreen from "../Screens/rrhh/Requests/FormRequestFreetimeCouponScreen";
import FormRequestPermisionScreen from "../Screens/rrhh/Requests/FormRequestPermisionScreen";
import FormRequestVacacionesScreen from "../Screens/rrhh/Requests/FormRequestVacacionesScreen";
import FormRequisitionNewPositionScreen from "../Screens/rrhh/Requests/FormRequisitionNewPositionScreen";
import FormRequisitionVacancyScreen from "../Screens/rrhh/Requests/FormRequisitionVacancyScreen";
import { HomePersonnelRequisitionsScreen } from "../Screens/rrhh/Requests/HomePersonnelRequisitionsScreen";
import { HomeRequestsScreen } from "../Screens/rrhh/Requests/HomeRequestsScreen";
import ListPendingApprovalRequestsScreen from "../Screens/rrhh/Requests/ListPendingApprovalRequestsScreen";
import { ListRequestScreens } from "../Screens/rrhh/Requests/ListRequestScreens";
import { ReporteClimometroScreen } from "../Screens/rrhh/Requests/ReporteClimometroScreen";
import { SurveyQuestionClimometroScreen } from "../Screens/rrhh/Requests/SurveyQuestionClimometroScreen";
import { SurveyQuestionScreen } from "../Screens/rrhh/Requests/SurveyQuestionScreen";
import { SurveyRequestsScreen } from "../Screens/rrhh/Requests/SurveyRequestsScreen";
import WebViewScreen from "../Screens/WebViewScreen";
import { DrawerHeader } from "./DrawerHeader";
import { NewsNavigator } from "./NewsNavigator";
import { PrivacyPolicyFooter } from "./PrivacyPolicyFooter";
import * as RootNavigation from "./RootNavigation";
import { SubstitutionRequisitionNavigator } from "./SubstitutionRequisitionNavigator";
import { VacancyRequisitionNavigator } from "./VacancyRequisitionNavigator";

const { Navigator, Screen, Group } = createDrawerNavigator();

// const renderHeader = (props: any) => {
//   const { userName } = props;
//   return (
//     <Layout style={{ paddingTop: top, flexDirection: 'row', alignItems: 'center' }} level="4">
//       <Avatar size="giant" source={require('../../assets/logo_app.png')} />
//       <Text status="info" style={{ paddingLeft: 10 }}>
//         {userName ?? 'Usuario'}
//       </Text>
//     </Layout>
//   );
// };

const DrawerContent = ({ navigation, state }: any) => {
  const auth: AuthState = useSelector((state: RootState) => state.auth.login);
  const [selectedIndex, setSelectedIndex] = useState<IndexPath>();
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
  const {
    NewsCategoies: { data: newsCategoies },
  } = useIncidents();

  useEffect(() => {
    setSelectedIndex(state.index);
  }, [state.index]);

  const { isBoss } = useIsBoss();

  return (
    <Drawer
      header={<DrawerHeader user={auth} />}
      ListFooterComponent={<PrivacyPolicyFooter />}
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}
      appearance="noDivider"
    >
      <DrawerItem
        title="Inicio"
        key={1}
        accessoryLeft={() => <Feather name="home" size={16} color="black" />}
        onPress={() => navigation.navigate(ScreenNames.DASHBOARD_RRHH)}
      />
      <DrawerItem
        title="Mi Expediente"
        key={2}
        accessoryLeft={() => <Feather name="user" size={16} color="black" />}
        onPress={() => navigation.navigate(ScreenNames.PROFILE)}
      />
      {/* <DrawerItem
        title="Dashboard"
        key={1}
        accessoryLeft={ChartIcon}
        onPress={() => navigation.navigate(ScreenNames.DASHBOARD_RRHH)}
      /> */}
      {/* <DrawerItem title="Chat" accessoryLeft={TicketIcon} onPress={() => navigation.navigate(ScreenNames.CHAT)} /> */}
      <DrawerGroup
        title="Solicitudes"
        accessoryLeft={() => (
          <FontAwesome5 name="wpforms" size={16} color="black" />
        )}
        accessoryRight={() => (
          <View mr={4}>
            <AntDesign name="down" size={10} color="black" />
          </View>
        )}
      >
        <DrawerItem
          key={3}
          title="Mis Solicitudes"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.LIST_REQUESTS)}
        />
        {isAuthorizer ? (
          <DrawerItem
            key={4}
            title="Solicitudes Por Aprobar"
            accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
            onPress={() =>
              navigation.navigate(ScreenNames.LIST_PENDING_APPROVAL_REQUESTS)
            }
          />
        ) : (
          <></>
        )}
        <DrawerItem
          key={5}
          title="Nueva Solicitud"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.HOME_REQUESTS)}
        />
      </DrawerGroup>
      <DrawerGroup
        title="Consultas"
        accessoryLeft={() => <Feather name="inbox" size={16} color="black" />}
        accessoryRight={() => (
          <View mr={4}>
            <AntDesign name="down" size={10} color="black" />
          </View>
        )}
      >
        <DrawerItem
          key={6}
          title="Recibos de Pago"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.RECEIPT_OF_PAYMENT)}
        />
        <DrawerItem
          key={7}
          title="Saldo de Vacaciones"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.VACATION_BALANCE)}
        />
        <DrawerItem
          key={8}
          title="Tiempo Compensatorio"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() =>
            navigation.navigate(ScreenNames.COMPENSATORY_TIME_BALANCE)
          }
        />
        <DrawerItem
          key={9}
          title="Control de Asistencia"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() => navigation.navigate(ScreenNames.MARKS)}
        />
      </DrawerGroup>
      {newsCategoies?.length > 0 ? (
        <DrawerGroup
          title="Noticias"
          accessoryLeft={() => (
            <Entypo name="open-book" size={16} color="black" />
          )}
          accessoryRight={() => (
            <View mr={4}>
              <AntDesign name="down" size={10} color="black" />
            </View>
          )}
        >
          {newsCategoies.map((category, index) => (
            <DrawerItem
              key={`900 + ${index}${category.id}`}
              title={category.name}
              accessoryLeft={() => (
                <Entypo name="list" size={16} color="black" />
              )}
              // onPress={() =>
              //   navigation.navigate(ScreenNames.HOME_NEWS, {
              //     categoryId: category.id,
              //     categoryName: category.name,
              //   })
              // }
              onPress={() =>
                RootNavigation.navigate(ScreenNames.HOME_NEWS, {
                  screen: ScreenNames.NEWS_LIST,
                  params: {
                    categoryId: category.id,
                    categoryName: category.name,
                  },
                })
              }
            />
          ))}
        </DrawerGroup>
      ) : (
        <DrawerItem
          key={10}
          title="Noticias"
          accessoryLeft={() => (
            <Entypo name="open-book" size={16} color="black" />
          )}
          onPress={() => navigation.navigate(ScreenNames.NEWS_LIST)}
        />
      )}
      <DrawerItem
        key={11}
        title="Canjeo de Puntos"
        accessoryLeft={() => (
          <SimpleLineIcons name="diamond" size={16} color="black" />
        )}
        onPress={() => navigation.navigate(ScreenNames.VIRTUAL_STORE)}
      />
      <DrawerGroup
        title="Evaluaciones"
        accessoryLeft={() => (
          <Entypo name="open-book" size={16} color="black" />
        )}
        accessoryRight={() => (
          <View mr={4}>
            <AntDesign name="down" size={10} color="black" />
          </View>
        )}
      >
        <DrawerItem
          key={12}
          title="Evaluaciones"
          accessoryLeft={() => (
            <SimpleLineIcons name="list" size={16} color="black" />
          )}
          onPress={() => navigation.navigate(ScreenNames.SURVEY)}
        />
        {isBoss == true ? (
          <DrawerItem
            key={13}
            title="Reporte Climometro"
            accessoryLeft={() => (
              <SimpleLineIcons name="list" size={16} color="black" />
            )}
            onPress={() => navigation.navigate(ScreenNames.REPORTECLIMOMETRO)}
          />
        ) : (
          <></>
        )}
      </DrawerGroup>
    </Drawer>
  );
};

function RRHHNavigator() {
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
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  return (
    <Navigator
      screenOptions={() => ({
        headerStyle: {
          elevation: 0,
          shadowColor: "transparent",
        },
        headerShown: false,
        cardStyle: {
          backgroundColor: "white",
        },
        drawerType: "slide",
        unmountOnBlur: false,
      })}
      initialRouteName={ScreenNames.DASHBOARD_RRHH}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      {Platform.OS !== "web" && (
        <Screen
          name={ScreenNames.DASHBOARD_RRHH}
          component={DashboardRRHHScreen}
        />
      )}
      <Screen name={ScreenNames.HOME_REQUESTS} component={HomeRequestsScreen} />
      <Screen name={ScreenNames.PROFILE} component={ProfilesScreen} />
      <Screen name={ScreenNames.SURVEY} component={SurveyRequestsScreen} />
      <Screen
        name={ScreenNames.REPORTECLIMOMETRO}
        component={ReporteClimometroScreen}
      />
      <Screen name={ScreenNames.ENCUESTA} component={SurveyQuestionScreen} />
      <Screen
        name={ScreenNames.CLIMOMETRO}
        component={SurveyQuestionClimometroScreen}
      />
      <Screen name={ScreenNames.WEBVIEWSCREEN} component={WebViewScreen} />
      <Screen
        name={ScreenNames.HOME_ANNOUNCEMENTS}
        component={HomeAnnouncement}
      />
      <Screen name={ScreenNames.HOME_CONSULTS} component={HomeConsultsScreen} />
      <Screen
        name={ScreenNames.COMPENSATORY_TIME_BALANCE}
        component={CompensatoryTimeBalanceScreen}
      />
      <Screen name={ScreenNames.MARKS} component={MarksScreen} />
      <Screen
        name={ScreenNames.RECEIPT_OF_PAYMENT}
        component={ReceiptOfPaymentScreen}
      />
      <Screen
        name={ScreenNames.VACATION_BALANCE}
        component={VacationBalanceScreen}
      />
      <Screen
        name={ScreenNames.HOME_EXPEDIENTS}
        component={HomeExpedientsScreen}
      />
      <Screen name={ScreenNames.HOME_QUIZZES} component={HomeQuizzesScreen} />
      <Screen name={ScreenNames.LIST_REQUESTS} component={ListRequestScreens} />
      <Screen
        name={ScreenNames.FORM_REQUEST_COUPON_FREETIME}
        component={FormRequestFreetimeCouponScreen}
      />
      <Screen
        name={ScreenNames.FORM_REQUEST_CONSTANCIA}
        component={FormRequestConstanciaScreen}
      />
      <Screen
        name={ScreenNames.FORM_REQUEST_PERMISION}
        component={FormRequestPermisionScreen}
      />
      <Screen
        name={ScreenNames.FORM_REQUEST_VACACIONES}
        component={FormRequestVacacionesScreen}
      />
      <Screen
        name={ScreenNames.FORM_REQUEST_CLINIC}
        component={FormRequestClinicScreen}
      />
      <Screen
        name={ScreenNames.HOME_PERSONNEL_REQUISITIONS}
        component={HomePersonnelRequisitionsScreen}
      />
      <Screen
        name={ScreenNames.REQUISITION_NEW_POSITION}
        component={FormRequisitionNewPositionScreen}
      />
      <Screen
        name={ScreenNames.REQUISITION_SUBSTITUTION_NAVIGATOR}
        component={SubstitutionRequisitionNavigator}
      />
      <Screen
        name={ScreenNames.REQUISITION_VACANCY_NAVIGATOR}
        component={VacancyRequisitionNavigator}
      />
      <Screen
        name={ScreenNames.REQUISITION_VACANCY}
        component={FormRequisitionVacancyScreen}
      />
      <Screen name={ScreenNames.HOME_NEWS} component={NewsNavigator} />
      {isAuthorizer && (
        <Screen
          name={ScreenNames.LIST_PENDING_APPROVAL_REQUESTS}
          component={ListPendingApprovalRequestsScreen}
        />
      )}
    </Navigator>
  );
}

export default RRHHNavigator;
