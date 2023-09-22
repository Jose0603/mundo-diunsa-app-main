import React, { useContext, useRef } from 'react';
import { PixelRatio, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import { Button, Icon, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { ThemeContext } from '../themeContext';
import { Box } from 'native-base';

export const HomeScreen = ({ navigation }: any) => {
  const themeContext = useContext(ThemeContext);
  const imageView = useRef(null);
  const targetPixelCount = 1080;
  const pixelRatio = PixelRatio.get();
  const pixels = targetPixelCount / pixelRatio;

  const navigate = (screen: string) => {
    navigation.navigate(screen);
  };

  const BackAction = () => <TopNavigationAction onPress={() => {}} />;

  const take = async () => {
    try {
      const res = await captureRef(imageView, {
        result: 'tmpfile',
        height: pixels,
        width: pixels,
        quality: 1,
        format: 'jpg',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const BellIcon = (props: any) => <Icon {...props} name="bell-outline" />;
  const MenuIcon = (props: any) => <Icon {...props} name="menu-2-outline" />;

  const renderRightActions = () => (
    <>
      <TopNavigationAction icon={BellIcon} />
      {/* <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}>
        <MenuItem accessoryLeft={InfoIcon} title='About'/>
        <MenuItem accessoryLeft={LogoutIcon} title='Logout'/>
      </OverflowMenu> */}
    </>
  );
  const renderLeftActions = () => (
    <>
      <TopNavigationAction icon={MenuIcon} onPress={() => navigation.toggleDrawer()} />
      {/* <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}>
        <MenuItem accessoryLeft={InfoIcon} title='About'/>
        <MenuItem accessoryLeft={LogoutIcon} title='Logout'/>
      </OverflowMenu> */}
    </>
  );

  return (
    <Box flex={1} safeArea>
      <TopNavigation
        alignment="center"
        title="Mantenimiento"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
        accessoryRight={renderRightActions}
      />
      <View ref={imageView} style={{ flex: 1 }}>
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button style={{ marginVertical: 4 }} onPress={() => navigate('Details')}>
            OPEN DETAILS
          </Button>
          {/* <Button style={{ marginVertical: 4 }} onPress={() => navigate('Login')}>
            LOGIN
          </Button> */}
          <Button style={{ marginVertical: 4 }} onPress={take}>
            TOGGLE THEME
          </Button>
          <Button style={{ marginVertical: 4 }} onPress={() => navigation.toggleDrawer()}>
            TOGGLE THEME
          </Button>
        </Layout>
      </View>
    </Box>
  );
};
