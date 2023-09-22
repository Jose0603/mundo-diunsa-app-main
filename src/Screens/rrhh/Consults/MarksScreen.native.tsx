import { Entypo, Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import {
  Datepicker,
  Icon,
  NativeDateService,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import moment from 'moment';
import {
  Box,
  FlatList,
  HStack,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { Loading } from '../../../Components/Loading';
import { NoData } from '../../../Components/NoData';
import TopMainBar from '../../../Components/TopMainBar';
import { localeDateService } from '../../../Helpers/LocaleDate';
import { QueryKeys } from '../../../Helpers/QueryKeys';
import { useCustomToast } from '../../../hooks/useCustomToast';
import { IMarkingReq } from '../../../interfaces/rrhh/IMarking';
import { AuthState } from '../../../Redux/reducers/auth/loginReducer';
import { GetMarkingsByDate } from '../../../Services/rrhh/Markings';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

const MarksScreen = ({ navigation }: IProps) => {
  // const MenuIcon = (props: any) => <Icon {...props} name="menu-2-outline" />;
  // const CalendarIcon = (props) => <Icon {...props} name="calendar" />;
  const MenuIcon = (props: any) => (
    <Ionicons {...props} name='menu' size={24} />
  );
  const CalendarIcon = (props) => (
    <Entypo {...props} name='calendar' size={24} color={'#9ba6b1'} />
  );

  const showToast = useCustomToast();
  // const toast = useToast();

  const user: AuthState = useSelector((state: any) => state.auth.login);

  const [sendingReq, setSendingReq] = useState<IMarkingReq>({
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    empCode: user.employeeId,
  });

  const [showingDate, setShowingDate] = useState(new Date());

  useEffect(() => {
    setSendingReq({
      ...sendingReq,
      startDate: moment(showingDate).format('YYYY-MM-DD'),
      endDate: moment(showingDate).format('YYYY-MM-DD'),
    });
  }, [showingDate]);

  const { isLoading, isError, error, isFetching, data } = useQuery(
    [QueryKeys.MARKINGS, sendingReq],
    () => GetMarkingsByDate(sendingReq)
  );

  const renderLeftActions = () => (
    <Box flexDirection='row' alignItems='center'>
      <TopNavigationAction
        icon={MenuIcon}
        onPress={() => navigation.toggleDrawer()}
      />
    </Box>
  );

  const renderItem = ({ item }: any) => {
    return (
      <Box
        mx={5}
        py={3}
        borderBottomWidth='1'
        borderColor={'gray.400'}
        justifyContent='center'
      >
        <VStack w='100%'>
          <HStack space={3} justifyContent='space-between' mb={1} mt={1}>
            <VStack w='30%'>
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color='coolGray.800'
                bold
              >
                Fecha
              </Text>
            </VStack>
            <VStack w='60%' alignItems='flex-start'>
              <Text
                color='coolGray.600'
                _dark={{
                  color: 'warmGray.200',
                }}
                isTruncated
              >
                {moment(item.fecha).format('D MMM YY')}
              </Text>
            </VStack>
          </HStack>
          <HStack space={3} justifyContent='space-between' mb={1}>
            <VStack w='30%'>
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color='coolGray.800'
                bold
              >
                Hora
              </Text>
            </VStack>
            <VStack w='60%' alignItems='flex-start'>
              <Text
                color='coolGray.600'
                _dark={{
                  color: 'warmGray.200',
                }}
                isTruncated
              >
                {moment(item.fecha).format('hh:mm a')}
              </Text>
            </VStack>
          </HStack>
          <HStack space={3} justifyContent='space-between' mb={1}>
            <VStack w='30%'>
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color='coolGray.800'
                bold
              >
                Estado
              </Text>
            </VStack>
            <VStack w='60%' alignItems='flex-start'>
              <Text
                color='coolGray.600'
                _dark={{
                  color: 'warmGray.200',
                }}
                isTruncated
              >
                {item.estado}
              </Text>
            </VStack>
          </HStack>
          <HStack space={3} justifyContent='space-between' mb={1}>
            <VStack w='30%'>
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color='coolGray.800'
                bold
              >
                Comentario
              </Text>
            </VStack>
            <VStack w='60%' alignItems='flex-start'>
              <Text
                color='coolGray.600'
                _dark={{
                  color: 'warmGray.200',
                }}
              >
                {item.comentario ?? '-'}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    );
  };

  if (isError) {
    showToast({
      title: 'Hubo un error',
      status: 'error',
      description: 'Ocurrio un error al consultar los datos',
    });
  }

  return (
    <Box safeArea flex={1} backgroundColor='#fff'>
      {/* <TopNavigation
        alignment="center"
        title="Mis Marcaciones"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
      /> */}
      <TopMainBar showBack showMenu={false} />
      <HStack px={5} py={3} justifyContent='center' _web={{ marginX: '48' }}>
        <Box w='80%' mr={4}>
          <Datepicker
            date={showingDate}
            // dateService={localeDateService}
            onSelect={(nextDate) => setShowingDate(nextDate)}
            caption='Elige un día'
            accessoryRight={CalendarIcon}
            min={new Date('2021-01-01')}
            max={new Date()}
          />
        </Box>
        {/* <Button
          w="30%"
          onPress={() => {
            setSearch(!search);
          }}
          alignSelf="flex-start"
        >
          Consultar
        </Button> */}
      </HStack>
      <ScrollView
        _contentContainerStyle={{
          _web: {
            marginX: '48',
          },
        }}
      >
        <Box
          shadow='4'
          borderColor={'gray.400'}
          justifyContent='center'
          backgroundColor='#fff'
          borderRadius={5}
          m={5}
          p={4}
        >
          {data && data.length > 0 && (
            <VStack justifyContent='center' alignItems='center'>
              <Text
                bold
                color={'blue.600'}
                _dark={{
                  color: 'warmGray.200',
                }}
                fontSize='2xl'
              >
                Marcaciones
              </Text>
              <Text
                bold
                color={'blue.600'}
                _dark={{
                  color: 'warmGray.200',
                }}
                fontSize='2xl'
              >
                {moment(showingDate).format('DD/MM/YYYY')}
              </Text>
            </VStack>
          )}
          {isLoading ? (
            <Loading message='Cargando Marcas...' isFlex />
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item) => item.fecha}
              ListEmptyComponent={
                <NoData message='No hay marcaciones por mostrar' />
              }
              renderItem={renderItem}
              scrollEnabled={false}
            />
          )}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default MarksScreen;
