import { DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type DrawerItemMNDProps = { focused: boolean; size: number; color: string }

export const DrawerItemMND = (
  props: JSX.IntrinsicAttributes & {
    label: string | ((props: { focused: boolean; color: string }) => React.ReactNode);
    icon?: (props: DrawerItemMNDProps) => React.ReactNode;
    to?: string;
    focused?: boolean;
    onPress: () => void;
    activeTintColor?: string;
    inactiveTintColor?: string;
    activeBackgroundColor?: string;
    inactiveBackgroundColor?: string;
    pressColor?: string;
    pressOpacity?: number;
    labelStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    allowFontScaling?: boolean;
  }
) => {
  return (
    <DrawerItem
      labelStyle={{ color: props.focused ? '#0077CD' : '#222A45', fontWeight: 'bold' }}
      activeTintColor="#0077CD"
      inactiveTintColor="#222A45"
      style={{ backgroundColor: props.focused ? '#F2F2F2' : 'transparent' }}
      {...props}
    />
  );
};
