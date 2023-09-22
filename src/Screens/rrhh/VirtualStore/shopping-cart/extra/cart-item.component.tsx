import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, ListItem, ListItemProps, Text } from '@ui-kitten/components';
import { CloseIcon } from './icons';
import { IShoppingCartItem } from '../../../../../interfaces/rrhh/Gamification/IProduct';
import { baseURL } from '../../../../../Axios';
import { deleteProduct } from '../../../../../Redux/reducers/store/storeSlice';
import { useDispatch } from 'react-redux';
import AddSubstractProduct from '../../../../../Components/AddSubstractProduct';
import { Box } from 'native-base';

export type CartItemProps = ListItemProps & {
  index: number;
  product: IShoppingCartItem;
};

export const CartItem = (props: CartItemProps): React.ReactElement => {
  const { style, product, index, ...listItemProps } = props;
  const dispatch = useDispatch();

  const onRemoveButtonPress = (): void => {
    dispatch(deleteProduct(product.product.id));
  };

  return (
    <ListItem {...listItemProps} style={[styles.container, style]}>
      <Image
        style={styles.image}
        source={{ uri: `${baseURL}/images/${product.product.img}` }}
      />
      {/* <View style={styles.detailsContainer}>
        <Text category="s1">{product.product.name}</Text>
        <Text category="s2">{product.product.pointsRequired} pts.</Text>
        <AddSubstractProduct product={product.product} />
      </View> */}
      <Box h={'144px'} justifyContent='space-between'>
        <Box pl={3} pt={3}>
          <Text category='s1'>{product.product.name}</Text>
          <Text category='s2'>{product.product.pointsRequired} pts.</Text>
        </Box>
        <Box pl={3} pb={3}>
          <AddSubstractProduct product={product.product} />
        </Box>
      </Box>
      <Button
        style={[styles.iconButton, styles.removeButton]}
        appearance='ghost'
        status='basic'
        accessoryLeft={CloseIcon}
        onPress={onRemoveButtonPress}
      />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 5,
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
    position: 'absolute',
    flexDirection: 'row',
    left: 16,
    bottom: 16,
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
  },
});
