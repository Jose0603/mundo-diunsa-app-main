import { View, StyleSheet as RNStyleSheet } from 'react-native';
import React from 'react';
import { Card } from '@ui-kitten/components';
import { Box, Text as NBText, HStack } from 'native-base';
import { INews } from '../interfaces/rrhh/INews';
import { ImageOverlay } from './ImageOverlay';
import moment from 'moment';
import { ToggleNewsLike } from '../Services/rrhh/News';
import * as RootNavigation from '../Navigator/RootNavigation';
import { ScreenNames } from '../Helpers/ScreenNames';
import LikeButton from './LikeButton';
import { baseURL } from '../Axios';

interface IProps {
  news: INews;
  fromMainMenu?: boolean;
}

const NewsItemMainMenu = ({ news, fromMainMenu = false }: IProps) => {
  const onItemPress = (index: number): void => {
    fromMainMenu
      ? RootNavigation.navigate(ScreenNames.RRHH, {
          screen: ScreenNames.HOME_NEWS,
          params: {
            screen: ScreenNames.NEWS_DETAIL,
            params: { news: null, newsId: index },
          },
        })
      : RootNavigation.navigate(ScreenNames.HOME_NEWS, {
          screen: ScreenNames.NEWS_DETAIL,
          params: { news: null, newsId: index },
        });
  };

  return (
    <Box mx={0} borderRadius={0} mb={3}>
      <HStack px={3}>
        <NBText bold>{news.createdBy}</NBText>
        <NBText color="coolGray.700" ml={2}>
          {moment(news.createdAt).format('dddd DD MMMM YYYY')}
        </NBText>
      </HStack>
      <Card style={styles.item} onPress={() => onItemPress(news.id)}>
        <ImageOverlay
          style={[styles.itemImage, { padding: 200 }]}
          source={news.mainImg ? { uri: `${baseURL}/images/${news.mainImg}` } : require('../../assets/news_bg.png')}
        >
          <NBText style={styles.itemTitle} fontSize="22" color="white" bold>
            {news.title}
          </NBText>
          {/* <Text style={styles.itemDescription} category="s1" status="control">
       {news.description}
     </Text> */}
          <View style={styles.itemFooter}>
            {/* <Button style={styles.iconButton} appearance="ghost" status="control" accessoryLeft={MessageCircleIcon}>
           {`${news.likes.qty}`}
         </Button> */}
            <LikeButton id={news.id} serviceFn={ToggleNewsLike} likes={news.likes} />
          </View>
        </ImageOverlay>
      </Card>
    </Box>
  );
};

const styles = RNStyleSheet.create({
  item: {
    marginVertical: 8,
    height: 220,
    // borderRadius: 10,
  },
  itemImage: {
    ...RNStyleSheet.absoluteFillObject,
    height: 220,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  itemTitle: {
    zIndex: 1,
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

export default NewsItemMainMenu;
