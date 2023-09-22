import { AntDesign, Entypo, Feather, Fontisto, Foundation, Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Icon, List, ListItem, TopNavigationAction } from '@ui-kitten/components';
import { Box, HStack, Icon as NbIcon, Pressable, Text, VStack } from 'native-base';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import TopMainBar from '../../../Components/TopMainBar';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { useIsBoss } from '../../../hooks/useExpediente';
import { RootState } from '../../../Redux/reducers/rootReducer';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const HomeRequestsScreen = ({ navigation }: IProps) => {
  const profile = useSelector((state: RootState) => state.profile);
  // const MenuIcon = (props: any) => <Icon {...props} name='menu-2-outline' />;
  // const PlusIcon = (props: any) => (
  //   <Icon {...props} name='plus-circle-outline' />
  // );

  const MenuIcon = (props: any) => <Ionicons {...props} name="menu" size={24} />;
  const PlusIcon = (props: any) => <AntDesign {...props} name="plus" size={24} />;
  const { isBoss } = useIsBoss();

  const data = [
    {
      title: 'Solicitud de Constancia',
      detail: 'Solicitar préstamos personales, confirmación del trabajo de otra persona o una carta a la embajada.',
      // icon: <Icon name='file-outline' />,
      icon: <Feather name="file" size={24} color={'#9ba6b1'} />,
      iconName: 'newspaper-outline',
      iconType: Ionicons,
      navigate: ScreenNames.FORM_REQUEST_CONSTANCIA,
      canShow: true,
    },
    {
      title: 'Solicitud de Permisos',
      detail: 'Solicitar permiso con o sin goce de sueldo, o licencia por matrimonio.',
      // icon: <Icon name='checkmark-circle-2-outline' />,
      icon: <AntDesign name="checkcircleo" size={23} color={'#9ba6b1'} />,
      iconName: 'checkcircleo',
      iconType: AntDesign,
      navigate: ScreenNames.FORM_REQUEST_PERMISION,
      canShow: true,
    },
    {
      title: 'Solicitud de Vacaciones',
      detail: 'Solicitar días de vacaciones.',
      // icon: <Icon name='map-outline' />,
      icon: <Feather name="map" size={24} color={'#9ba6b1'} />,
      iconName: 'umbrella-outline',
      iconType: Ionicons,
      navigate: ScreenNames.FORM_REQUEST_VACACIONES,
      canShow: true,
    },
    {
      title: 'Solicitud de Cupon de Tiempo Libre',
      detail: 'Solicitar cupon de tiempo libre.',
      // icon: <Icon name='pantone-outline' />,
      icon: <Entypo name="ticket" size={24} color={'#9ba6b1'} />,
      iconName: 'ticket',
      iconType: Foundation,
      navigate: ScreenNames.FORM_REQUEST_COUPON_FREETIME,
      canShow: !profile.isTemporary,
    },
    {
      title: 'Solicitud de Visita a la clínica',
      detail: 'Solicitar visita a la clinica para ti, tu hijo o tu cónyugue',
      // icon: <Icon name='activity-outline' />,
      icon: <Feather name="activity" size={24} color={'#9ba6b1'} />,
      iconName: 'heartbeat-alt',
      iconType: Fontisto,
      navigate: ScreenNames.FORM_REQUEST_CLINIC,
      canShow: true,
    },
    {
      title: 'Solicitud de Requisición de Personal',
      detail:
        'Solicita una plaza para puesto existente, Sustitución de Empleados Activos y Contratación para Plazas Vacantes',
      // icon: <Icon name='activity-outline' />,
      icon: <Ionicons name="person-add-outline" size={24} color="#9ba6b1" />,
      iconName: 'person-add-outline',
      iconType: Ionicons,
      navigate: ScreenNames.HOME_PERSONNEL_REQUISITIONS,
      canShow: isBoss,
    },
  ];

  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction icon={MenuIcon} onPress={() => navigation.toggleDrawer()} />
    </Box>
  );

  const renderItem = (info) =>
    info?.item?.canShow ? (
      Platform.OS === 'web' ? (
        <Pressable
          bgColor="#fff"
          onPress={() => navigation.navigate(info.item.navigate)}
          w="100%"
          my={2}
          justifyContent="center"
          alignItems="center"
        >
          <HStack w="100%">
            <NbIcon
              as={info.item.iconType}
              size="xl"
              name={info.item.iconName}
              mr={5}
              _dark={{
                color: 'warmGray.50',
              }}
              color="#000"
              borderRadius="full"
              // p={2}
            />
            <VStack>
              <HStack>
                <Text
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  fontSize="lg"
                  color="coolGray.800"
                  bold
                >
                  {info.item.title}
                </Text>
                <NbIcon
                  as={AntDesign}
                  size="md"
                  name="pluscircleo"
                  ml={3}
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  color="#000"
                  borderRadius="full"
                  // p={2}
                />
              </HStack>
              <Text
                color="coolGray.800"
                fontSize="md"
                _dark={{
                  color: 'warmGray.200',
                }}
              >
                {info.item.detail}
              </Text>
            </VStack>
          </HStack>
        </Pressable>
      ) : (
        <ListItem
          title={info.item.title}
          accessoryLeft={info.item.icon}
          // accessoryRight={<Icon name='arrow-ios-forward-outline' />}
          accessoryRight={<AntDesign name="right" size={16} color={'#9ba6b1'} />}
          description={info.item.detail}
          onPress={() => navigation.navigate(info.item.navigate)}
        ></ListItem>
      )
    ) : null;

  return (
    <Box safeAreaTop backgroundColor="#fff" height="100%">
      {/* <TopNavigation
        alignment="center"
        title="Nueva Solicitud"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
      /> */}
      <TopMainBar showBack showMenu={false} />
      <Box
        _web={{
          paddingX: '10%',
        }}
        flex={1}
      >
        <Text fontSize="xl" bold ml={2}>
          Nuevas Solicitudes
        </Text>
        <List
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={data}
          renderItem={renderItem}
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '100%',
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});
