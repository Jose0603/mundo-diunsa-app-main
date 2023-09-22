import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Loading } from '../../../Components/Loading';
import TopMainBar from '../../../Components/TopMainBar';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { useSingleNews } from '../../../hooks/useNews';
import { INews } from '../../../interfaces/rrhh/INews';
import { setProfile } from '../../../Redux/reducers/auth/profileSlice';
import { GetNewsDetail } from '../../../Services/rrhh/News';
import { getMyPoints } from '../../../Services/User';
import ContentView from './articles';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

const AnnouncementDetailScreen = ({ navigation, route }: IProps) => {
  // const [news, setNews] = useState<INews>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isMounted = useIsMountedRef().current;

  const newsId = route?.params?.newsId;

  const { news, isLoading } = useSingleNews(newsId);

  const fetchMyPoints = async () => {
    try {
      const res = await getMyPoints();
      if (res.result && isMounted) {
        dispatch(setProfile(res.data.points));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchAdDetail = async (adId: number) => {
  //   try {
  //     const res = await GetNewsDetail(adId);
  //     setNews(res);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //     fetchMyPoints();
  //   }
  // };

  useFocusEffect(
    React.useCallback(() => {
      fetchMyPoints();
    }, [newsId])
  );

  // useEffect(() => {
  //   // console.log(route);
  //   // if (route && route.params && route.params.news !== null) {
  //   //   setNews(route.params.news);
  //   // } else if (!news) {
  //   setIsLoading(true);
  //   fetchAdDetail(newsId);
  //   // }
  // }, [route]);

  //   if (route && route.params && route.params.news) {
  //     setNews(route.params.incident);
  //   } else {
  //     if (route && route.params && route.params.newsId) {
  //       // fetch news Data
  //     }
  //   }

  return (
    <Box flex={1} safeArea backgroundColor='#fff'>
      <TopMainBar showBack showMenu={false} backToNews />
      {isLoading || news === null ? (
        <Loading message='Cargando noticia...' />
      ) : (
        // <Box
        //   _web={{
        //     paddingX: '10%',
        //   }}
        // >
        <ContentView news={news} />
        // </Box>
      )}
    </Box>
  );
};

export default AnnouncementDetailScreen;
