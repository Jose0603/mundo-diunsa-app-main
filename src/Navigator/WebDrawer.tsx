import {
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import {
  Drawer,
  DrawerGroup,
  DrawerItem,
  IndexPath,
} from "@ui-kitten/components";
import React from "react";
import {useSelector} from "react-redux";
import {AppPermissions} from "../Helpers/AppPermissions";
import {ScreenNames} from "../Helpers/ScreenNames";
import {useHasPermissions} from "../hooks/usePermissions";
import {AuthState} from "../Redux/reducers/auth/loginReducer";
import {RootState} from "../Redux/reducers/rootReducer";

import {DrawerHeader} from "./DrawerHeader";
import {PrivacyPolicyFooter} from "./PrivacyPolicyFooter";
import * as RootNavigation from "./RootNavigation";

export const WebDrawer = () => {
  const user: AuthState = useSelector((state: RootState) => state.auth.login);
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

  return (
    <Drawer
      header={<DrawerHeader user={user} />}
      ListFooterComponent={<PrivacyPolicyFooter />}
      appearance="noDivider"
    >
      <DrawerItem
        title="Inicio"
        key={10}
        accessoryLeft={() => <Feather name="home" size={16} color="black" />}
        onPress={() => RootNavigation.navigate(ScreenNames.MAIN_MENU)}
      />
      <DrawerItem
        title="Recursos Humanos"
        key={0}
        accessoryLeft={() => <Feather name="users" size={16} color="black" />}
        onPress={() => RootNavigation.navigate(ScreenNames.RRHH)}
      />
      <DrawerItem
        title="Mantenimiento"
        key={0}
        accessoryLeft={() => <Feather name="users" size={16} color="black" />}
        onPress={() => RootNavigation.navigate(ScreenNames.MAINTENANCE)}
      />
      <DrawerGroup
        title="Solicitudes"
        accessoryLeft={() => (
          <FontAwesome5 name="wpforms" size={16} color="black" />
        )}
      >
        {/* <DrawerItemLink
              key={1}
              title="Mis Solicitudes"
              accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
              to={{ screen: ScreenNames.RRHH, params: { screen: ScreenNames.LIST_REQUESTS } }}
            /> */}
        <DrawerItem
          key={1}
          title="Mis Solicitudes"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() =>
            RootNavigation.navigate(ScreenNames.RRHH, {
              screen: ScreenNames.LIST_REQUESTS,
            })
          }
        />
        {isAuthorizer && (
          <DrawerItem
            key={2}
            title="Solicitudes Por Aprobar"
            accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
            onPress={() =>
              RootNavigation.navigate(ScreenNames.RRHH, {
                screen: ScreenNames.LIST_PENDING_APPROVAL_REQUESTS,
              })
            }
          />
        )}
        <DrawerItem
          key={3}
          title="Nueva Solicitud"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() =>
            RootNavigation.navigate(ScreenNames.RRHH, {
              screen: ScreenNames.HOME_REQUESTS,
            })
          }
        />
      </DrawerGroup>
      <DrawerGroup
        title="Consultas"
        accessoryLeft={() => <Feather name="inbox" size={16} color="black" />}
      >
        <DrawerItem
          key={4}
          title="Recibos de Pago"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() =>
            RootNavigation.navigate(ScreenNames.RRHH, {
              screen: ScreenNames.RECEIPT_OF_PAYMENT,
            })
          }
        />
        <DrawerItem
          key={5}
          title="Saldo de Vacaciones"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() =>
            RootNavigation.navigate(ScreenNames.RRHH, {
              screen: ScreenNames.VACATION_BALANCE,
            })
          }
        />
        <DrawerItem
          key={6}
          title="Tiempo Compensatorio"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() =>
            RootNavigation.navigate(ScreenNames.RRHH, {
              screen: ScreenNames.COMPENSATORY_TIME_BALANCE,
            })
          }
        />
        <DrawerItem
          key={7}
          title="Control de Asistencia"
          accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
          onPress={() =>
            RootNavigation.navigate(ScreenNames.RRHH, {
              screen: ScreenNames.MARKS,
            })
          }
        />
      </DrawerGroup>
      <DrawerItem
        key={8}
        title="Noticias"
        accessoryLeft={() => <Entypo name="list" size={16} color="black" />}
        onPress={() =>
          RootNavigation.navigate(ScreenNames.RRHH, {
            screen: ScreenNames.HOME_NEWS,
          })
        }
      />
      <DrawerItem
        key={9}
        title="Canjeo de Puntos"
        accessoryLeft={() => (
          <SimpleLineIcons name="diamond" size={16} color="black" />
        )}
        onPress={() => RootNavigation.navigate(ScreenNames.VIRTUAL_STORE)}
      />
    </Drawer>
  );
};
