import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Card, List, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { Box, Button, Divider, HStack, Image, Button as NbButton, Text as NbText, PresenceTransition, ScrollView, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ListRenderItemInfo } from 'react-native';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { baseURL } from '../../../../Axios';
import AddSubstractProduct from '../../../../Components/AddSubstractProduct';
import { CustomIcon } from '../../../../Components/CustomIcon';
import { Loading } from '../../../../Components/Loading';
import { NoData } from '../../../../Components/NoData';
import TopMainBar from '../../../../Components/TopMainBar';
import { colors } from '../../../../Helpers/Colors';
import { sentenceCase } from '../../../../Helpers/FormatToSenteceCase';
import { QueryKeys } from '../../../../Helpers/QueryKeys';
import { ScreenNames } from '../../../../Helpers/ScreenNames';
import { IProduct } from '../../../../interfaces/rrhh/Gamification/IProduct';
import * as RootNavigation from '../../../../Navigator/RootNavigation';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import { GetProducts } from '../../../../Services/rrhh/Gamification';

const renderItemFooter = (info: ListRenderItemInfo<IProduct>): React.ReactElement => {
  // const [selectedQty, setSelectedQty] = useState('0');
  // const cartProducts = useSelector((state: RootState) => state.store.products);
  // const handleChange = (text: string) => setSelectedQty(text);
  // const dispatch = useDispatch();

  // const handleAddingProductQty = (product: IProduct) => {
  //   // const currentQty = parseInt(selectedQty, 10);
  //   // setSelectedQty(`${currentQty + 1}`);

  //   const addingPoint: IShoppingCartItem = {
  //     product: product,
  //     qty: 1,
  //   };
  //   dispatch(addProductQty(addingPoint));
  // };

  // const handleSubstractingProductQty = (product: IProduct) => {
  //   // const currentQty = parseInt(selectedQty, 10);
  //   // setSelectedQty(`${currentQty + 1}`);

  //   const addingPoint: IShoppingCartItem = {
  //     product: product,
  //     qty: 1,
  //   };
  //   dispatch(substractProductQty(addingPoint));
  // };

  // const hasCurrentProduct =
  //   cartProducts &&
  //   cartProducts.length &&
  //   cartProducts.find((item: IShoppingCartItem) => item.product.id === info.item.id);

  // useEffect(() => {
  //   const addingProduct: IShoppingCartItem = {
  //     product: info.item,
  //     qty: parseInt(selectedQty, 10),
  //   };
  //   dispatch(addProduct(addingProduct));
  //   console.log('asdasdasdasd');
  //   return () => {};
  // }, [selectedQty]);

  return (
    <Box p={3} justifyContent="space-between" alignContent="center" flexDirection="row">
      <AddSubstractProduct product={info.item} />
      {`${info.item.pointsRequired} pts.`}
    </Box>
  );
};

export const ProductListScreen = (): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const cartInfo = useSelector((state: RootState) => state.store);
  const profile = useSelector((state: RootState) => state.profile);
  const [leftPoints, setLeftPoints] = useState(0);
  const user = useSelector((state: RootState) => state.auth.login);

  useEffect(() => {
    setLeftPoints(profile.points - cartInfo.totalCart);
  }, [cartInfo, profile]);

  const {
    isLoading,
    isError,
    error,
    isFetching,
    data: products,
    isRefetching,
    refetch,
  } = useQuery([QueryKeys.PRODUCTS], () => GetProducts());

  const renderItemHeader = (info: ListRenderItemInfo<IProduct>): React.ReactElement => (
    <ImageBackground style={styles.itemHeader} source={{ uri: `${baseURL}/images/${info.item.img}` }} />
  );

  const renderProductItem = (info: ListRenderItemInfo<IProduct>): React.ReactElement => {
    return (
      <Card
        style={styles.productItem}
        header={() => renderItemHeader(info)}
        footer={() => renderItemFooter(info)}
        // onPress={() => onItemPress(info.index)}
      >
        {/* <Text category="s1">{info.item.name}</Text>
        <Text appearance="hint" category="c1">
          {info.item.stock} disponible(s)
        </Text> */}
        {/* <Text appearance="hint" category="c1">
          • {info.item.stock} disponible
        </Text> */}
      </Card>
    );
  };
  const BackIcon = (props: any) => <CustomIcon {...props} iconName="arrow-back" />;
  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction icon={BackIcon} onPress={() => RootNavigation.goBack()} />
    </Box>
  );

  const renderRightActions = () => (
    <Box flexDirection="row" alignItems="center">
      <NbButton
        variant="ghost"
        colorScheme="dark"
        rightIcon={<MaterialIcons name="history" size={24} color="black" />}
        onPress={() => {
          RootNavigation.navigate(ScreenNames.COUPON_EXCHANGE);
        }}
      >
        Canjes
      </NbButton>
    </Box>
  );

  if (isLoading) {
    return (
      <Box>
        <Loading message="Cargando Productos..." />
      </Box>
    );
  }

  const renderProduct = (info: ListRenderItemInfo<IProduct>) => {
    return (
      <Box width="50%" maxWidth="50%" mt={5} justifyContent="center" alignItems="center">
        <Image
          background="#eee"
          size="xl"
          borderRadius={10}
          source={{ uri: `${baseURL}/images/${info.item.img}` }}
          alt="persona"
        />
        {/* <NbText>{info.item.name}</NbText> */}
        {/* <Button backgroundColor={colors.secondary} borderRadius="full" mt={3}>
          Canjear
        </Button> */}

        <VStack alignItems="center" mt={3}>
          <NbText color="#fff" textAlign="center">{`${info.item.name}`}</NbText>
          <NbText color="#fff" textAlign="center" bold>{`${info.item.pointsRequired} pts.`}</NbText>
          <Box justifyContent="space-between" alignContent="center" flexDirection="row" my={2}>
            <AddSubstractProduct isBlack={false} product={info.item} />
          </Box>
          <NbText color="#eee" textAlign="center">
            {`${info.item.stock}`} disponible(s)
          </NbText>
        </VStack>
      </Box>
    );
  };

  return (
    <>
      <Box safeArea style={{ flex: 1 }}>
        {/* <TopNavigation
          alignment="center"
          title="Tienda Mundo Diunsa"
          accessoryLeft={renderLeftActions}
          accessoryRight={renderRightActions}
        /> */}
        <TopMainBar showBack showMenu={false} />
        <Box borderRadius={10} backgroundColor="#0175C9" mx={3} flex={0.9}>
          <HStack alignItems="center" justifyContent="space-around" px={10} mt={5}>
            <Image
              size="md"
              ml={-5}
              background="#eee"
              borderRadius={10}
              fallbackSource={require('../../../../../assets/persona.png')}
              source={{ uri: user.picture }}
              alt="persona"
            />
            <VStack>
              <HStack alignItems="center" pt={5} maxWidth="80%">
                <Image size="sm" source={require('../../../../../assets/persona.png')} alt="persona" />
                <VStack>
                  <NbText color="#fff" bold fontSize={14}>
                    {user.employeePosition}
                  </NbText>
                  <HStack>
                    <NbText color="#fff">{sentenceCase(user.username)}</NbText>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
          </HStack>
          <Box mx={10} justifyContent="center" my={3}>
            <Divider />
          </Box>
          <HStack alignItems="center" justifyContent="center" mt={-3}>
            <Image size="sm" source={require('../../../../../assets/tiempo.png')} alt="tiempo" />
            <HStack alignItems="center">
              <NbText color="#4BC9E3" bold fontSize={28}>
                Puntos {profile.points}
              </NbText>
              <Image size="xs" source={require('../../../../../assets/fuego.png')} alt="fuego" />
            </HStack>
          </HStack>
          {!isLoading && (
            <List
              contentContainerStyle={styles.productList}
              data={products}
              // extraData={cartProducts}
              numColumns={2}
              keyExtractor={(item, i) => i.toString()}
              renderItem={renderProduct}
              refreshing={isRefetching}
              onRefresh={refetch}
              style={{
                backgroundColor: 'transparent',
              }}
              ListEmptyComponent={<NoData message="No pudimos encontrar productos" />}
            />
          )}
        </Box>
      </Box>
      <Box style={{ flex: 0.1 }} justifyContent="center" alignContent="center" shadow={2} bg="#fff">
        <Box bg="blue.600" mt={-10} py={2} justifyContent="center" alignItems="center">
          <NbText color="white" bold>
            Puntos disponibles: {leftPoints ?? 0} pts
          </NbText>
        </Box>
        <Box px={5} py={3}>
          {cartInfo.products.length > 0 ? (
            <PresenceTransition
              visible={cartInfo.products.length > 0}
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
              <HStack justifyContent="space-around" alignItems="center">
                <VStack>
                  <Text>
                    {cartInfo.totalCartItems ?? 0} producto
                    {cartInfo.totalCartItems > 1 ? 's' : ''}
                  </Text>
                  <Text>Total: {cartInfo.totalCart ?? 0} pts</Text>
                </VStack>
                <NbButton
                  bg={'#EE7202'}
                  onPress={() => {
                    RootNavigation.navigate(ScreenNames.SHOPPING_CART);
                  }}
                  borderRadius={'100'}
                  flexDirection="row"
                  disabled={cartInfo.products.length === 0}
                >
                  <HStack>
                    <AntDesign name="shoppingcart" size={24} color="white" />
                    <NbText bold color="#fff" px={1}>
                      Ver Carrito
                    </NbText>
                  </HStack>
                </NbButton>
              </HStack>
            </PresenceTransition>
          ) : (
            <Text>Agrega productos a tu carrito</Text>
          )}
        </Box>
      </Box>
    </>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  productList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  productItem: {
    flex: 1,
    margin: 8,
    maxWidth: Dimensions.get('window').width / 2 - 24,
    backgroundColor: 'background-basic-color-1',
  },
  itemHeader: {
    height: 140,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
