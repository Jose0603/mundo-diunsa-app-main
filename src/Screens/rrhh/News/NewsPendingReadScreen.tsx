import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import moment from 'moment';
import {
  Box,
  FlatList,
  HStack,
  Button as NbButton,
  Text as NBText,
  useDisclose,
} from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ListRenderItemInfo,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';

import { ActionSheetNews } from '../../../Components/ActionSheetNews';
import LoadingFooter from '../../../Components/LoadingFooter';
import NewsItem from '../../../Components/NewsItem';
import NewsSkeleton from '../../../Components/NewsSkeleton';
import { NoData } from '../../../Components/NoData';
import TopMainBar from '../../../Components/TopMainBar';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { PageInfo } from '../../../interfaces/IIncident';
import { INews } from '../../../interfaces/rrhh/INews';
import { WebDrawer } from '../../../Navigator/WebDrawer';
import { GetAllNews, GetPendingRead } from '../../../Services/rrhh/News';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export default function NewsPendingReadScreen({ navigation }: IProps) {
  const MenuIcon = (props: any) => (
    <Ionicons {...props} name='menu' size={24} />
  );
  const { width } = useWindowDimensions();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [pagedInfo, setPagedInfo] = useState<PageInfo>({
    count: 20,
    totalCount: 20,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
    totalPages: 1,
  });
  const [startNormalDate, setStartNormalDate] = useState(new Date());
  const [endNormalDate, setEndNormalDate] = useState(new Date());
  const [search, setSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('-1');
  const [news, setNews] = useState<INews[]>([]);

  const fetchNews = async () => {
    try {
      const res = await GetPendingRead({
        Page: page,
        Limit: 10,
      });
      if (page > 1) {
        setNews([...news, ...res.data.news.rows]);
      } else {
        setNews([...res.data.news.rows]);
      }
      setPagedInfo(res.data.news.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setIsLoading(true);
    setPage(1);
    setNews([]);
    try {
      const res = await GetPendingRead({
        Page: 1,
        Limit: 10,
      });
      if (page > 1) {
        setNews([...news, ...res.data.news.rows]);
      } else {
        setNews([...res.data.news.rows]);
      }
      setPagedInfo(res.data.news.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchNews();
  }, [search, page]);

  const onItemPress = (index: number): void => {
    navigation &&
      navigation.navigate(ScreenNames.NEWS_DETAIL_STACK, {
        news: null,
        newsId: index,
      });
  };

  const renderLeftActions = () => (
    <Box flexDirection='row' alignItems='center'>
      <TopNavigationAction
        icon={MenuIcon}
        onPress={() => navigation.toggleDrawer()}
      />
      <NbButton
        onPress={() => {
          onOpen();
        }}
        disabled={isLoading}
        variant='ghost'
        _pressed={{ bg: 'coolGray.100' }}
        endIcon={
          <MaterialIcons name='arrow-drop-down' size={24} color='black' />
        }
      >
        <NBText color='coolGray.700' fontWeight='bold'>
          Filtros
        </NBText>
        <NBText color='coolGray.700' fontWeight='bold'>
          Noticias
        </NBText>
      </NbButton>
    </Box>
  );

  interface IRenderProps {
    item: INews;
  }

  const renderItem = (info: ListRenderItemInfo<INews>): React.ReactElement => (
    <NewsItem news={info.item} fromMainMenu />
  );

  return (
    <HStack flex={1} backgroundColor='#fff'>
      {/* <TopNavigation
        alignment="center"
        // title="Anuncios"
        // subtitle="Subtitle"
        accessoryLeft={renderLeftActions}
        // accessoryRight={renderRightActions}
      /> */}
      <Box
        backgroundColor='#fff'
        w={'25%'}
        borderRightWidth={1}
        borderColor='#D8D8D8'
      >
        <WebDrawer />
      </Box>
      <Box w={'75%'}>
        <TopMainBar showBack showMenu={false} />

        {isLoading && page === 1 ? (
          // <Loading message="Cargando Noticias..." />
          // <NewsSkeleton />
          <FlatList
            data={[1, 2, 3, 4, 5]}
            _contentContainerStyle={{
              marginX: '48',
            }}
            keyExtractor={(item) => {
              return `skeleton-news-${item}`;
            }}
            renderItem={NewsSkeleton}
          />
        ) : (
          <FlatList
            data={news}
            extraData={news}
            _contentContainerStyle={{
              marginX: '48',
            }}
            onEndReached={() => {
              if (pagedInfo.currentPage < pagedInfo.totalPages) {
                setPage(page + 1);
              }
            }}
            ListFooterComponent={<LoadingFooter isLoading={isLoading} />}
            keyExtractor={(item) => `anuncio-${item.id}`}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={<NoData />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={renderItem}
          />
        )}
        <ActionSheetNews
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          setSearch={setSearch}
          setStartDate={setStartNormalDate}
          setEndDate={setEndNormalDate}
          search={search}
        />
      </Box>
    </HStack>
  );
}
