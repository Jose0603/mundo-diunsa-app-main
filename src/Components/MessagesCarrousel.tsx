import { Box, Center, Text } from 'native-base';
import React, { useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { IReminder } from '../interfaces/IIncident';

interface IProps {
  data: IReminder[];
}

const MessagesCarrousel = ({ data }: IProps) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const carrouselRef = useRef<any>();

  // const color ={
  //   ['rgba(79,127,250,1)', 'rgba(51, 95, 209, 100)'], // azul
  //   ['rgba(253,122,122,255)','rgba(253,84,84,255)'],  // rojo
  //   ['rgba(246,181,122,255)','rgba(242,151,68,255)'], // naranja
  //   ['rgba(131,212,117,255)','rgba(46,182,44,255)']  // verde
  // }

  const CarouselCardItem = ({ item, index }) => {
    return (
      <Box
        mx={3}
        my={3}
        borderRadius={15}
        justifyContent="center"
        alignItems="center"
        display={'flex'}
        height={100}
        bg={{
          linearGradient: {
            colors: ['rgba(255,186,40,100)', 'rgba(219,149,0,100)'],
            start: [0, 0],
            end: [1, 0],
          },
        }}
        key={index}
        shadow="2"
      >
        <Text color={'white'} px={2} textAlign={'center'} bold>
          {item.description}
        </Text>
      </Box>
    );
  };

  return (
    <>
      <View style={{ display: 'flex' }}>
        <Carousel
          ref={(c: any) => {
            carrouselRef.current = c;
          }}
          layout={'tinder'}
          data={data}
          renderItem={CarouselCardItem}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={(index) => setActiveIndex(index)}
          useScrollView={true}
          // firstItem={Object.keys(data).length}
          // initialScrollIndex={Object.keys(data).length}
          // getItemLayout={(data, index) => (
          //   {length: width, offset: width * index, index}
          //   )}
          // horizontal={true}
          loop={true}
          // loopClonesPerSide={Object.keys(data).length}
        />
        {carrouselRef.current && (
          <Pagination
            dotsLength={Object.keys(data).length ? Object.keys(data).length : 0}
            activeDotIndex={activeIndex}
            carouselRef={carrouselRef.current}
            containerStyle={{ marginTop: -20, marginBottom: -20 }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
          />
        )}
      </View>
    </>
  );
};

export default React.memo(MessagesCarrousel);
