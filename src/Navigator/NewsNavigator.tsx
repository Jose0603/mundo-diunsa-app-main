import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ScreenNames } from "../Helpers/ScreenNames";
import HomeAnnouncementScreen from "../Screens/rrhh/News/HomeNewsScreen";
import AnnouncementDetailScreen from "../Screens/rrhh/News/NewsDetailScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export const NewsNavigator = ({ route }: any) => {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={ScreenNames.NEWS_LIST}
    >
      <Screen
        name={ScreenNames.NEWS_LIST}
        component={HomeAnnouncementScreen}
        // initialParams={{
        //   categoryId: route?.params?.categoryId,
        //   // categoryName: route?.params?.categoryName,
        // }}
      />
      <Screen
        name={ScreenNames.NEWS_DETAIL}
        component={AnnouncementDetailScreen}
      />
    </Navigator>
  );
};
