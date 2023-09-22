import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { UserMainContent } from "../UserMainContent";
import GeneralData from "../Profile/General/generalData";
import { IExpExpediente } from "../../../interfaces/rrhh/IExpExpediente";
import DirectionCreateForm from "../Profile/Direction/DirectionCreateForm";
import EmergencyContactsListPage from "../Profile/EmergencyContacts/EmergencyContactsListPage";
import DirectionListPage from "../Profile/Direction/DirectionListPage";
import FamiliaresListPage from "../Profile/FaeFamiliaresExpediente/FamiliaresListPage";
import HubbiesListPage from "../Profile/AfeAficionesExpediente/HubbiesListPage";
import AdditionalData from "../Profile/General/additionalData";
import { Button, Icon, View, Text, Spinner } from "native-base";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { trackForMutations } from "@reduxjs/toolkit/dist/immutableStateInvariantMiddleware";
import { queryClient } from "../../../Configs/QueryClient";
import { QueryKeys } from "../../../Helpers/QueryKeys";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DirectionCreatePage from "../Profile/Direction/DirectionCreatePage";
import EmergencyContactsCreatePage from "../Profile/EmergencyContacts/EmergencyContactsCreatePage";
import FamiliaresCreatePage from "../Profile/FaeFamiliaresExpediente/FamiliaresCreatePage";
import HubbiesCreatePage from "../Profile/AfeAficionesExpediente/HubbiesCreatePage";

const Tab = createMaterialTopTabNavigator();
const stack1 = createNativeStackNavigator();
const stack2 = createNativeStackNavigator();
const stack3 = createNativeStackNavigator();
const stack4 = createNativeStackNavigator();

export const ProfileData = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="General"
      screenOptions={({ route }) => ({
        removeClippedSubviews: true,
        animationEnabled: false,
        backgroundColor: "#F2F8FC",
        swipeEnabled: false,
        tabBarScrollEnabled: true,
        lazy: true,
        tabBarIndicator: () => null,
        tabBarItemStyle: {
          width: "auto",
          // alignItems: "flex-start",
          // height: Dimensions.get("window").height * 0.14,
          marginBottom: "3%",
        },
        tabBarPressColor: "transparent",
        tabBarStyle: {
          backgroundColor: "#F2F8FC",
        },
        unmountOnBlur: true,
        lazyPlaceholder: () => (
          <View
            bg={"white"}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Spinner size={"lg"} />
            <Text color={"#0077CD"} fontSize={"2xl"}>
              Cargando...
            </Text>
          </View>
        ),
        // lazyPreloadDistance: 5,
      })}
      overScrollMode="always"
    >
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({ focused }) => (
            <Button
              w={130}
              borderColor={focused ? "#0077CD" : "#C0C0C0"}
              borderWidth={2}
              bgColor={"transparent"}
              borderRadius={10}
              justifyContent={"flex-start"}
            >
              <View>
                <Icon
                  as={Feather}
                  color={focused ? "#0077CD" : "#C0C0C0"}
                  size={8}
                  name="user"
                />
                <Text color={focused ? "#0077CD" : "#C0C0C0"}>General</Text>
              </View>
            </Button>
          ),
        }}
        name="General"
        children={() => <GeneralData />}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({ focused }) => (
            <Button
              w={130}
              borderColor={focused ? "#0077CD" : "#C0C0C0"}
              borderWidth={2}
              bgColor={"transparent"}
              borderRadius={10}
              justifyContent={"flex-start"}
            >
              <Icon
                as={Entypo}
                color={focused ? "#0077CD" : "#C0C0C0"}
                size={8}
                name="location"
              />
              <Text color={focused ? "#0077CD" : "#C0C0C0"}>Dirección</Text>
            </Button>
          ),
        }}
        name="Dirección"
        // children={() => <DirectionListPage />}
        component={DirectionStack}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({ focused }) => (
            <Button
              w={130}
              borderColor={focused ? "#0077CD" : "#C0C0C0"}
              borderWidth={2}
              bgColor={"transparent"}
              borderRadius={10}
              justifyContent={"flex-start"}
            >
              <Icon
                as={AntDesign}
                color={focused ? "#0077CD" : "#C0C0C0"}
                size={8}
                name="contacts"
              />
              <Text color={focused ? "#0077CD" : "#C0C0C0"}>Emergencia</Text>
            </Button>
          ),
        }}
        name="Emergencia"
        // children={() => <EmergencyContactsListPage />}
        component={EmergencyStack}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({ focused }) => (
            <Button
              w={130}
              borderColor={focused ? "#0077CD" : "#C0C0C0"}
              borderWidth={2}
              bgColor={"transparent"}
              borderRadius={10}
              justifyContent={"flex-start"}
            >
              <Icon
                as={MaterialIcons}
                color={focused ? "#0077CD" : "#C0C0C0"}
                size={8}
                name="family-restroom"
              />
              <Text color={focused ? "#0077CD" : "#C0C0C0"}>Familiares</Text>
            </Button>
          ),
        }}
        name="Familiares"
        // children={() => <FamiliaresListPage />}
        component={FamiliaresStack}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({ focused }) => (
            <Button
              w={130}
              borderColor={focused ? "#0077CD" : "#C0C0C0"}
              borderWidth={2}
              bgColor={"transparent"}
              borderRadius={10}
              justifyContent={"flex-start"}
            >
              <Icon
                as={Ionicons}
                color={focused ? "#0077CD" : "#C0C0C0"}
                size={8}
                name="football"
              />
              <Text color={focused ? "#0077CD" : "#C0C0C0"}>Aficiones</Text>
            </Button>
          ),
        }}
        name="Aficiones"
        // children={() => <HubbiesListPage />}
        component={AficionesStack}
      />
      <Tab.Screen
        options={{
          animationEnabled: false,
          tabBarLabel: ({ focused }) => (
            <Button
              w={130}
              borderColor={focused ? "#0077CD" : "#C0C0C0"}
              borderWidth={2}
              bgColor={"transparent"}
              borderRadius={10}
              justifyContent={"flex-start"}
            >
              <Icon
                as={AntDesign}
                color={focused ? "#0077CD" : "#C0C0C0"}
                size={8}
                name="form"
              />
              <Text color={focused ? "#0077CD" : "#C0C0C0"}>Adicional</Text>
            </Button>
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
