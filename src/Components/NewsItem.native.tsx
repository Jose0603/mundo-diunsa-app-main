import { View, StyleSheet as RNStyleSheet, Platform, ImageBackground } from 'react-native';
import React from 'react';
import { Box, Text as NBText, HStack, Pressable, Image, VStack, Icon } from 'native-base';
import { INews } from '../interfaces/rrhh/INews';
import * as RootNavigation from '../Navigator/RootNavigation';
import { ScreenNames } from '../Helpers/ScreenNames';
import { baseURL } from '../Axios';
import CustomCalendarIcon from './CustomCalendarIcon';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';

interface IProps {
  news: INews;
  fromMainMenu?: boolean;
  category?: number;
}

const NewsFooterDetail = ({ news }: IProps) => {
  return (
    <HStack px={4} pt={3}>
      <VStack maxWidth="80%" width="80%">
        <NBText style={{ zIndex: 1 }} fontSize="14" color="#000">
          {news.title}
          {Platform.OS !== 'web' && <NBText color="blue.500"> Lee la noticia y gana puntos</NBText>}
        </NBText>

        {/* {Platform.OS !== "web" && ( */}
        <NBText _web={{ mt: 1 }} color="coolGray.700" fontSize="12" mt={2}>
          Redacción: {news.createdBy}
        </NBText>
        {/* )} */}
        {Platform.OS === 'web' && (
          <NBText color="coolGray.700">
            <Icon as={AntDesign} mr="1" mt="1" size="6" name="calendar" />
            {moment(news.createdAt).format('DD MMMM, YYYY')}
          </NBText>
        )}
      </VStack>
      {Platform.OS !== 'web' && (
        <Box maxWidth="20%" width="20%" justifyContent="center" alignItems="center" ml={5}>
          <CustomCalendarIcon date={news.createdAt} />
        </Box>
      )}
    </HStack>
  );
};

const NewsItem = ({ news, fromMainMenu = false, category }: IProps) => {
  const onItemPress = (index: number): void => {
    fromMainMenu
      ? RootNavigation.push(ScreenNames.NEWS_DETAIL_STACK, {
          news: null,
          newsId: index,
        })
      : RootNavigation.navigate(ScreenNames.NEWS_DETAIL, {
          news: null,
          newsId: index,
        });
  };

  if (category > 0) {
    // var newsArr= news?.categories?.find(x => x.value === category)?true:false;
    // var newsArr;
    // if(news?.categories?.find(x => x.value === category))
    //   newsArr = news;
    // console.log("🚀 ~ file: NewsItem.tsx ~ line 55 ~ NewsItem ~ newsArr", newsArr)

    // if(newsArr!=false){

    return (
      <>
        {news?.categories?.find((x) => x.value === category) && (
          <Pressable
            _web={{
              // width: "33%",
              maxWidth: '33%',
              minWidth: '33%',
              borderWidth: 1,

              borderColor: '#eee',

              //   alignItems: "center",
            }}
            _hover={{
              bg: 'blue.200',
            }}
            borderRadius={10}
            mx={3}
            mb={10}
            onPress={() => onItemPress(news.id)}
          >
            <Box
              height={180}
              borderRadius="2xl"
              _web={{
                borderRadius: 'xl',
              }}
              bg="#fff"
            >
              <Image
                _web={{ borderRadius: 'xl' }}
                borderRadius="2xl"
                source={
                  news.mainImg ? { uri: `${baseURL}/images/${news.mainImg}` } : require('../../assets/news_bg.png')
                }
                style={{
                  resizeMode: 'contain',
                  width: '100%',
                  height: '100%',
                }}
                alt={news.title}
              />
            </Box>
            <NewsFooterDetail news={news} />
          </Pressable>
        )}
      </>
    );
    // }
  } else {
    return (
      <Pressable
        _web={{
          // width: "33%",
          borderWidth: 1,
          borderColor: '#eee',
          maxWidth: '32%',
          minWidth: '32%',
          mx: 3,
          //   alignItems: "center",
        }}
        _hover={{
          bg: 'blue.200',
        }}
        borderRadius={'xl'}
        mx={1}
        mb={10}
        onPress={() => onItemPress(news.id)}
      >
        <Box
          height={180}
          borderRadius="2xl"
          _web={{
            borderRadius: 'xl',
          }}
          bg="#fff"
        >
          <Image
            _web={{ borderRadius: 'xl' }}
            borderRadius="2xl"
            source={news.mainImg ? { uri: `${baseURL}/images/${news.mainImg}` } : require('../../assets/news_bg.png')}
            style={{
              resizeMode: 'contain',
              width: '100%',
              height: '100%',
            }}
            alt={news.title}
          />
        </Box>
        <NewsFooterDetail news={news} />
      </Pressable>
    );
  }
};

const styles = RNStyleSheet.create({
  itemImage: {
    // ...RNStyleSheet.absoluteFillObject,
    height: 150,
    // paddingVertical: 24,
    // paddingHorizontal: 16,
  },
  itemTitle: {
    zIndex: 1,
    // textAlign: 'justify',
  },
  itemDescription: {
    zIndex: 1,
    marginVertical: 16,
  },
  itemFooter: {
    position: 'absolute',
    flexDirection: 'row',
    right: 8,
    bottom: 8,
    alignItems: 'flex-end',
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});

export default NewsItem;
