import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import moment from 'moment';
import {
  Box,
  Center,
  HStack,
  Image,
  Button as NbButton,
  Text as NBText,
  Pressable,
  ScrollView,
  VStack,
} from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import RenderHtml, { useInternalRenderer } from 'react-native-render-html';
import WebView from 'react-native-webview';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import CustomCalendarIcon from '../../../../Components/CustomCalendarIcon';
import ImageCarrousel from '../../../../Components/ImageCarrousel';
import { KeyboardAvoidingView } from '../../../../Components/KeyboardAvoidingView';
import NewsReadingTimer from '../../../../Components/NewsReadingTimer';
import { LikeType } from '../../../../Enums/LikeType';
import { FancyCount } from '../../../../Helpers/FancyCount';
import { QueryKeys } from '../../../../Helpers/QueryKeys';
import { useCustomToast } from '../../../../hooks/useCustomToast';
import { useNewsComments } from '../../../../hooks/useNews';
import { INews } from '../../../../interfaces/rrhh/INews';
import { setProfile } from '../../../../Redux/reducers/auth/profileSlice';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import { SaveComment, ToggleNewsLike } from '../../../../Services/rrhh/News';
import { getMyPoints } from '../../../../Services/User';
import { CommentBox } from '../CommentsComponents/CommentBox';
import CommentsList from '../CommentsComponents/CommentsList';
import { getIconBtn, getText, getTextColor } from './extra/getReactions';
import LikeButton from './extra/LikeButton';

const keyboardOffset = (height: number): number =>
  Platform.select({
    android: 0,
    ios: height,
  });

interface IProps {
  news: INews;
}

export function CustomImageRenderer(props) {
  const { Renderer, rendererProps } = useInternalRenderer('img', props);
  const uri = rendererProps.source.uri;
  const thumbnailSource = {
    ...rendererProps.source,
    // You could change the uri here, for example to provide a thumbnail.
    // uri: uri.replace('1200', '300').replace('800', '200')
  };
  return (
    <Renderer
      {...rendererProps}
      source={thumbnailSource}
      onPress={() => {
        const aElement = document.createElement('a');
        // aElement.setAttribute("download", fileName);
        // const href = URL.createObjectURL(pdf);
        aElement.href = uri;
        aElement.setAttribute('target', '_blank');
        aElement.click();
      }}
    />
  );
}

function NewsContent({ news }: IProps): React.ReactElement {
  const user = useSelector((state: RootState) => state.auth.login);
  const styles = useStyleSheet(themedStyles);
  const { width } = useWindowDimensions();
  // const [newsComments, setNewsComments] = useState<CommentsData>({
  //   qty: 0,
  //   comments: [],
  // } as CommentsData);
  // const [isLoading, setIsLoading] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const showToast = useCustomToast();
  // const toast = useToast();
  const [parentId, setParentId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const qClient = useQueryClient();
  const { newsComments, isLoading } = useNewsComments(news?.id);

  const renderers = {
    iframe: IframeRenderer,
    img: CustomImageRenderer,
  };

  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
    iframe: {
      scalesPageToFit: true,
    },
  };

  // const fetchNewsComments = async (newsId: number) => {
  //   try {
  //     setIsLoading(true);
  //     const res = await GetNewsComments(newsId);
  //     setNewsComments(res);
  //   } catch (error) {
  //     console.error("error al consultar", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchMyPoints = async () => {
    try {
      const res = await getMyPoints();
      if (res.result) {
        dispatch(setProfile(res.data.points));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendComment = useCallback(
    async (inputComment: string, afterSendComment: (closeCommentBox: () => void) => void) => {
      var extractedEmojis = inputComment.replace(
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
        ''
      );

      const emojiCount = FancyCount(inputComment) - FancyCount(extractedEmojis);

      if (inputComment.length < 6) {
        showToast({
          title: 'El comentario debe tener al menos 6 caracteres',
          status: 'error',
        });
        return;
      }

      if (emojiCount > 5) {
        showToast({
          title: 'Solo se permiten 5 emojis',
          status: 'error',
        });
        return;
      }

      //* revisar si el comentario es padre o hijo
      //* si no es hijo, entonces solo se agrega al arreglo principal
      //* si es hijo, entonces se busca el indice del padre y se agrega al arreglo de childComments

      setSendingComment(true);
      try {
        const res = await SaveComment({
          description: inputComment,
          newsId: news.id,
          parentId: parentId,
        });
        if (res.result) {
          showToast({
            title: 'Comentario enviado',
            status: 'success',
            description: res?.message ?? '',
          });
          qClient.invalidateQueries([QueryKeys.NEWS_COMMENTS, news.id]);
          //   if (parentId) {
          //   const foundIndex = newsComments?.comments.findIndex(
          //     (x) => x.id === parentId
          //   );
          //   if (foundIndex !== -1) {
          //     const foundParent = newsComments?.comments[foundIndex];
          //     if (foundParent) {
          //       const previouschildComments = foundParent?.childComments ?? [];
          //       // if (previouschildComments.length > 0) {
          //       foundParent.childComments = [
          //         ...previouschildComments,
          //         {
          //           id: res?.data?.id,
          //           childComments: res?.data?.childComments,
          //           description: inputComment,
          //           createdAt: res?.data?.createdAt,
          //           likes: res?.data?.likes,
          //           user: res?.data?.user,
          //           newsId: news.id,
          //           parentId: parentId,
          //         },
          //       ];
          //       newsComments.comments[foundIndex] = foundParent;
          //       qClient.invalidateQueries([QueryKeys.NEWS_COMMENTS, news.id]);
          //       // setNewsComments((prev) => ({
          //       //   qty: prev.qty++,
          //       //   comments: newsComments.comments,
          //       // }));
          //       // }
          //     }
          //   }
          // } else {
          //   qClient.invalidateQueries([QueryKeys.NEWS_COMMENTS, news.id]);
          //   // setNewsComments((prev) => ({
          //   //   qty: prev.qty++,
          //   //   comments: [
          //   //     {
          //   //       id: res?.data?.id,
          //   //       childComments: res?.data?.childComments,
          //   //       description: inputComment,
          //   //       createdAt: res?.data?.createdAt,
          //   //       likes: res?.data?.likes,
          //   //       user: res?.data?.user,
          //   //       newsId: news.id,
          //   //       parentId: parentId,
          //   //     },
          //   //     ...prev.comments,
          //   //   ],
          //   // }));
          // }
          afterSendComment(() => {
            setShowComment(false);
          });
        } else {
          showToast({
            title: 'Hubo un error',
            status: 'error',
            description: res.message ?? 'Error al enviar el comentario',
          });
        }
      } catch (error) {
        showToast({
          title: 'Hubo un error',
          status: 'error',
          description: 'Error al enviar el comentario',
        });
        console.error(error);
      } finally {
        setSendingComment(false);
        setParentId(null);
      }
    },
    [parentId]
  );

  const CommentBtn = () => {
    const onPress = () => {
      console.log('🚀 ~ file: index.tsx:255 ~ CommentBtn ~ setShowComment');
      setParentId(null);
      setShowComment(true);
    };
    return (
      <Pressable onPress={onPress} alignItems="center">
        <NbButton w={'120%'} variant={'outline'} onPress={onPress}>
          Comentar
        </NbButton>
      </Pressable>
    );
  };

  const renderCommentsCount = useCallback(() => {
    return (
      <HStack>
        {newsComments?.qty > 0 && (
          <NBText fontSize={12}>
            {newsComments?.qty} {newsComments?.qty > 1 ? 'comentarios' : 'comentario'}
          </NBText>
        )}
      </HStack>
    );
  }, [newsComments?.qty]);

  return (
    <Box flex={1} bg="#ffffff">
      <ScrollView flex={1} mb={5}>
        <Layout style={[styles.header, styles.newWeb]} level="1">
          {Platform.OS === 'web' && (
            <VStack>
              <HStack>
                <NBText color={'#0077CD'} fontSize={24}>
                  Noticia
                </NBText>
                {news.categoryName?.length > 0 && (
                  <>
                    <NBText fontSize={24}> | </NBText>
                    <NBText color={'#0077CD'} fontSize={24}>
                      {news.categoryName}
                    </NBText>
                  </>
                )}
              </HStack>
              <NBText style={{ zIndex: 1 }} fontSize="14" color="#000" bold>
                {news.title}
              </NBText>
            </VStack>
          )}
          {news && news?.img && news?.img?.length > 0 && (
            // <Center>
            <ImageCarrousel data={news.img} />
            // </Center>
          )}
          <HStack px={4} pt={3}>
            <VStack maxWidth="80%" width="80%">
              <NBText color="coolGray.700" fontSize="12" pb={2}>
                Redacción: {news.createdBy}
              </NBText>
              {Platform.OS !== 'web' && (
                <NBText style={{ zIndex: 1 }} fontSize="14" color="#000" bold>
                  {news.title}
                </NBText>
              )}
              <HStack></HStack>
            </VStack>
            {Platform.OS !== 'web' && (
              <Box maxWidth="20%" width="20%" justifyContent="center" alignItems="center">
                <CustomCalendarIcon date={news.createdAt} />
              </Box>
            )}
          </HStack>

          <Box
            backgroundColor="#fff"
            // style={Platform.OS === "web" ? styles.newWeb : styles.newMobile}
          >
            <RenderHtml
              renderers={renderers}
              contentWidth={Platform.OS === 'web' ? (width * 75) / 100 : width}
              WebView={WebView}
              // tagsStyles={tagsStyles}
              source={{
                html: news.description,
              }}
              tagsStyles={{
                img: {
                  width: '60%',
                  height: 'auto',
                },
              }}
              customHTMLElementModels={customHTMLElementModels}
              renderersProps={renderersProps}
            />
          </Box>
          <VStack>
            <Box px={2} py={2} flexDir="row" alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" mx={2}>
                <FontAwesome5 name="clock" size={16} color="#AEAEAE" />
                <NBText fontSize={10}> {moment(news?.createdAt).format('DD MMM YYYY')}</NBText>
              </HStack>
              <HStack>
                {renderCommentsCount()}
                {newsComments?.qty > 0 && news?.likes?.qty > 0 && <Text> •</Text>}
                {news?.likes?.qty > 0 && (
                  <HStack alignItems="center" ml={2}>
                    <Image w={3} h={3} source={getIconBtn(1)} alt="Reaccion" />
                    <Image w={3} h={3} source={getIconBtn(2)} alt="Reaccion" />
                    <Image w={3} h={3} source={getIconBtn(4)} alt="Reaccion" />
                    <NBText fontSize={12}>
                      {news?.likes?.qty} {news?.likes?.qty > 1 ? 'personas' : 'persona'}
                    </NBText>
                  </HStack>
                )}
              </HStack>
            </Box>
            <HStack
              borderColor={Platform.OS === 'web' ? '#D9D9D9' : null}
              borderBottomWidth={Platform.OS === 'web' ? 1 : 0}
              borderTopWidth={Platform.OS === 'web' ? 1 : 0}
              alignItems="center"
              justifyContent="space-around"
              mx={8}
              my={4}
              py={4}
            >
              {Platform.OS === 'web' ? (
                <>
                  {/* {renderLikeBtn(news.id)} */}
                  <LikeButton news={news} />
                  <CommentBtn />
                </>
              ) : (
                <>
                  <CommentBtn />
                  <LikeButton news={news} />
                  {/* {renderLikeBtn(news.id)} */}
                </>
              )}
            </HStack>
            {Platform.OS === 'web' && <NBText fontSize={20}>Comentarios</NBText>}
          </VStack>
        </Layout>

        {news?.id && <CommentsList newsId={news.id} setShowComment={setShowComment} setParentId={setParentId} />}
      </ScrollView>

      <Box paddingX="10%">
        <Center>
          <CommentBox
            showComment={showComment}
            setShowComment={setShowComment}
            sendComment={sendComment}
            sendingComment={sendingComment}
          />
        </Center>
        <Center>
          <NewsReadingTimer
            seconds={news.estimatedReadingTime * 60}
            newsId={news.id}
            shouldAddPoints={news.shouldAddPoints ?? false}
          />
        </Center>
      </Box>
    </Box>
  );
}

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  header: {
    marginBottom: 8,
  },
  image: {
    height: 240,
  },
  titleLabel: {
    marginHorizontal: 15,
    marginVertical: 16,
    textAlign: 'center',
  },
  descriptionLabel: {
    margin: 24,
  },
  contentLabel: {
    margin: 24,
  },
  authoringContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  dateLabel: {
    marginHorizontal: 8,
  },
  commentInputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'text-basic-color',
  },
  commentInput: {
    marginHorizontal: 24,
    // marginTop: 24,
    marginBottom: 20,
  },
  commentReactionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginHorizontal: -8,
    marginVertical: -8,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reactionButton: {
    paddingHorizontal: 0,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollview: {
    flex: 1,
  },
  exampleContainer: {
    paddingVertical: 30,
  },
  exampleContainerLight: {
    backgroundColor: 'white',
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  slider: {
    marginTop: 15,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  flatList: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 18,
    //  marginBottom: getBottomSpace() + 60,
    //  minHeight: dimensions.height - (getBottomSpace() + 160),
  },
  flatListWrapper: {
    flex: 1,
    flexGrow: 1,
  },
  arrow: {
    //  size: 24,
    //  thickness: 2,
    //  color: 'grey',
  },
  showMoreComments: {
    marginLeft: 12,
    color: 'grey',
  },
  showMoreCommentsTwo: {
    marginLeft: 12,
    marginTop: 8,
    color: 'grey',
  },
  sendButton: {
    marginRight: 4,
    width: 24,
    height: 24,
  },
  newMobile: {
    width: '100%',
    paddingHorizontal: 3,
  },
  newWeb: {
    width: '50%',
    marginLeft: '10%',
  },
});

export default React.memo(NewsContent);
