import React from 'react';
import { ImageStyle } from 'react-native';
import { Icon, IconElement } from '@ui-kitten/components';
import { AntDesign } from '@expo/vector-icons';

// export const CloseIcon = (style: ImageStyle): IconElement => (
//   <Icon {...style} name='close'/>
// );

// export const MinusIcon = (style: ImageStyle): IconElement => (
//   <Icon {...style} name='minus'/>
// );

// export const PlusIcon = (style: ImageStyle): IconElement => (
//   <Icon {...style} name='plus'/>
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
