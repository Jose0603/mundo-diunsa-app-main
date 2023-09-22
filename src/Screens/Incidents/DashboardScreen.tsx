import React, { useCallback, useState } from 'react';
import { RefreshControl, useWindowDimensions, View } from 'react-native';
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import {
  Box,
  Fab,
  FlatList,
  HStack,
  VStack,
  Spacer,
  Badge,
  Divider,
  Text,
  Pressable,
  AddIcon,
  Select,
  CheckIcon,
  Button,
  useDisclose,
  Heading,
  Center,
  ScrollView,
} from 'native-base';
import { ScreenNames } from '../../Helpers/ScreenNames';
import useIncidents from '../../hooks/useIncidents';
import moment from 'moment';
import { QueryKeys } from '../../Helpers/QueryKeys';
import { useQuery } from 'react-query';
import { DashboardData } from '../../Services/incidents/Incidents';
import { Loading } from '../../Components/Loading';
import { AntDesign } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { AuthState } from '../../Redux/reducers/auth/loginReducer';
import { SocketState } from '../../Redux/reducers/sockets/socketReducer';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export enum FILTERDATE {
  DAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
}

export const DashboardScreen = ({ navigation }: IProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(FILTERDATE.DAY);

  const { isOpen, onOpen, onClose } = useDisclose();
  const { RefetchQuery } = useIncidents();
  const user: AuthState = useSelector((state: any) => state.auth.login);
  const sockets: SocketState = useSelector((state: any) => state.socket.sockets);

  const {
    isLoading,
    isError,
    error,
    data: incidentsData,
    isFetching,
    isPreviousData,
  } = useQuery([QueryKeys.ASSIGNEE_DASHBOARD, selectedDate], () => DashboardData(selectedDate));

  const MenuIcon = (props: any) => <Icon {...props} name="menu-2-outline" />;

  const renderRightActions = () => (
    <>
      <Pressable
        onPress={async () => {
          // console.log('Hello world');
          navigation.navigate(ScreenNames.HOME_INCIDENTS);

          // let res = await pickImage();
          // if (res) FileUpload(res);
        }}
      >
        <Badge colorScheme="blue" rounded="lg">
          <VStack alignItems="center">
            <AddIcon size="3" />
            <Text px={1}>incidencias</Text>
          </VStack>
        </Badge>
        {/* <Box flexDirection="row" alignItems="center">
          <TopNavigationAction icon={PlusIcon} />
        </Box> */}
      </Pressable>
      {/* <Box flexDirection="row" alignItems="center">
        <Text category="s2">Enviar</Text>
        <TopNavigationAction icon={CheckMarkIcon} />
      </Box> */}
    </>
  );

  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction icon={MenuIcon} onPress={() => navigation.toggleDrawer()} />
    </Box>
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await RefetchQuery(QueryKeys.ASSIGNEE_DASHBOARD);
    setRefreshing(false);
  }, []);

  if (isLoading && !isPreviousData) {
    return <Loading />;
  }

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0.4,
    backgroundGradientTo: '#000',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  // const data = {
  //   labels: ['Swim', 'Bike', 'Run'], // optional
  //   data: [0.4, 0.6, 0.8],
  // };
  const data = [
    {
      name: 'Finalizados',
      population: 21500000,
      color: 'rgba(131, 167, 234, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Pendientes',
      population: 28000000,
      color: '#233234',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'En Proceso',
      population: 527612,
      color: 'red',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <Box flex={1} safeArea backgroundColor="#fff">
      <TopNavigation
        alignment="center"
        title="Dashboard - Incidencias"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
        // accessoryRight={renderRightActions}
      />
      <HStack mx={8} rounded="full" backgroundColor="#DAF2FF" justifyContent="space-between">
        <Pressable
          backgroundColor={selectedDate === FILTERDATE.DAY ? '#3F86F7' : '#DAF2FF'}
          rounded="full"
          p={2}
          w="33%"
          alignItems="center"
          onPress={() => {
            setSelectedDate(FILTERDATE.DAY);
          }}
        >
          <Text px={1} color={selectedDate === FILTERDATE.DAY ? '#fff' : '#7F7F7F'} bold>
            Hoy
          </Text>
        </Pressable>
        <Pressable
          backgroundColor={selectedDate === FILTERDATE.WEEK ? '#3F86F7' : '#DAF2FF'}
          rounded="full"
          p={2}
          w="33%"
          alignItems="center"
          onPress={() => {
            setSelectedDate(FILTERDATE.WEEK);
          }}
        >
          <Text px={1} color={selectedDate === FILTERDATE.WEEK ? '#fff' : '#7F7F7F'} bold>
            Semana
          </Text>
        </Pressable>
        <Pressable
          backgroundColor={selectedDate === FILTERDATE.MONTH ? '#3F86F7' : '#DAF2FF'}
          rounded="full"
          p={2}
          w="33%"
          alignItems="center"
          onPress={() => {
            setSelectedDate(FILTERDATE.MONTH);
          }}
        >
          <Text px={1} color={selectedDate === FILTERDATE.MONTH ? '#fff' : '#7F7F7F'} bold>
            Mes
          </Text>
        </Pressable>
      </HStack>
      <ScrollView flex={1} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {incidentsData && (
          <PieChart
            data={[
              {
                name: 'Finalizados',
                qty: incidentsData.finished,
                color: '#16A074',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
              {
                name: 'Pendientes',
                qty: incidentsData.pending,
                color: '#E11E48',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
              {
                name: 'En Proceso',
                qty: incidentsData.inProgress,
                color: '#0A87C8',
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              },
            ]}
            width={width}
            height={180}
            chartConfig={chartConfig}
            accessor={'qty'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            center={[10, 10]}
          />
        )}

        <Box h="100%" paddingX={3} marginTop={10}>
          <Box alignItems="flex-end">
            <Pressable
              backgroundColor="#DAF2FF"
              rounded="lg"
              p={3}
              onPress={() => navigation.navigate(ScreenNames.HOME_INCIDENTS)}
            >
              <HStack alignItems="center">
                <Text px={1}>Ver Incidencias</Text>
                <AntDesign name="arrowright" size={24} color="black" />
              </HStack>
            </Pressable>
          </Box>
          <HStack space={3} alignItems="center">
            <Box
              rounded="lg"
              borderColor="#efefef"
              borderWidth={2}
              backgroundColor="#fff"
              mt={3}
              padding={3}
              shadow="3"
              w="48%"
            >
              <Text>Total</Text>
              <Text fontSize="xl" bold>
                {incidentsData?.total ?? 0}
              </Text>
            </Box>
            <Box
              rounded="lg"
              borderColor="#efefef"
              borderWidth={2}
              backgroundColor="#fff"
              mt={3}
              padding={3}
              shadow="3"
              w="48%"
            >
              <Text>En Proceso</Text>
              <Text fontSize="xl" bold color="#0A87C8">
                {incidentsData?.inProgress ?? 0}
              </Text>
            </Box>
          </HStack>
          <HStack space={3} alignItems="center">
            <Box
              rounded="lg"
              borderColor="#efefef"
              borderWidth={2}
              backgroundColor="#fff"
              mt={3}
              padding={3}
              shadow="3"
              w="48%"
            >
              <Text>Pendientes</Text>
              <Text fontSize="xl" bold color="#E11E48">
                {incidentsData?.pending ?? 0}
              </Text>
            </Box>
            <Box
              rounded="lg"
              borderColor="#efefef"
              borderWidth={2}
              backgroundColor="#fff"
              mt={3}
              padding={3}
              shadow="3"
              w="48%"
            >
              <Text>Finalizadas</Text>
              <Text fontSize="xl" bold color="#16A074">
                {incidentsData?.finished ?? 0}
              </Text>
            </Box>
          </HStack>
        </Box>
      </ScrollView>
    </Box>
  );
};
