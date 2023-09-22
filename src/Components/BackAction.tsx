import React from 'react';
import { Divider, Icon, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import * as RootNavigation from '../Navigator/RootNavigation';

export const BackAction = (props: any) => {
  const navigateBack = () => {
    RootNavigation.goBack();
  };

  //   const renderRightActions = () => (
  //    <React.Fragment>
  //      <TopNavigationAction icon={EditIcon}/>
  //      <OverflowMenu
  //        anchor={renderMenuAction}
  //        visible={menuVisible}
  //        onBackdropPress={toggleMenu}>
  //        <MenuItem accessoryLeft={InfoIcon} title='About'/>
  //        <MenuItem accessoryLeft={LogoutIcon} title='Logout'/>
  //      </OverflowMenu>
  //    </React.Fragment>
  //  );

  return <TopNavigationAction icon={props.icon} onPress={navigateBack} />;
};
