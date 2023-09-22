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
  View,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';

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
import { Row, Table } from 'react-native-table-component';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

const MarksScreen = ({ navigation }: IProps) => {
  const MenuIcon = (props: any) => <Icon {...props} name='menu-2-outline' />;
  const CalendarIcon = (props) => <Icon {...props} name='calendar' />;
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

  if (isError) {
    showToast({
      title: 'Hubo un error',
      status: 'error',
      description: 'Ocurrio un error al consultar los datos',
    });
  }

  return (
    <Box flex={1} backgroundColor='#fff'>
      {/* <TopNavigation
        alignment="center"
        title="Mis Marcaciones"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
      /> */}
      <TopMainBar showBack showMenu={false} />
      <Box mx={20} my={5} h={'full'} flex={1}>
        <Text fontSize={'xl'} marginTop={5}>
          Control De Asistencia
        </Text>
        <HStack py={3}>
          <Box w='50%'>
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
        <ScrollView>
          <Box
            // shadow="4"
            borderColor={'gray.400'}
            justifyContent='center'
            backgroundColor='#fff'
            // borderRadius={5}
            // m={5}
            // p={4}
          >
            {data && data.length > 0 && (
              <HStack my={5}>
                <Text fontSize='md'>Marcaciones </Text>
                <Text fontSize='md'>
                  {moment(showingDate).format('DD/MM/YYYY')}
                </Text>
              </HStack>
            )}
            {isLoading ? (
              <Loading message='Cargando Marcas...' isFlex />
            ) : (
              <>
                {data && data.length && data.length > 0 ? (
                  <Table borderStyle={{ borderColor: 'transparent' }}>
                    <Row
                      data={[
                        <Text bold>Fecha</Text>,
                        <Text bold>Hora</Text>,
                        <Text bold>Estado</Text>,
                        <Text bold>Comentario</Text>,
                      ]}
                      widthArr={[200, 200, 200, 200]}
                      style={styles.head}
                    />
                    {data.map((marca, index) => {
                      let values = [
                        marca.fecha,
                        new Date(marca.fecha).toLocaleTimeString(),
                        marca.estado,
                        marca.comentario ?? '_',
                      ];
                      return (
                        <Row
                          key={index}
                          data={values}
                          widthArr={[200, 200, 200, 200]}
                          style={[
                            styles.row,
                            index % 2 && { backgroundColor: '#ECECEC' },
                          ]}
                        />
                      );
                    })}
                  </Table>
                ) : (
                  <NoData message='No hay marcaciones por mostrar' />
                )}
              </>
            )}
          </Box>
        </ScrollView>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  head: {
    height: 40,
    // backgroundColor: "#ECECEC",
    padding: 5,
    borderRadius: 5,
    shadow: 4,
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginBottom: 5,
    fontStyle: 'bold',
    fontWeight: 'bold',
  },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: {
    height: 35,
    paddingTop: 5,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  text: { textAlign: 'center' },
});

export default MarksScreen;
