import React from 'react';
import { ImageStyle } from 'react-native';
import { Icon, IconElement } from '@ui-kitten/components';

export const CartIcon = (style: ImageStyle): IconElement => <Icon {...style} name="shopping-cart" />;
export const PlusIcon = (style: ImageStyle): IconElement => <Icon {...style} name="plus-circle-outline" />;
export const MinusIcon = (style: ImageStyle): IconElement => <Icon {...style} name="minus-circle-outline" />;
