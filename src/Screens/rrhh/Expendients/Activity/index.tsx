import React, { useState } from 'react';
import { StyleService, TopNavigation, TopNavigationAction, useStyleSheet, Icon } from '@ui-kitten/components';
import { Box, ScrollView, Text, Button, ZStack, VStack, HStack, FlatList } from 'native-base';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Feather } from '@expo/vector-icons';
import { ListRenderItemInfo, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { IExchangeHeader } from '../../../../interfaces/rrhh/Gamification/IProductExchange';
import { Loading } from '../../../../Components/Loading';
import { NoData } from '../../../../Components/NoData';
import ExchangeDetailModal from '../../../../Components/ExchangeDetailModal';
import { QueryKeys } from '../../../../Helpers/QueryKeys';
import { useQuery } from 'react-query';
import { GetMyActivity } from '../../../../Services/User';
import { IUserActivity } from '../../../../interfaces/rrhh/Gamification/IUserActivity';
import { sentenceCase } from '../../../../Helpers/FormatToSenteceCase';

export default ({ navigation }): React.ReactElement => {
  const [showModal, setShowModal] = useState(false);
  const styles = useStyleSheet(themedStyle);
  const [selectedExchange, setSelectedExchange] = useState<IExchangeHeader>();
  const {
    isLoading,
    isError,
    error,
    isFetching,
    data: userHistory,
    isRefetching,
    refetch,
  } = useQuery([QueryKeys.PRODUCTS], () => GetMyActivity());

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

  const getHistoryType = (status: string) => {
    switch (status) {
      case 'INGDIA':
        return { color: 'blue.400', label: 'Pendiente', description: 'ha ingresado a la aplicación', showA: false };
      case 'LEENOT':
        return { color: 'blue.400', label: 'Entregado', description: 'ha leido ', showA: false };
      case 'RCCNOT':
        return { color: 'blue.400', label: 'Cancelado', description: 'le ha gustado: ', showA: true };
      case 'COMNOT':
        return { color: 'blue.400', label: 'Cancelado', description: 'comentó la noticia ', showA: false };
      case 'REASOL':
        return { color: 'blue.400', label: 'Cancelado', description: 'ha realizado una solicitud de: ', showA: false };
      default:
        return { color: 'blue.400', label: 'Pendiente', description: '' };
    }
  };

  const CouponItem = ({ item: history }: ListRenderItemInfo<IUserActivity>) => {
    const values = getHistoryType(history.activityCode);
    return (
      <HStack mx={5} bg="#fff" borderRadius="lg" shadow="3" borderColor="warmGray.400" mb={3}>
        <Box
          justifyContent="center"
          alignItems="center"
          bg={values.color}
          borderTopLeftRadius="lg"
          borderBottomLeftRadius="lg"
          px={3}
          // maxW={50}
        >
          <Box justifyContent="center" alignItems="center">
            <Text style={{ width: '100%', padding: 0 }} color="#fff" letterSpacing={2} bold>
              +{history.points}
            </Text>
          </Box>
        </Box>
        <VStack py={3} flex={1}>
          <Box>
            <Text fontSize={18} px={5}>
              {values.showA && 'A '}
              {sentenceCase(history.firstName)} {sentenceCase(history.lastName)} {values.description ?? ''}
              <Text
                color="blue.500"
                // onPress={() => {
                //   RootNavigation.navigate(ScreenNames.VIRTUAL_STORE);
                // }}
              >
                {' '}
                {history.objectName ?? ''}{' '}
              </Text>
            </Text>
          </Box>
          <HStack mt={1} px={5} justifyContent="space-between">
            <Box>
              <Text color="warmGray.500">{moment(history.createdAt).format('DD MMM YYYY')}</Text>
            </Box>
            {/* <Button
            borderRadius="3xl"
            px={5}
            // bg={colors.secondary}
            colorScheme="primary"
            onPress={() => {
              // setSelectedExchange(history);
              setShowModal(true);
            }}
          >
            <Text color="#fff" bold>
              Ver Detalle
            </Text>
          </Button> */}
          </HStack>
        </VStack>
      </HStack>
    );
  };

  const NoExchanges = () => {
    return (
      <Box bg="#fff" mx={5} shadow={3} borderRadius="lg" p={3} my={2}>
        <NoData message="No has realizado ninguna actividad" />
      </Box>
    );
  };

  return (
    <Box safeArea style={styles.container}>
      <TopNavigation
        alignment="center"
        title="Historial de Actividad"
        accessoryLeft={renderLeftActions}
        // accessoryRight={renderRightActions}
      />
      {/* {Platform.OS === 'ios' ? (
        <>
          <ZStack style={{ paddingTop: top + 60 }}>
            <Box bg={colors.primary} maxH={300} size={width} shadow={3} />
          </ZStack>
          <Box justifyContent="center" alignItems="center" mt={-20} pb={10}>
            <Text color="#fff" fontSize={36}>
              {currencyFormat(coupons.totalExchangeSum) ?? 0}
            </Text>
            <Text color="#fff" fontSize={18}>
              Total Puntos Canjeados
            </Text>
          </Box>
        </>
      ) : (
        <>
          
        </>
      )} */}

      {/* <Box justifyContent="center" alignItems="center" pb={10}>
        <Text color="#000" fontSize={36}>
          Historial de Actividad
        </Text>
      </Box> */}

      {isLoading ? (
        <Loading message="Cargando historial..." />
      ) : (
        <FlatList
          mt={4}
          data={userHistory?.data}
          renderItem={CouponItem}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={<NoExchanges />}
        />
      )}

      {showModal && (
        <ExchangeDetailModal
          showModal={showModal}
          closeModal={() => {
            setShowModal(!showModal);
          }}
          exchange={selectedExchange}
        />
      )}

      {/* <Box mx={3} bg="#fff" borderRadius="md" shadow="3">
        </Box> */}

      {/* <Button
          size="lg"
          colorScheme="danger"
          onPress={() => {
            dispatch(ResetUserData());
          }}
          mx={10}
          mt={5}
        >
          Cerrar Sesión
        </Button> */}
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
