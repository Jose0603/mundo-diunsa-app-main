import { MaterialIcons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { TopNavigationAction } from '@ui-kitten/components';
import moment from 'moment';
import { Box, FlatList, Button as NbButton, Text as NBText, useDisclose, HStack } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { ListRenderItemInfo, Platform, RefreshControl, useWindowDimensions } from 'react-native';

import { ActionSheetNews } from '../../../Components/ActionSheetNews';
import LoadingFooter from '../../../Components/LoadingFooter';
import NewsItem from '../../../Components/NewsItem';
import NewsSkeleton from '../../../Components/NewsSkeleton';
import { NoData } from '../../../Components/NoData';
import { SearchBar } from '../../../Components/SearchBar';
import TopMainBar from '../../../Components/TopMainBar';
import { ScreenNames } from '../../../Helpers/ScreenNames';
import { PageInfo } from '../../../interfaces/IIncident';
import { INews } from '../../../interfaces/rrhh/INews';
import { GetAllNews } from '../../../Services/rrhh/News';

interface IProps extends DrawerScreenProps<any, any> {
  toggleDrawer: () => void;
}

export default function HomeAnnouncementScreen({ navigation, route }: IProps) {
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
  const [startDate, setStartDate] = useState(moment().startOf('month'));
  const [endDate, setEndDate] = useState(moment());
  const [search, setSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(String(route?.params?.categoryId) ?? '-1');
  const [categoryName, setCategoryName] = useState<string>(route?.params?.categoryName ?? '');
  const [categoryId, setCategoryId] = useState<number>(route?.params?.categoryId ?? -1);
  const [news, setNews] = useState<INews[]>([]);

  // const numberOfFullRows = Math.floor(news.length / 3);

  // const searchText = useRef<string | undefined>(undefined);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);

  const fetchNews = async () => {
    try {
      const res = await GetAllNews({
        Page: page,
        Category: selectedCategory,
        Limit: 10,
        StartDate: startDate.format('YYYY-MM-DD'),
        EndDate: endDate.format('YYYY-MM-DD'),
        SearchParam: searchText,
      });

      if (page > 1) {
        setNews([...news, ...res.rows]);
      } else {
        setNews([...res.rows]);
      }
      setPagedInfo(res.pageInfo);
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
      const res = await GetAllNews({
        Page: 1,
        Category: selectedCategory,
        Limit: 10,
        StartDate: startDate.format('YYYY-MM-DD'),
        EndDate: endDate.format('YYYY-MM-DD'),
        SearchParam: searchText,
      });
      if (page > 1) {
        setNews([...news, ...res.rows]);
      } else {
        setNews([...res.rows]);
      }
      setPagedInfo(res.pageInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setStartDate(moment(startNormalDate));
    setEndDate(moment(endNormalDate));
  }, [startNormalDate, endNormalDate]);

  useEffect(() => {
    setIsLoading(true);
    fetchNews();
  }, [search, page, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      console.log('🚀 ~ file: HomeNewsScreen.tsx:119 ~ useEffect ~ route', route);
      if (route && route?.params && route?.params?.categoryId) {
        setSelectedCategory(route?.params?.categoryId);
        setCategoryId(route?.params?.categoryId);
      }
      if (route && route?.params && route?.params?.categoryName) {
        setCategoryName(route?.params?.categoryName);
      }
    }, [route])
  );

  const onItemPress = (index: number): void => {
    navigation &&
      navigation.navigate(ScreenNames.NEWS_DETAIL, {
        news: null,
        newsId: index,
      });
  };

  const renderLeftActions = () => (
    <Box flexDirection="row" alignItems="center">
      <TopNavigationAction onPress={() => navigation.toggleDrawer()} />
      <NbButton
        onPress={() => {
          onOpen();
        }}
        disabled={isLoading}
        variant="ghost"
        _pressed={{ bg: 'coolGray.100' }}
        endIcon={<MaterialIcons name="arrow-drop-down" size={24} color="black" />}
      >
        <NBText color="coolGray.700" fontWeight="bold">
          Filtros
        </NBText>
        <NBText color="coolGray.700" fontWeight="bold">
          Noticias
        </NBText>
      </NbButton>
    </Box>
  );

  interface IRenderProps {
    item: INews;
  }

  // const renderItem2 = ({ item }: IRenderProps) => {
  //   // const ticketStatus = getRequestStatus(item.fluEstado);
  //   return (
  //     <Pressable
  //       p={3}
  //       mx={3}
  //       my={1}
  //       borderRadius={3}
  //       backgroundColor='#fff'
  //       onPress={() => {
  //         navigation.navigate(ScreenNames.ADS_DETAIL, { news: null, newsId: item.id });
  //       }}
  //       shadow={4}
  //     >
  //       <HStack justifyContent='space-around'>
  //         <Image
  //           source={{ uri: `${baseURL}/images/${item?.img?.name}` }}
  //           fallbackSource={require('../../../../assets/logo_app.png')}
  //           alt='Logo Diunsa'
  //           size='sm'
  //           borderRadius={2}
  //         />
  //         <VStack w='70%'>
  //           <Text
  //             fontSize='xs'
  //             _dark={{
  //               color: 'warmGray.50',
  //             }}
  //             color='coolGray.800'
  //             alignSelf='flex-end'
  //           >
  //             {moment(item.createdAt).format('D MMM YY')}
  //           </Text>
  //           <Text
  //             _dark={{
  //               color: 'warmGray.50',
  //             }}
  //             color='coolGray.800'
  //             bold
  //           >
  //             {item.title}
  //           </Text>
  //         </VStack>
  //         {/* <Spacer /> */}
  //         {/* <VStack w='30%' px='2'>
  //           <Text
  //             fontSize='xs'
  //             _dark={{
  //               color: 'warmGray.50',
  //             }}
  //             color='coolGray.800'
  //             alignSelf='flex-end'
  //           >
  //             {moment(item.createdAt).format('D MMM YY')}
  //           </Text>
  //         </VStack> */}
  //       </HStack>
  //     </Pressable>
  //   );
  // };

  const renderItem = (info: ListRenderItemInfo<INews>): React.ReactElement => (
    <NewsItem news={info.item} category={categoryId} />
  );

  return (
    <Box safeArea flex={1} backgroundColor="#fff">
      {/* <TopNavigation
        alignment='center'
        // title='Anuncios'
        // subtitle='Subtitle'
        accessoryLeft={renderLeftActions}
        // accessoryRight={renderRightActions}
      /> */}
      <TopMainBar showBack showMenu={false} />
      {Platform.OS === 'web' && (
        <Box ml={5} w={'full'}>
          <HStack>
            <NBText color={'#0077CD'} fontSize={24}>
              Noticias
            </NBText>
            {categoryName?.length > 0 && (
              <>
                <NBText fontSize={24}> | </NBText>
                <NBText color={'#0077CD'} fontSize={24}>
                  {categoryName}
                </NBText>
              </>
            )}
          </HStack>
        </Box>
      )}

      {isLoading && page === 1 ? (
        // <Loading message='Cargando Noticias...' />
        // <NewsSkeleton />
        <FlatList
          data={[1, 2, 3, 4, 5]}
          _contentContainerStyle={{
            marginX: Platform.OS === 'web' ? '48' : '0',
          }}
          keyExtractor={(item) => {
            return `skeleton-news-${item}`;
          }}
          renderItem={NewsSkeleton}
        />
      ) : (
        <>
          <Box px="10" mb="5">
            <SearchBar
              handleChange={(text) => {
                // searchText.current = text;
                setSearchText(text);
                console.log(searchText);
              }}
              handleSearch={() => {
                setSearch((prev) => !prev);
                setCategoryName('');
                setCategoryId(-1);
              }}
              value={searchText}
            />
            {Platform.OS !== 'web' && categoryName?.length > 0 && (
              <Box justifyContent="center" alignItems="center" py={3}>
                <NBText color="#000" fontSize="sm">
                  Categoria seleccionada: {categoryName}
                </NBText>
              </Box>
            )}
            {/* <HStack mt={2}>
              <Icon mr='2' size="4" color="red.300" as={<AntDesign name="delete" />} />
              <NBText>
                Borrar busqueda
              </NBText>
            </HStack> */}
            {/* <NbButton
              onPress={() => {
                onOpen();
              }}
              disabled={isLoading}
              variant="ghost"
              _pressed={{ bg: 'coolGray.100' }}
              ml="2"
            >
              <Icon size="6" color="gray.400" as={<Feather name="filter" />} />
            </NbButton> */}
          </Box>
          <FlatList
            _contentContainerStyle={{
              marginX: Platform.OS === 'web' ? '5%' : '0',
            }}
            numColumns={Platform.OS === 'web' ? 3 : 1}
            data={news}
            extraData={news}
            onEndReached={() => {
              if (pagedInfo.currentPage < pagedInfo.totalPages) {
                setPage(page + 1);
              }
            }}
            ListFooterComponent={<LoadingFooter isLoading={isLoading} />}
            keyExtractor={(item) => `anuncio-${item.id}`}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={
              <NoData
                message={
                  searchText?.trim().length > 0
                    ? 'No encontramos noticias para tu búsqueda'
                    : 'No hay noticias por el momento'
                }
              />
            }
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={renderItem}
          />
        </>
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
  );
}
