import React, {useEffect} from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {UserMainContent} from "../UserMainContent";
import GeneralData from "./General/generalData";
import {IExpExpediente} from "../../../interfaces/rrhh/IExpExpediente";
import DirectionCreateForm from "./Direction/DirectionCreateForm";
import EmergencyContactsListPage from "./EmergencyContacts/EmergencyContactsListPage";
import DirectionListPage from "./Direction/DirectionListPage";
import FamiliaresListPage from "./FaeFamiliaresExpediente/FamiliaresListPage";
import HubbiesListPage from "./AfeAficionesExpediente/HubbiesListPage";
import AdditionalData from "./General/additionalData";
import {Button, Icon, View, Text, Spinner, Fab, Box} from "native-base";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import {Alert, Dimensions} from "react-native";
import {trackForMutations} from "@reduxjs/toolkit/dist/immutableStateInvariantMiddleware";
import {queryClient} from "../../../Configs/QueryClient";
import {QueryKeys} from "../../../Helpers/QueryKeys";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import DirectionCreatePage from "./Direction/DirectionCreatePage";
import EmergencyContactsCreatePage from "./EmergencyContacts/EmergencyContactsCreatePage";
import FamiliaresCreatePage from "./FaeFamiliaresExpediente/FamiliaresCreatePage";
import HubbiesCreatePage from "./AfeAficionesExpediente/HubbiesCreatePage";
import ActionButton from "react-native-action-button";
import {navigationRef} from "../../../Navigator/RootNavigation";
import {CommonActions, NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../Redux/reducers/rootReducer";
import useAlert from "../../../hooks/useAlert";
import {setChange} from "../../../Redux/reducers/rrhh/expedienteSlice";

const Tab = createMaterialTopTabNavigator();
const stack1 = createNativeStackNavigator();
const stack2 = createNativeStackNavigator();
const stack3 = createNativeStackNavigator();
const stack4 = createNativeStackNavigator();

export const ProfileData = ({navigation}) => {
  // const alert = useAlert();
  const change = useSelector((state: RootState) => state.expediente.change);
  // const dispatch = useDispatch();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        removeClippedSubviews: true,
        animationEnabled: false,
        swipeEnabled: false,
        // tabBarIndicator: () => null,
        tabBarPressColor: "transparent",
        tabBarStyle: {
          backgroundColor: "#F2F8FC",
        },
        flex: 1,
        lazy: true,
        unmountOnBlur: true,
        lazyPlaceholder: () => (
          <View
            bg={"white"}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner size={"lg"} />
            <Text color={"#0077CD"} fontSize={"2xl"}>
              Cargando...
            </Text>
          </View>
        ),
      })}
      screenListeners={({route, navigation}) => ({
        // focus: () => {
        //   console.log("focus");
        // },
        // Navegacion entre tabs
        tabPress: (e) => {
          if (!change) {
            return;
          }
          if (change) {
            e.preventDefault();
          }
          // alert.show({
          //   onPress: () => {
          //     dispatch(setChange(false));
          //     navigation.dispatch(CommonActions.navigate({ name: route.name }));
          //     dispatch(setChange(false));
          //   },
          //   isOpen: true,
          // });
        },
      })}
    >
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({focused}) => (
            <Icon
              as={Feather}
              color={focused ? "#0077CD" : "#C0C0C0"}
              size={8}
              name="user"
            />
          ),
        }}
        name="General"
        children={() => <GeneralData />}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({focused}) => (
            <Icon
              as={Entypo}
              color={focused ? "#0077CD" : "#C0C0C0"}
              size={8}
              name="location"
            />
          ),
        }}
        name="Address"
        component={DirectionStack}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({focused}) => (
            <Icon
              as={AntDesign}
              color={focused ? "#0077CD" : "#C0C0C0"}
              size={8}
              name="contacts"
            />
          ),
        }}
        name="Emergencia"
        component={EmergencyStack}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({focused}) => (
            <Icon
              as={MaterialIcons}
              color={focused ? "#0077CD" : "#C0C0C0"}
              size={8}
              name="family-restroom"
            />
          ),
        }}
        name="Familiares"
        component={FamiliaresStack}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({focused}) => (
            <Icon
              as={Ionicons}
              color={focused ? "#0077CD" : "#C0C0C0"}
              size={8}
              name="football"
            />
          ),
        }}
        name="Aficiones"
        component={AficionesStack}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({focused}) => (
            <Icon
              as={AntDesign}
              color={focused ? "#0077CD" : "#C0C0C0"}
              size={8}
              name="form"
            />
          ),
        }}
        name="Adicional"
        children={() => <AdditionalData />}
      />
    </Tab.Navigator>
  );
};

const DirectionStack = () => {
  return (
    <stack1.Navigator
      initialRouteName="Direcciones"
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack1.Screen name="Direcciones" component={DirectionListPage} />
      <stack1.Screen name="Direccion" component={DirectionCreatePage} />
    </stack1.Navigator>
  );
};

const EmergencyStack = () => {
  return (
    <stack2.Navigator
      initialRouteName="Contactos"
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack2.Screen name="Contactos" component={EmergencyContactsListPage} />
      <stack2.Screen name="Contacto" component={EmergencyContactsCreatePage} />
    </stack2.Navigator>
  );
};

const FamiliaresStack = () => {
  return (
    <stack3.Navigator
      initialRouteName="Fams"
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack3.Screen name="Fams" component={FamiliaresListPage} />
      <stack3.Screen name="Familiar" component={FamiliaresCreatePage} />
    </stack3.Navigator>
  );
};

const AficionesStack = () => {
  return (
    <stack4.Navigator
      initialRouteName="Hubbies"
      screenOptions={{
        headerShown: false,
      }}
    >
      <stack4.Screen name="Hubbies" component={HubbiesListPage} />
      <stack4.Screen name="Hubby" component={HubbiesCreatePage} />
    </stack4.Navigator>
  );
};
