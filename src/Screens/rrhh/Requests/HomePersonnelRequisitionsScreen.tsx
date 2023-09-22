import TopMainBar from '../../../Components/TopMainBar';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { RootState } from '../../../Redux/reducers/rootReducer';
import { AntDesign, Entypo, Feather, FontAwesome5, Fontisto, Foundation, Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Icon, List, ListItem, TopNavigationAction } from '@ui-kitten/components';
import { Box, HStack, Icon as NbIcon, Pressable, Text, VStack } from 'native-base';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export const HomePersonnelRequisitionsScreen = ({ navigation }: IProps) => {
  const profile = useSelector((state: RootState) => state.profile);
  // const MenuIcon = (props: any) => <Icon {...props} name='menu-2-outline' />;
  // const PlusIcon = (props: any) => (
  //   <Icon {...props} name='plus-circle-outline' />
  // );

  const MenuIcon = (props: any) => <Ionicons {...props} name="menu" size={24} />;
  const PlusIcon = (props: any) => <AntDesign {...props} name="plus" size={24} />;

  const data = [
    {
      title: 'Plazas Vacantes',
      detail:
        'Requisición para la contratación de una o mas personas para llenar una o mas plazas existentes en estado "Vacante"',
      // icon: <Icon name='file-outline' />,
      icon: <Ionicons name="person-add-outline" size={24} color="#9ba6b1" />,
      iconName: 'person-add-outline',
      iconType: Ionicons,
      navigate: ScreenNames.REQUISITION_VACANCY_NAVIGATOR,
      canShow: true,
    },
    {
      title: 'Sustitución de Empleados Activos',
      detail: 'Requisición para la contratación de el o los sustitutos de uno o varios empleados actualmente activos',
      // icon: <Icon name='checkmark-circle-2-outline' />,
      icon: <FontAwesome5 name="exchange-alt" size={24} color="#9ba6b1" />,
      iconName: 'exchange-alt',
      iconType: FontAwesome5,
      navigate: ScreenNames.REQUISITION_SUBSTITUTION_NAVIGATOR,
      canShow: true,
    },
    {
      title: 'Plazas Nuevas para Puesto Existente',
      detail:
        'Requisición para la contratación de una o más personas para llenar una o mas plazas nuevas de un puesto existente',
      // icon: <Icon name='pantone-outline' />,
      icon: <AntDesign name="team" size={24} color="#9ba6b1" />,
      iconName: 'team',
      iconType: AntDesign,
      navigate: ScreenNames.REQUISITION_NEW_POSITION,
      canShow: true,
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
          Requisiciones
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
