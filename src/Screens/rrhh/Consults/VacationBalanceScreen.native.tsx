import { DrawerScreenProps } from '@react-navigation/drawer';
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import moment from 'moment';
import { Box, HStack, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { Row, Table } from 'react-native-table-component';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { Loading } from '../../../Components/Loading';
import { NoData } from '../../../Components/NoData';
import TopMainBar from '../../../Components/TopMainBar';
import { QueryKeys } from '../../../Helpers/QueryKeys';
import { AuthState } from '../../../Redux/reducers/auth/loginReducer';
import { GetEnjoyedVacations, GetVacationPeriods } from '../../../Services/rrhh/Vacations';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

const VacationBalanceScreen = ({ navigation }: IProps) => {
  const MenuIcon = (props: any) => <Icon {...props} name="menu-2-outline" />;
  const layout = useWindowDimensions();

  const user: AuthState = useSelector((state: any) => state.auth.login);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'periodos', title: 'Periodos' },
    { key: 'dias', title: 'Dias' },
  ]);

  const [showingPeriods, setShowingPeriods] = useState<string>();

  const {
    isLoading,
    isError,
    error,
    isFetching,
    data: periods,
  } = useQuery([QueryKeys.VACATION_PERIODS, user.employeeId], () => GetVacationPeriods(user.employeeId));

  const { isLoading: loadingDays, data: days } = useQuery([QueryKeys.VACATION_ENJOYED_DAYS], () =>
    GetEnjoyedVacations(user.employeeId)
  );

  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction icon={MenuIcon} onPress={() => navigation.toggleDrawer()} />
    </Box>
  );

  const shouldLoadComponent = (index) => index === index;

  useEffect(() => {
    if (periods && periods.length > 0) {
      setShowingPeriods(
        `${moment(periods[periods.length - 1].desde).format('YYYY')} - ${moment(periods[0].hasta).format('YYYY')}`
      );
    }
  }, [periods]);

  const PeriodsTab = ({ showingPeriods, isLoading, periods }: any) => {
    return (
      <ScrollView
        _contentContainerStyle={{
          alignItems: 'center',
        }}
      >
        <Box
          shadow="4"
          borderColor={'gray.400'}
          justifyContent="center"
          backgroundColor="#fff"
          borderRadius={5}
          m={5}
          p={4}
        >
          {periods && periods.length && periods.length > 0 && (
            <VStack justifyContent="center" alignItems="center" pb={4}>
              <Text
                bold
                color={'blue.600'}
                _dark={{
                  color: 'warmGray.200',
                }}
                fontSize="2xl"
              >
                Mis Vacaciones
              </Text>
              <Text
                bold
                color={'blue.600'}
                _dark={{
                  color: 'warmGray.200',
                }}
                fontSize="2xl"
              >
                Periodo: {showingPeriods}
              </Text>
            </VStack>
          )}
          {isLoading ? (
            <Loading message="Cargando Vacaciones..." isFlex />
          ) : (
            <>
              {periods && periods.length && periods.length > 0 ? (
                <>
                  <ScrollView horizontal={true}>
                    <Table borderStyle={{ borderColor: 'transparent' }}>
                      <Row
                        data={['Desde', 'Hasta', 'Dias Gozados', 'Dias Saldo']}
                        widthArr={[100, 100, 100, 100]}
                        style={styles.head}
                      />
                      {periods.map((period, index) => {
                        let values = Object.values(period);
                        values[0] = moment(values[0]).format('DD MMM YYYY');
                        values[1] = moment(values[1]).format('DD MMM YYYY');
                        return (
                          <Row
                            key={index}
                            data={values}
                            widthArr={[100, 100, 100, 100]}
                            style={[styles.row, index % 2 && { backgroundColor: '#f6f8fa' }]}
                          />
                        );
                      })}
                    </Table>
                  </ScrollView>
                  <HStack justifyContent="space-between" alignItems="center" pr={6} pt={4}>
                    <Text
                      bold
                      color={'gray.600'}
                      _dark={{
                        color: 'warmGray.200',
                      }}
                      fontSize="md"
                    >
                      Total de dias disponibles:
                    </Text>
                    <Text
                      bold
                      color={'blue.600'}
                      _dark={{
                        color: 'warmGray.200',
                      }}
                      fontSize="md"
                    >
                      {periods && periods.length && periods.length > 0
                        ? periods.map((item) => item.saldo).reduce((prev, next) => prev + next)
                        : 0}
                    </Text>
                  </HStack>
                </>
              ) : (
                <NoData message="No hay datos para mostrar" />
              )}
            </>
          )}
        </Box>
      </ScrollView>
    );
  };
  const DaysTab = ({ loadingDays, days }: any) => {
    return (
      <ScrollView
        _contentContainerStyle={{
          alignItems: 'center',
        }}
      >
        <Box
          shadow="4"
          borderColor={'gray.400'}
          justifyContent="center"
          backgroundColor="#fff"
          borderRadius={5}
          m={5}
          p={4}
        >
          {days && days.length > 0 && (
            <VStack justifyContent="center" alignItems="center" pb={4}>
              <Text
                bold
                color={'blue.600'}
                _dark={{
                  color: 'warmGray.200',
                }}
                fontSize="2xl"
              >
                Mis días de Vacaciones
              </Text>
            </VStack>
          )}
          {loadingDays ? (
            <Loading message="Cargando Días de Vacaciones..." isFlex />
          ) : (
            <>
              {days && days.length && days.length > 0 ? (
                <ScrollView horizontal={true}>
                  <Table borderStyle={{ borderColor: 'transparent' }}>
                    <Row
                      data={['Desde', 'Hasta', 'Días', '¿Se pagaron?']}
                      widthArr={[100, 100, 100, 100]}
                      style={styles.head}
                    />
                    {days.map((period, index) => {
                      let values = Object.values(period);
                      values[0] = moment(values[0]).format('DD MMM YYYY');
                      values[1] = moment(values[1]).format('DD MMM YYYY');
                      values[3] = values[3] ? 'Si' : 'No';
                      return (
                        <Row
                          key={index}
                          data={values}
                          widthArr={[100, 100, 100, 100]}
                          style={[styles.row, index % 2 && { backgroundColor: '#f6f8fa' }]}
                        />
                      );
                    })}
                  </Table>
                </ScrollView>
              ) : (
                <NoData message="No hay datos para mostrar" />
              )}
            </>
          )}
        </Box>
      </ScrollView>
    );
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      renderLabel={({ route }) => <Text style={[{ color: 'black', margin: 8 }]}>{route.title}</Text>}
      indicatorStyle={{ backgroundColor: '#2563EB' }}
      style={[{ backgroundColor: '#fff' }, { width: Platform.OS === 'web' ? (layout.width * 75) / 100 : layout.width }]}
      scrollEnabled={true}
      tabStyle={{ width: Platform.OS === 'web' ? (layout.width * 75) / 100 / 2 : layout.width / 2 }}
    />
  );

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'periodos':
        return <PeriodsTab showingPeriods={showingPeriods} isLoading={isLoading} periods={periods} />;
      case 'dias':
        return <DaysTab loadingDays={loadingDays} days={days} />;

      default:
        return null;
    }
  };

  return (
    <Box safeArea backgroundColor="#fff" flex={1}>
      {/* <TopNavigation
        alignment="center"
        title="Mis Vacaciones"
        // subtitle="Consulta a detalle tus vacaciones"
        accessoryLeft={renderLeftActions}
      /> */}
      <TopMainBar showBack showMenu={false} />
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={{ width: layout.width }}
      />
    </Box>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff', padding: 5 },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: { height: 28, margin: 5, paddingTop: 5 },
  text: { textAlign: 'center' },
});
export default VacationBalanceScreen;
