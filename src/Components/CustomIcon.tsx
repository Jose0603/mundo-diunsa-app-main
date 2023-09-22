// import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from '@ui-kitten/components';

import React from 'react';

export const CustomIcon = (props: any) => (
  <Ionicons {...props} size={24} name={props.iconName} />
);
