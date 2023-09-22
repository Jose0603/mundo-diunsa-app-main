import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ScreenNames } from '../Helpers/ScreenNames';
import FormRequisitionSubstitutionScreen from '../Screens/rrhh/Requests/FormRequisitionSubstitutionScreen';
import ListActiveEmployees from '../Screens/rrhh/Requests/ListActiveEmployees';

const { Navigator, Screen, Group } = createNativeStackNavigator();

export const SubstitutionRequisitionNavigator = ({ route }: any) => {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName={ScreenNames.REQUISITION_SUBSTITUTION}>
      <Screen name={ScreenNames.REQUISITION_SUBSTITUTION} component={FormRequisitionSubstitutionScreen} />
      <Group
        screenOptions={{
          presentation: 'modal',
        }}
      >
        <Screen name={ScreenNames.ACTIVE_EMPLOYEES} component={ListActiveEmployees} />
      </Group>
    </Navigator>
  );
};
