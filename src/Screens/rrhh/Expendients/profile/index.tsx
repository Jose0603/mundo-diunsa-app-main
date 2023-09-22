import React, { useEffect, useState } from 'react';
import {
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
  Button as KButton,
  Icon,
} from '@ui-kitten/components';
import { CameraIcon } from './extra/icons';
import { Box, ScrollView, Text, Button, PresenceTransition, Center, ZStack, Image } from 'native-base';
import { ScreenNames } from '../../../../Helpers/ScreenNames';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetMyNewsViews, getMyPoints } from '../../../../Services/User';
import { resetExtraData, setProfile } from '../../../../Redux/reducers/auth/profileSlice';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Loading } from '../../../../Components/Loading';
import { ResetUserData } from '../../../../Redux/actions/auth/loginActions';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GamificationDescriptionModal from '../../../../Components/GamificationDescriptionModal';
import { colors } from '../../../../Helpers/Colors';
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import { NewsViews } from '../../../../interfaces/rrhh/News/NewsViews';
import Constants from 'expo-constants';
import {
  VictoryBar,
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryPie,
  VictoryAnimation,
  VictoryLabel,
  VictoryStack,
  VictoryAxis,
} from 'victory-native';
// import Svg from 'react-native-svg';

export default ({ navigation }): React.ReactElement => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  const user = useSelector((state: RootState) => state.auth.login);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMountedRef().current;
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const styles = useStyleSheet(themedStyle);
  const [newsViewsSummary, setNewsViewsSummary] = useState<NewsViews | null>(null);

  const onDoneButtonPress = (): void => {
    navigation && navigation.goBack();
    console.log('onDoneButtonPress');
  };

  const renderPhotoButton = (): React.ReactElement => (
    <KButton style={styles.editAvatarButton} status="basic" accessoryLeft={CameraIcon} />
  );
  const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    </Box>
  );
  const renderRightActions = () => (
    <Box flexDirection="row" alignItems="center">
      {/* <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} /> */}
      <Feather name="edit" size={24} color="black" />
    </Box>
  );

  const fetchNewsViewsSummary = async () => {
    try {
      const res = await GetMyNewsViews(user.employeeId);
      setNewsViewsSummary(res);
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const fetchPoints = async () => {
    try {
      const res = await getMyPoints();
      if (res.result && isMounted) {
        dispatch(setProfile(res.data.points));
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPoints();
    fetchNewsViewsSummary();
  }, []);

  const chartConfig = {
    backgroundColor: '#FFF',
    backgroundGradientFrom: '#FFF',
    backgroundGradientFromOpacity: 0.4,
    backgroundGradientTo: '#FFF',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(37, 111, 224, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    style: {
      borderRadius: 16,
      paddingRight: 30,
    },
  };

  const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];

  const getData = (percent) => {
    return [
      { x: 'Leidos', y: percent },
      { x: 'No Leidos', y: 100 - percent },
    ];
  };

  const myDataset = [
    [
      { x: 'a', y: 1 },
      { x: 'b', y: 2 },
      { x: 'c', y: 3 },
      { x: 'd', y: 2 },
      { x: 'e', y: 1 },
    ],
    [
      { x: 'a', y: 2 },
      { x: 'b', y: 3 },
      { x: 'c', y: 4 },
      { x: 'd', y: 5 },
      { x: 'e', y: 5 },
    ],
    [
      { x: 'a', y: 1 },
      { x: 'b', y: 2 },
      { x: 'c', y: 3 },
      { x: 'd', y: 4 },
      { x: 'e', y: 4 },
    ],
  ];

  const transformData = (dataset) => {
    const totals = dataset[0].map((data, i) => {
      return dataset.reduce((memo, curr) => {
        return memo + curr[i].y;
      }, 0);
    });
    return dataset.map((data) => {
      return data.map((datum, i) => {
        return { x: datum.x, y: (datum.y / totals[i]) * 100 };
      });
    });
  };

  return (
    <Box safeArea style={styles.container}>
      <TopNavigation
        alignment="center"
        title="Mi Perfil"
        accessoryLeft={renderLeftActions}
        // accessoryRight={renderRightActions}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* <ProfileSetting style={[styles.profileSetting, styles.section]} hint="First Name" value={profile.firstName} />
        <ProfileSetting style={styles.profileSetting} hint="Last Name" value={profile.lastName} />
        <ProfileSetting style={styles.profileSetting} hint="Gender" value={profile.gender} />
        <ProfileSetting style={styles.profileSetting} hint="Age" value={`${profile.age}`} />
        <ProfileSetting style={styles.profileSetting} hint="Weight" value={`${profile.weight} kg`} />
        <ProfileSetting style={styles.profileSetting} hint="Height" value={`${profile.height} cm`} />
        <ProfileSetting style={[styles.profileSetting, styles.section]} hint="Email" value={profile.email} />
        <ProfileSetting style={styles.profileSetting} hint="Phone Number" value={profile.phoneNumber} /> */}

        <ZStack style={{ paddingTop: top + 60 }}>
          <Box bg={colors.secondary} maxH={300} size={width} shadow={3} />
        </ZStack>

        <Box mx={3} bg="#fff" borderRadius="md" shadow="3">
          <Box justifyContent="center" alignItems="center">
            {/* <Avatar
              bg="white"
              size="xl"
              zIndex={1}
              mt={-60}
              source={require('../../../../../assets/profile-user.png')}
            ></Avatar> */}
            <Image
              source={require('../../../../../assets/profile-user.png')}
              fallbackSource={require('../../../../../assets/profile-user.png')}
              alt="usuario"
              // size="lg"
              // height={35}
              // width={100}
              bg="white"
              size="lg"
              borderRadius="full"
              zIndex={1}
              mt={-60}
            />
            <Text fontSize={20} bold pt={3}>
              {user.username}
            </Text>
            <Text
              color={'warmGray.600'}
              _dark={{
                color: 'warmGray.200',
              }}
            >
              {user.employeePosition}
            </Text>
          </Box>
          <Box
            mx={12}
            my={5}
            p={8}
            shadow="4"
            borderColor={'gray.400'}
            alignItems="center"
            justifyContent="center"
            backgroundColor="#fff"
            borderRadius={10}
          >
            {isLoading ? (
              <Loading message="Cargando puntos..." />
            ) : (
              <PresenceTransition
                visible={!isLoading}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                  transition: {
                    duration: 250,
                  },
                }}
              >
                <Box>
                  <Box alignItems="flex-end">
                    <AntDesign
                      name="infocirlceo"
                      size={24}
                      color={colors.secondary}
                      onPress={() => {
                        setShowModal(!showModal);
                      }}
                    />
                  </Box>
                  <Center>
                    <Text fontSize={24}>{profile.points} puntos</Text>
                    <Button
                      size="sm"
                      colorScheme="success"
                      borderRadius="10"
                      mt={3}
                      onPress={() => {
                        navigation.navigate(ScreenNames.VIRTUAL_STORE);
                      }}
                      mx={3}
                      leftIcon={<MaterialIcons name="storefront" size={24} color="white" />}
                    >
                      Canjear Puntos
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="dark"
                      borderRadius="10"
                      variant="ghost"
                      mt={3}
                      onPress={() => {
                        navigation.navigate(ScreenNames.USER_ACTIVITY);
                      }}
                      mx={3}
                      leftIcon={<MaterialIcons name="history" size={24} color="black" />}
                    >
                      Ver Historial de Actividad
                    </Button>
                  </Center>
                </Box>
              </PresenceTransition>
            )}
          </Box>
        </Box>
        {/* <Box bg="#fff" borderRadius="md" shadow="3" justifyContent="center" alignContent="center" mx={5} my={5}>
          <Svg height={400}>
            <VictoryPie
              standalone={false}
              animate={{ duration: 1000 }}
              width={400}
              // height={400}
              data={getData(newsViewsSummary?.totalReadPercent ?? 0)}
              innerRadius={118}
              cornerRadius={25}
              labelRadius={100}
              labels={() => null}
              style={{
                data: {
                  fill: ({ datum }) => {
                    const color = datum.x.toLowerCase() === 'leidos' ? 'green' : '#eee';
                    return color;
                  },
                },
              }}
            />
            <VictoryAnimation duration={1000} data={[{ x: 'Leido', y: 0.25 ?? 0 }]}>
              {(newProps) => {
                return (
                  <VictoryLabel
                    textAnchor="middle"
                    verticalAnchor="middle"
                    x={200}
                    y={200}
                    text={`${newsViewsSummary?.totalReadPercent ?? 0}%`}
                    style={{ fontSize: 45 }}
                  />
                );
              }}
            </VictoryAnimation>
          </Svg>
        </Box> */}

        {newsViewsSummary && (
          <Box bg="#fff" borderRadius="md" shadow="3" my={5} pt={5}>
            <Text textAlign={'center'} fontSize={18}>
              Lectura de noticias
            </Text>
            <Text textAlign={'center'} fontSize={14}>
              ¿Cómo eres activo?
            </Text>
            <ProgressChart
              data={{
                labels: ['Apertura'],
                data: [newsViewsSummary?.totalReadPercent / 100],
              }}
              style={{
                paddingRight: 35,
              }}
              width={width}
              height={220}
              strokeWidth={16}
              radius={64}
              chartConfig={chartConfig}
              // hideLegend={true}
            />

            {newsViewsSummary.detail.length > 0 && (
              <>
                <Text textAlign="center" fontSize={24}>
                  Categorías mas leídas
                </Text>
                <BarChart
                  // style={graphStyle}
                  data={{
                    labels: [...newsViewsSummary?.detail.map((item) => item.category)],
                    datasets: [
                      {
                        data: [...newsViewsSummary?.detail.map((item) => item.readPercent)],
                      },
                    ],
                  }}
                  width={width}
                  height={300}
                  yAxisLabel=""
                  fromZero
                  yAxisSuffix="%"
                  style={{
                    padding: 15,
                  }}
                  chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: '#fff',
                    backgroundGradientToOpacity: 0.5,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    strokeWidth: 2,
                    barPercentage: 1,
                    useShadowColorFromDataset: false,
                  }}
                />
              </>
            )}
          </Box>
        )}
        {showModal && (
          <GamificationDescriptionModal
            showModal={showModal}
            closeModal={() => {
              setShowModal(!showModal);
            }}
          />
        )}

        <Button
          size="lg"
          colorScheme="danger"
          onPress={() => {
            dispatch(resetExtraData());
            dispatch(ResetUserData());
          }}
          mx={10}
          mt={5}
        >
          Cerrar Sesión
        </Button>
        <Box justifyContent="center" w="100%" alignItems="center" mt={12}>
          <Text bold fontSize={16}>
            v. {Constants.manifest.version}
          </Text>
        </Box>
      </ScrollView>
    </Box>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  profileAvatar: {
    aspectRatio: 1.0,
    height: 124,
    alignSelf: 'center',
    marginTop: 24,
    zIndex: 10,
  },
  editAvatarButton: {
    aspectRatio: 1.0,
    height: 48,
    borderRadius: 24,
  },
  profileSetting: {
    padding: 16,
  },
  section: {
    marginTop: 24,
  },
  doneButton: {
    marginHorizontal: 24,
    marginTop: 24,
  },
});
