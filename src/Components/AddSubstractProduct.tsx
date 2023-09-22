import { View, StyleSheet, ImageStyle, Platform } from 'react-native';
import React from 'react';
import { Button, Text } from '@ui-kitten/components';
// import { Icon, IconElement } from "@ui-kitten/components";
import {
  IProduct,
  IShoppingCartItem,
} from '../interfaces/rrhh/Gamification/IProduct';
import {
  addProductQty,
  substractProductQty,
} from '../Redux/reducers/store/storeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/reducers/rootReducer';
import { colors } from '../Helpers/Colors';
import { AntDesign } from '@expo/vector-icons';

// export const CloseIcon = (style: ImageStyle): IconElement => (
//   <Icon {...style} name="close" />
// );

// export const MinusIcon = (style: ImageStyle): IconElement => (
//   <Icon {...style} name="minus" />
// );

// export const PlusIcon = (style: ImageStyle): IconElement => (
//   <Icon {...style} name="plus" />
// );

export const CloseIcon = (style: ImageStyle) => (
  <AntDesign {...style} name='close' />
);

export const MinusIcon = (style: ImageStyle) => (
  <AntDesign {...style} name='minus' />
);

export const PlusIcon = (style: ImageStyle) => (
  <AntDesign {...style} name='plus' />
);

interface IProps {
  product: IProduct;
  isBlack?: boolean;
}

export default function AddSubstractProduct({
  product,
  isBlack = true,
}: IProps) {
  const dispatch = useDispatch();
  const cartInfo = useSelector((state: RootState) => state.store);
  const profile = useSelector((state: RootState) => state.profile);

  const thisProductData = cartInfo.products.find(
    (item: IShoppingCartItem) => item.product.id === product.id
  );

  const handleAddingProductQty = () => {
    // const currentQty = parseInt(selectedQty, 10);
    // setSelectedQty(`${currentQty + 1}`);

    const addingPoint: IShoppingCartItem = {
      product: product,
      qty: 1,
    };
    dispatch(addProductQty(addingPoint));
  };
  const handleSubstractingProductQty = () => {
    // const currentQty = parseInt(selectedQty, 10);
    // setSelectedQty(`${currentQty + 1}`);

    const addingPoint: IShoppingCartItem = {
      product: product,
      qty: 1,
    };
    dispatch(substractProductQty(addingPoint));
  };

  const decrementButtonEnabled = (): boolean => {
    return thisProductData?.qty > 0;
  };

  const incrementButtonEnabled = (): boolean => {
    return profile.points > cartInfo.totalCart;
  };

  return (
    <View style={styles.amountContainer}>
      <Button
        style={[
          Platform.OS === 'web' ? styles.iconButtonWeb : styles.iconButton,
          styles.amountButton,
        ]}
        size='tiny'
        accessoryLeft={MinusIcon}
        onPress={handleSubstractingProductQty}
        disabled={!decrementButtonEnabled()}
      />
      <Text
        style={[styles.amount, { color: isBlack ? '#000' : '#fff' }]}
        category='s2'
      >
        {`${thisProductData?.qty ?? 0}`}
      </Text>
      <Button
        style={[
          Platform.OS === 'web' ? styles.iconButtonWeb : styles.iconButton,
          ,
          styles.amountButton,
        ]}
        size='tiny'
        accessoryLeft={PlusIcon}
        onPress={handleAddingProductQty}
        disabled={!incrementButtonEnabled()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  image: {
    width: 120,
    height: 144,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    padding: 16,
  },
  amountContainer: {
    // position: 'absolute',
    flexDirection: 'row',
    // left: 16,
    // bottom: 16,
  },
  amountButton: {
    borderRadius: 16,
  },
  amount: {
    textAlign: 'center',
    width: 40,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
  },
  iconButton: {
    paddingHorizontal: 0,
    backgroundColor: colors.secondary,
  },
  iconButtonWeb: {
    paddingHorizontal: 0,
  },
});
