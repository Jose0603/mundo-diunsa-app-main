import { useLinkProps } from '@react-navigation/native';
import { DrawerItem } from '@ui-kitten/components';
import { View } from 'native-base';
import React from 'react';

export const DrawerItemLink = ({ title, key, to, accessoryLeft }: any) => {
  const { onPress, ...props } = useLinkProps({ to });
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <View
      onClick={onPress}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ opacity: isHovered ? 0.5 : 1 }}
      {...props}
    >
      <DrawerItem
        title={title}
        key={key}
        accessoryLeft={accessoryLeft}
        onPress={() => {
          onPress();
        }}
      />
    </View>
  );
};
