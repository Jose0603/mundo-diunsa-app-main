import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Box, Image, Pressable, Text, TextArea, useToast } from 'native-base';
import React, { useCallback, useRef, useState } from 'react';
import { ListRenderItemInfo, Platform, useWindowDimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { baseURL } from '../Axios';
import { Img } from '../interfaces/rrhh/INews';
import ImageDetailViewer from './ImageDetailViewer';

interface IProps {
  data: Img[];
}

const ImageCarrousel = ({ data }: IProps) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const carrouselRef = useRef<any>();
  const videoRef = useRef(null);
  const [showImageDetail, setShowImageDetail] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const toggleVisible = () => {
    setShowImageDetail(!showImageDetail);
  };

  // <Pressable height={180} borderRadius="2xl" onPress={() =>toggleVisible();}>
  //       <Image
  //         borderRadius="2xl"
  //         source={news.mainImg ? { uri: `${baseURL}/images/${news.mainImg}` } : require('../../assets/news_bg.png')}
  //         style={{
  //           resizeMode: 'cover',
  //           width: '100%',
  //           height: '100%',
  //         }}
  //         alt={news.title}
  //       />
  //     </Pressable>

  const renderCarrousel = useCallback(
    ({ item, index }: ListRenderItemInfo<Img>) => {
      if (item.mimeType.includes('image')) {
        return (
          <Pressable
            height={180}
            borderRadius="2xl"
            justifyContent="center"
            alignItems="center"
            backgroundColor="#eee"
            mx={3}
            onPress={() => {
              setSelectedImage(index);
              toggleVisible();
            }}
          >
            <Image
              source={{ uri: `${baseURL}/images/${item.name}` }}
              fallbackSource={require('../../assets/logo_app.png')}
              alt="Diunsa"
              // size="2xl"
              borderRadius="2xl"
              style={{
                resizeMode: 'contain',
                width: '100%',
                height: '100%',
              }}
            />
          </Pressable>
        );
      } else {
        return !showVideo ? (
          <Pressable
            height={180}
            borderRadius="2xl"
            justifyContent="center"
            alignItems="center"
            mx={3}
            backgroundColor={'rgba(0,0,0, .85)'}
            onPress={() => {
              setShowVideo(!showVideo);
              if (videoRef.current) {
                videoRef.current.setStatusAsync({
                  shouldPlay: true,
                });
              }
            }}
          >
            <Feather name="play-circle" size={24} color="#fff" />
            <Text color="#fff">Reproducir video</Text>
          </Pressable>
        ) : (
          <Pressable
            height={180}
            borderRadius="2xl"
            justifyContent="center"
            alignItems="center"
            backgroundColor="#eee"
            mx={3}
            onPress={() => {
              // toggleVisible();
            }}
          >
            <Video
              ref={videoRef}
              style={{ height: '100%', width: '100%' }}
              source={{
                uri: `${baseURL}/images/${item.name}`,
              }}
              useNativeControls
              // shouldPlay
              // isMuted
              // shouldRasterizeIOS
              resizeMode="contain"
              isLooping
              // isMuted={false}
              // volume={1}
              // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
          </Pressable>
        );
      }
    },
    [showVideo]
  );

  return (
    <>
      <ImageDetailViewer
        visible={showImageDetail}
        toggleVisible={toggleVisible}
        showingImages={data.filter((item) => item.mimeType.includes('image'))}
        selectedImage={selectedImage}
      />
      <Carousel
        ref={(c: any) => {
          carrouselRef.current = c;
        }}
        layout={'stack'}
        data={data}
        renderItem={renderCarrousel}
        sliderWidth={Platform.OS === 'web' ? (width * 75) / 100 : width}
        itemWidth={Platform.OS === 'web' ? (width * 75) / 100 : width}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      {carrouselRef.current && (
        <Box w="100%">
          <Pagination
            dotsLength={data.length}
            activeDotIndex={activeIndex}
            tappableDots
            carouselRef={carrouselRef.current}
            containerStyle={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
            dotStyle={{
              width: 5,
              height: 5,
              borderRadius: 5,
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
            }}
            inactiveDotStyle={
              {
                // Define styles for inactive dots here
              }
            }
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </Box>
      )}
    </>
  );
};

export default React.memo(ImageCarrousel);
