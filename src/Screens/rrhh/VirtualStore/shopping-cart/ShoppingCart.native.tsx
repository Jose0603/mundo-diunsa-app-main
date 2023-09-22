import { Button, Layout, List, Spinner, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { Alert, Box, HStack, Text as NbText, useToast, VStack } from 'native-base';
import React from 'react';
import { ListRenderItemInfo, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { CustomIcon } from '../../../../Components/CustomIcon';
import { EmptyCart } from '../../../../Components/EmptyCart';
import { ScreenNames } from '../../../../Helpers/ScreenNames';
import { useCustomToast } from '../../../../hooks/useCustomToast';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { IShoppingCartItem } from '../../../../interfaces/rrhh/Gamification/IProduct';
import { ProductExhange } from '../../../../interfaces/rrhh/Gamification/IProductExchange';
import * as RootNavigation from '../../../../Navigator/RootNavigation';
import { subStractPoints } from '../../../../Redux/reducers/auth/profileSlice';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import { resetProductList } from '../../../../Redux/reducers/store/storeSlice';
import { ProductExchange } from '../../../../Services/rrhh/Gamification';
import { CartItem } from './extra/cart-item.component';
import { Product } from './extra/data';

export default (): React.ReactElement => {
  const dispatch = useDispatch();
  const cartInfo = useSelector((state: RootState) => state.store);
  const profile = useSelector((state: RootState) => state.profile);
  const styles = useStyleSheet(themedStyle);
  const showToast = useCustomToast();
  const [loading, setLoading] = React.useState<boolean>(false);
  const isMounted = useIsMountedRef();

  const leftPoints = (): number => {
    return profile.points - cartInfo.totalCart;
  };

  const handleExchange = async () => {
    setLoading(true);
    try {
      const exchProds: ProductExhange[] = cartInfo.products.map((item: IShoppingCartItem) => {
        return {
          id: item.product.id,
          pointsRequired: item.product.pointsRequired,
          quantity: item.qty,
        };
      });

      const res = await ProductExchange(exchProds);
      if (res.result) {
        showToast({
          title: res.message,
          status: 'success',
        });
        const totalPoints = exchProds.reduce(
          (acc: number, item: ProductExhange) => acc + item.pointsRequired * item.quantity,
          0
        );
        dispatch(resetProductList());
        dispatch(subStractPoints(totalPoints));
        RootNavigation.goBack();
      } else {
        showToast({
          title: 'Hubo un error',
          description: res.message,
          status: 'warning',
        });
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: 'Hubo un error',
        description: 'Ocurrió un error al intentar realizar la operación',
        status: 'warning',
      });
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const LoadingIndicator = (props: any) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size="small" status="basic" />
    </View>
  );

  const renderFooter = (): React.ReactElement =>
    cartInfo.totalCartItems > 0 && (
      <VStack p={5}>
        <HStack justifyContent="space-between">
          <NbText bold fontSize={18}>
            Puntos disponibles:
          </NbText>
          <NbText fontSize={18}>{`${profile.points} pts`}</NbText>
        </HStack>
        <HStack justifyContent="space-between">
          <NbText bold fontSize={18}>
            Total canje:
          </NbText>
          <NbText fontSize={18}>{`${cartInfo.totalCart} pts`}</NbText>
        </HStack>
        <HStack justifyContent="space-between">
          <NbText bold fontSize={18}>
            Puntos restantes:
          </NbText>
          <NbText fontSize={18} color={leftPoints() < 0 ? 'red.400' : 'black'}>{`${leftPoints()} pts`}</NbText>
        </HStack>
      </VStack>
    );

  const renderProductItem = (info: ListRenderItemInfo<IShoppingCartItem>): React.ReactElement => (
    <CartItem style={styles.item} index={info.index} product={info.item} />
  );
  const BackIcon = (props: any) => <CustomIcon {...props} iconName="arrow-back" />;

  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction icon={BackIcon} onPress={() => RootNavigation.goBack()} />
    </Box>
  );

  return (
    <Box safeArea flex={1} bg="#fff">
      <TopNavigation alignment="center" title="Carrito" accessoryLeft={renderLeftActions} />
      {cartInfo.totalCartItems > 0 ? (
        <>
          <List
            style={{ backgroundColor: '#fff' }}
            data={cartInfo.products}
            ListEmptyComponent={<EmptyCart message="Tu carrito parece estar vacio" />}
            renderItem={renderProductItem}
            ListFooterComponent={renderFooter}
          />
          {leftPoints() < 0 && (
            <Alert w="100%" variant={'left-accent'} colorScheme="danger" status="danger">
              <VStack space={2} flexShrink={1} w="95%">
                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                  <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <NbText color={'coolGray.800'}>
                      No tienes puntos suficientes para canjear los productos seleccionados.
                    </NbText>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          )}
        </>
      ) : (
        <EmptyCart message="Tu carrito parece estar vacio" />
      )}
      <Button
        style={styles.checkoutButton}
        size="giant"
        onPress={handleExchange}
        disabled={loading || cartInfo.products.length === 0 || leftPoints() < 0}
        accessoryLeft={loading ? LoadingIndicator : undefined}
      >
        {loading ? 'ENVIANDO' : 'CANJEAR'}
      </Button>
    </Box>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 0.5,
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  checkoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
