import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { Layout, Text } from '@ui-kitten/components';
import moment from 'moment';
import { Box, HStack, Image, Text as NBText, Pressable, ScrollView, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import WebView from 'react-native-webview';
import { useQueryClient } from 'react-query';

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
import { SaveComment } from '../../../../Services/rrhh/News';
import { CommentBox } from '../CommentsComponents/CommentBox';
import CommentsList from '../CommentsComponents/CommentsList';
import { images } from '../LikesComponents/Themes/Images';
import { getIconBtn } from './extra/getReactions';
// import { getIconBtn } from './extra/getReactions';
import LikeButton from './extra/LikeButton';

const keyboardOffset = (height: number): number =>
  Platform.select({
    android: 0,
    ios: height,
  });

interface IProps {
  news: INews;
}

function NewsContent({ news }: IProps): React.ReactElement {
  const { width } = useWindowDimensions();
  const [sendingComment, setSendingComment] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const showToast = useCustomToast();
  const [parentId, setParentId] = useState<number | null>(null);
  const { newsComments, isLoading } = useNewsComments(news?.id);
  const qClient = useQueryClient();

  const renderers = {
    iframe: IframeRenderer,
  };

  const customHTMLElementModels = {
    iframe: iframeModel,
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
          if (parentId) {
            const foundIndex = newsComments?.comments.findIndex((x) => x.id === parentId);
            if (foundIndex !== -1) {
              const foundParent = newsComments?.comments[foundIndex];
              if (foundParent) {
                const previouschildComments = foundParent?.childComments ?? [];
                // if (previouschildComments.length > 0) {
                foundParent.childComments = [
                  ...previouschildComments,
                  {
                    id: res?.data?.id,
                    childComments: res?.data?.childComments,
                    description: inputComment,
                    createdAt: res?.data?.createdAt,
                    likes: res?.data?.likes,
                    user: res?.data?.user,
                    newsId: news.id,
                    parentId: parentId,
                  },
                ];
                newsComments.comments[foundIndex] = foundParent;
                // setNewsComments((prev) => ({
                //   qty: prev.qty++,
                //   comments: newsComments.comments,
                // }));
                // }
              }
            }
          } else {
            // setNewsComments((prev) => ({
            //   qty: prev.qty++,
            //   comments: [
            //     {
            //       id: res?.data?.id,
            //       childComments: res?.data?.childComments,
            //       description: inputComment,
            //       createdAt: res?.data?.createdAt,
            //       likes: res?.data?.likes,
            //       user: res?.data?.user,
            //       newsId: news.id,
            //       parentId: parentId,
            //     },
            //     ...prev.comments,
            //   ],
            // }));
          }
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
    return (
      <Pressable
        onPress={() => {
          setParentId(null);
          setShowComment(true);
        }}
        alignItems="center"
      >
        <HStack>
          <FontAwesome name="comment-o" size={16} color="#AEAEAE" />
          <NBText ml={2}>Comentar</NBText>
        </HStack>
      </Pressable>
    );
  };

  return (
    <Box flex={1} bg="#ffffff">
      <ScrollView flex={1} bg="#ffffff">
        <Layout style={{ marginBottom: 8, width: '100%', paddingHorizontal: 3 }} level="1">
          {Platform.OS === 'web' && (
            <VStack>
              <HStack>
                <NBText color={'#0077CD'} fontSize={24}>
                  Noticias
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
              contentWidth={width}
              WebView={WebView}
              // tagsStyles={tagsStyles}
              source={{
                html: news.description,
              }}
              customHTMLElementModels={customHTMLElementModels}
              renderersProps={{
                iframe: {
                  scalesPageToFit: true,
                },
              }}
            />
          </Box>
          <VStack>
            <Box px={2} py={2} flexDir="row" alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" mx={2}>
                <FontAwesome5 name="clock" size={16} color="#AEAEAE" />
                <NBText fontSize={10}> {moment(news?.createdAt).format('DD MMM YYYY')}</NBText>
              </HStack>
              <HStack>
                <HStack>
                  {newsComments?.qty > 0 && (
                    <NBText fontSize={12}>
                      {newsComments?.qty} {newsComments?.qty > 1 ? 'comentarios' : 'comentario'}
                    </NBText>
                  )}
                </HStack>
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
                  <CommentBtn />
                  <LikeButton news={news} />
                </>
              ) : (
                <>
                  <CommentBtn />
                  <LikeButton news={news} />
                </>
              )}
            </HStack>
            {Platform.OS === 'web' && <NBText fontSize={20}>Comentarios</NBText>}
          </VStack>
        </Layout>

        {news?.id && <CommentsList newsId={news.id} setShowComment={setShowComment} setParentId={setParentId} />}
      </ScrollView>
      <KeyboardAvoidingView offset={keyboardOffset}>
        <CommentBox
          showComment={showComment}
          setShowComment={setShowComment}
          sendComment={sendComment}
          sendingComment={sendingComment}
        />

        <NewsReadingTimer
          seconds={news.estimatedReadingTime * 60}
          newsId={news.id}
          shouldAddPoints={news.shouldAddPoints ?? true}
        />
      </KeyboardAvoidingView>
    </Box>
  );
}

export default React.memo(NewsContent);
