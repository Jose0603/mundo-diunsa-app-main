import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ScreenNames } from '../Helpers/ScreenNames';
import ListVacancies from '../Screens/rrhh/Requests/ListVacancies';
import FormRequisitionVacancyScreen from '../Screens/rrhh/Requests/FormRequisitionVacancyScreen';

const { Navigator, Screen, Group } = createNativeStackNavigator();

export const VacancyRequisitionNavigator = ({ route }: any) => {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName={ScreenNames.REQUISITION_VACANCY}>
      <Screen name={ScreenNames.REQUISITION_VACANCY} component={FormRequisitionVacancyScreen} />
      <Group
        screenOptions={{
          presentation: 'modal',
        }}
      >
        <Screen name={ScreenNames.AVAILABLE_VACANCIES} component={ListVacancies} />
      </Group>
    </Navigator>
  );
};
