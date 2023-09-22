import React, { useEffect, useState } from 'react';
import {
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
  Icon,
} from '@ui-kitten/components';
import {
  Box,
  ScrollView,
  Text,
  Button,
  ZStack,
  VStack,
  HStack,
  FlatList,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { Feather } from '@expo/vector-icons';
import {
  ListRenderItemInfo,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GamificationDescriptionModal from '../../../../Components/GamificationDescriptionModal';
import { colors } from '../../../../Helpers/Colors';
import moment from 'moment';
import { IExchangeHeader } from '../../../../interfaces/rrhh/Gamification/IProductExchange';
import { setCouponExchanges } from '../../../../Redux/reducers/store/couponSlice';
import { GetUserExchanges } from '../../../../Services/rrhh/Gamification';
import { Loading } from '../../../../Components/Loading';
import { NoData } from '../../../../Components/NoData';
import ExchangeDetailModal from '../../../../Components/ExchangeDetailModal';
import { currencyFormat } from '../../../../Helpers/FormatCurrency';
import { QueryKeys } from '../../../../Helpers/QueryKeys';
import { useQuery } from 'react-query';
import { CustomIcon } from '../../../../Components/CustomIcon';

export default ({ navigation }): React.ReactElement => {
  const dispatch = useDispatch();
  const coupons = useSelector((state: RootState) => state.couponExchange);
  // const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMountedRef().current;
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const styles = useStyleSheet(themedStyle);
  const [selectedExchange, setSelectedExchange] = useState<IExchangeHeader>();

  const BackIcon = (props: any) => (
    <CustomIcon {...props} iconName='arrow-back' />
  );

  const renderLeftActions = () => (
    <Box flexDirection='row' alignItems='center'>
      <TopNavigationAction
        icon={BackIcon}
        onPress={() => navigation.goBack()}
      />
    </Box>
  );
  const renderRightActions = () => (
    <Box flexDirection='row' alignItems='center'>
      {/* <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} /> */}
      <Feather name='edit' size={24} color='black' />
    </Box>
  );

  // useEffect(() => {
  //   setIsLoading(true);
  //   (async () => {
  //     try {
  //       const res = await GetUserExchanges();
  //       console.log(res);
  //       if (res.result && isMounted) {
  //         dispatch(setCouponExchanges(res.data));
  //       }
  //       console.log(res);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       if (isMounted) setIsLoading(false);
  //     }
  //   })();

  //   return () => {};
  // }, []);

  const {
    isLoading,
    isError,
    error,
    isFetching,
    data: couponsDetail,
    isRefetching,
    refetch,
  } = useQuery([QueryKeys.COUPONS], () => GetUserExchanges());
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return { color: 'warmGray.500', label: 'Pendiente' };
      case 'Entregado':
        return { color: 'green.500', label: 'Entregado' };
      case 'Cancelado':
        return { color: 'red.500', label: 'Cancelado' };
      default:
        return { color: 'warmGray.500', label: 'Pendiente' };
    }
  };

  const CouponItem = ({
    item: exchangeHeader,
  }: ListRenderItemInfo<IExchangeHeader>) => {
    const values = getStatusColor(exchangeHeader.status);
    return (
      <HStack mx={5} bg='#fff' borderRadius='2xl' shadow='3' h={200} mb={10}>
        <Box
          justifyContent='center'
          alignItems='center'
          bg={values.color}
          borderTopLeftRadius='2xl'
          borderBottomLeftRadius='2xl'
          maxW={50}
        >
          <Box justifyContent='center' alignItems='center'>
            <Text
              style={{
                transform: [{ rotate: '-90deg' }],
                width: '100%',
                padding: 0,
              }}
              color='#fff'
              letterSpacing={2}
              bold
            >
              {values.label}
            </Text>
          </Box>
        </Box>
        <VStack flex={1} pt={4} py={5} justifyContent='space-between'>
          <Box>
            <Text fontSize={24} px={3}>
              Solicitud de canje de puntos
            </Text>
          </Box>
          <HStack px={3} justifyContent='space-between'>
            <Box>
              <Text color='warmGray.500'>Fecha del canje</Text>
              <Text bold>
                {moment(exchangeHeader.createdAt).format('DD MMM YYYY')}
              </Text>
            </Box>
            <Button
              borderRadius='3xl'
              px={5}
              // bg={colors.secondary}
              colorScheme='primary'
              onPress={() => {
                setSelectedExchange(exchangeHeader);
                setShowModal(true);
              }}
            >
              <Text color='#fff' bold>
                Ver Detalle
              </Text>
            </Button>
          </HStack>
        </VStack>
      </HStack>
    );
  };

  const NoExchanges = () => {
    return (
      <Box bg='#fff' mx={5} shadow={3} borderRadius='lg' p={3}>
        <NoData message='No has realizado ningun canje' />
      </Box>
    );
  };

  return (
    <Box safeArea style={styles.container}>
      <TopNavigation
        alignment='center'
        title='Historial de Canjes'
        accessoryLeft={renderLeftActions}
        // accessoryRight={renderRightActions}
      />
      {Platform.OS === 'ios' ? (
        <>
          <ZStack style={{ paddingTop: top + 60 }}>
            <Box bg={colors.primary} maxH={300} size={width} shadow={3} />
          </ZStack>
          <Box justifyContent='center' alignItems='center' mt={-20} pb={10}>
            <Text color='#fff' fontSize={36}>
              {couponsDetail?.data?.totalExchangeSum
                ? currencyFormat(couponsDetail?.data?.totalExchangeSum)
                : 0}
            </Text>
            <Text color='#fff' fontSize={18}>
              Total Puntos Canjeados
            </Text>
          </Box>
        </>
      ) : (
        <>
          <Box justifyContent='center' alignItems='center' pb={10}>
            <Text color='#000' fontSize={36}>
              {couponsDetail?.data?.totalExchangeSum
                ? currencyFormat(couponsDetail?.data?.totalExchangeSum)
                : 0}
            </Text>
            <Text color='warmGray.500' fontSize={18}>
              Total Puntos Canjeados
            </Text>
          </Box>
        </>
      )}

      {isLoading ? (
        <Loading message='Cargando canjes...' />
      ) : (
        <FlatList
          data={couponsDetail.data.exchangesDetail}
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
