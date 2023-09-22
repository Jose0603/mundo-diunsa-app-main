import { Box, Pressable } from 'native-base';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';
import { NoData } from './NoData';

const rowTranslateAnimatedValues = {};
Array(20)
  .fill('')
  .forEach((_, i) => {
    rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
  });

interface IProps {
  listDatum: any[];
}

export default function SwipeableRow({ listDatum = [] }: IProps) {
  // console.log('lista', listDatum);
  const animationIsRunning = useRef(false);
  const [listData, setListData] = useState(listDatum);
  //   const [listData, setListData] = useState(
  //     Array(20)
  //       .fill('')
  //       .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
  //   );

  const onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;
    if (value < -Dimensions.get('window').width && !animationIsRunning.current) {
      // this.animationIsRunning = true;
      animationIsRunning.current = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const newData = [...listData];
        const prevIndex = listData.findIndex((item) => item.key === key);
        newData.splice(prevIndex, 1);
        setListData(newData);
        animationIsRunning.current = false;
        //   this.animationIsRunning = false;
      });
    }
  };

  const renderItem = (data) => {
    return (
      <Animated.View
        style={[
          //   styles.rowFrontContainer,
          {
            height: rowTranslateAnimatedValues[data.item.id].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 50],
            }),
          },
        ]}
      >
        <Pressable
          onPress={() => console.log('You touched me')}
          style={styles.rowFront}
          p={3}
          borderRadius={3}
          backgroundColor="#fff"
        >
          <View>
            <Text>I am {data.item.title} in a SwipeListView</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const renderHiddenItem = () => (
    <Box style={styles.rowBack} p={3} borderRadius={3}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Eliminar</Text>
      </View>
    </Box>
  );

  return (
    <View style={styles.container}>
      <SwipeListView
        disableRightSwipe
        data={listDatum}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        keyExtractor={(item) => `notificacion-${item.id}`}
        ListEmptyComponent={<NoData />}
        rightOpenValue={-Dimensions.get('window').width}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={300}
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 70,
  },
  rowBack: {
    height: 70,
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});
