/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import { View, Animated, useWindowDimensions, Easing, Platform } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as RootNavigation from '../navigator/RootNavigation';

export const AnimatedSearchBar = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const searchInp: any = useRef();

  const leftPosition: Animated.Value = useRef(new Animated.Value(width)).current;

  const easeIn = () => {
    leftPosition.setValue(width);
    const animConfig: Animated.TimingAnimationConfig = {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    };
    Animated.timing(leftPosition, animConfig).start();
  };

  const easeOut = () => {
    const animConfig: Animated.TimingAnimationConfig = {
      toValue: width,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    };
    Animated.timing(leftPosition, animConfig).start();
  };

  const animatedStyles = [
    {
      width,
      left: leftPosition,
    },
  ];

  return (
    <View style={{ backgroundColor: '#fff', paddingTop: Math.max(insets.top, 16) }}>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: '#fff',
          //  width: 700,
          //  position: 'absolute',
        }}
      >
        <Animated.View style={[{ position: 'absolute', zIndex: 10, width: '100%' }, animatedStyles]}>
          <SearchBar
            ref={searchInp}
            placeholder="Buscar"
            platform={Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'default'}
            showCancel={true}
            onChangeText={(e: any) => {
              setSearch(e.trim());
            }}
            onSubmitEditing={() => {
              if (search !== '') {
                setSearch('');
                // RootNavigation.navigate('NewsSearchScreen', {
                //   searchingTag: search,
                // });
                easeOut();
              }
            }}
            onCancel={() => {
              easeOut();
            }}
            cancelButtonTitle={'Cancelar'}
            round={true}
            lightTheme={true}
            value={search}
            containerStyle={[
              {
                backgroundColor: '#fff',
                borderColor: '#fff',
                marginVertical: 10,
                maxWidth: width,
                width: '100%',
              },
            ]}
            inputStyle={{ color: '#000' }}
          />
        </Animated.View>
        <Icon
          name="search"
          size={25}
          style={{ paddingRight: 20 }}
          color="#0071ED"
          onPress={() => {
            easeIn();
            if (searchInp) {
              searchInp.current.focus();
            }
            //  setVisible(!visible);
            // RootNavigation.navigate('ModalScreen');
          }}
        />
      </View>
    </View>
  );
};
