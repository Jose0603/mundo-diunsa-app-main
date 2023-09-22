import React, { useCallback, useState } from 'react';
import { useNewsComments } from '../../../../hooks/useNews';
import { VStack, View as NBView, Box, FlatList, Text as NBText } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { INewsComment } from '../../../../interfaces/rrhh/INews';
import Comment from './Comment';
import { ListRenderItemInfo } from 'react-native';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import { useSelector } from 'react-redux';
import { LikeType } from '../../../../Enums/LikeType';
import { useQueryClient } from 'react-query';
import { QueryKeys } from '../../../../Helpers/QueryKeys';
import { ToggleCommentLike } from '../../../../Services/rrhh/News';
import { getLastChildCommentId, getLastChildCommentIdFromParent } from '../../../../Helpers/CommentUtils';
import { comments } from '../comments';
import CollapsibleView from './CollapsibleView';
import NewsDetailSkeleton from '../../../../Components/NewsDetailSkeleton';
import { SheetManager } from 'react-native-actions-sheet';

export default function CommentsList({
  newsId,
  setShowComment,
  setParentId,
}: {
  newsId: number;
  setShowComment: (a: boolean) => void;
  setParentId: (id: number | null) => void;
}) {
  const user = useSelector((state: RootState) => state.auth.login);
  const qClient = useQueryClient();
  const { newsComments, isLoading } = useNewsComments(newsId);

  const [sendingComment, setSendingComment] = useState(false);
  //   const [showComment, setShowComment] = useState(false);
  //   const [parentId, setParentId] = useState<number | null>(null);

  const keyExtractor = useCallback((item: INewsComment) => item?.id.toString(), []);

  const handleCommentSelectReaction = async (
    selectedReaction: LikeType,
    commentId: number,
    isParent: boolean,
    parentId: number,
    setIsOpen: (isOpen: boolean) => void
  ) => {
    try {
      SheetManager.hide('reactions');

      if (isParent) {
        const foundIndex = newsComments?.comments.findIndex((x) => x.id === commentId);
        if (foundIndex !== -1) {
          const foundComment = newsComments?.comments[foundIndex];
          if (foundComment) {
            const likesData = foundComment?.likes;
            if (likesData && likesData?.qty > 0) {
              var currentUserExistsIndex = likesData.users.findIndex((x) => x.id === user.employeeId);
              var [currentUserExistsInList] = likesData.users.splice(currentUserExistsIndex, 1);
              if (currentUserExistsInList && currentUserExistsInList.type !== selectedReaction) {
                currentUserExistsInList.type = selectedReaction;
                likesData.users.push(currentUserExistsInList);
                newsComments.comments[foundIndex].likes = likesData;
                qClient.invalidateQueries([QueryKeys.NEWS_COMMENTS, newsId]);
                // setNewsComments((prev) => ({
                //   ...prev,
                //   comments: newsComments.comments,
                // }));
              }
            } else {
              likesData.qty = 1;
              likesData.users = [
                {
                  id: user.employeeId,
                  name: user.name,
                  type: selectedReaction,
                },
              ];
              newsComments.comments[foundIndex].likes = likesData;
              qClient.invalidateQueries([QueryKeys.NEWS_COMMENTS, newsId]);
              // setNewsComments((prev) => ({
              //   ...prev,
              //   comments: newsComments.comments,
              // }));
            }
          }
        }
      } else {
        const foundIndex = newsComments?.comments.findIndex((x) => x.id === parentId);
        if (foundIndex !== -1) {
          const foundComment = newsComments?.comments[foundIndex];
          if (foundComment) {
            const foundChildIndex = foundComment.childComments.findIndex((c) => c.id === commentId);
            if (foundChildIndex !== -1) {
              const foundChild = foundComment.childComments[foundChildIndex];
              const likesData = foundChild?.likes;
              if (likesData && likesData?.qty > 0) {
                var currentUserExistsIndex = likesData.users.findIndex((x) => x.id === user.employeeId);
                var [currentUserExistsInList] = likesData.users.splice(currentUserExistsIndex, 1);
                if (currentUserExistsInList && currentUserExistsInList.type !== selectedReaction) {
                  currentUserExistsInList.type = selectedReaction;
                  likesData.users.push(currentUserExistsInList);
                  foundComment.childComments[foundIndex].likes = likesData;
                  newsComments.comments.splice(foundIndex, 1, foundComment);
                  qClient.invalidateQueries([QueryKeys.NEWS_COMMENTS, newsId]);
                  // setNewsComments((prev) => ({
                  //   ...prev,
                  //   comments: newsComments.comments,
                  // }));
                }
              } else {
                likesData.qty = 1;
                likesData.users = [
                  {
                    id: user.employeeId,
                    name: user.name,
                    type: selectedReaction,
                  },
                ];
                foundComment.childComments[foundIndex].likes = likesData;
                newsComments.comments.splice(foundIndex, 1, foundComment);
                qClient.invalidateQueries([QueryKeys.NEWS_COMMENTS, newsId]);
                // setNewsComments((prev) => ({
                //   ...prev,
                //   comments: newsComments.comments,
                // }));
              }
            }
          }
        }
      }
      // setIsOpen(false);
      var res = await ToggleCommentLike(commentId, selectedReaction);
      qClient.invalidateQueries([QueryKeys.NEWS_COMMENTS, newsId]);
    } catch (error) {
      console.log('🚀 ~ file: index.tsx ~ line 117 ~ NewsContent ~ error', error?.data ?? error);
    } finally {
      SheetManager.hide('reactions');
      // setIsOpen(false);
    }
  };

  const renderLoadingComments = (item: ListRenderItemInfo<number>) => {
    return <NewsDetailSkeleton key={item.index} />;
  };

  const renderItems = useCallback(
    ({ item, index }: ListRenderItemInfo<INewsComment>) => {
      return (
        <VStack
          w="100%"
          _web={{
            width: '50%',
            marginLeft: '10%',
          }}
        >
          {!item.parentId ? (
            <NBView mt={5}>
              <Comment
                comment={item}
                handleSelectReaction={handleCommentSelectReaction}
                hasChildren={item?.childComments?.length > 0}
                index={index}
                isParent
                lastCommentParentId={getLastChildCommentIdFromParent(item)}
                lastCommentGrandId={getLastChildCommentId(item)}
                nested={0}
                isParentLast={false}
                isLast={item.id === comments[comments?.length - 1].id}
                parentCommentLength={0}
                totalChildren={item?.childComments?.length || 0}
                setShowComment={setShowComment}
                setParentId={setParentId}
              />
            </NBView>
          ) : null}

          {item?.childComments?.length > 0 ? (
            <CollapsibleView
              //   arrowStyling={styles.arrow}
              initExpanded={true}
              nested={1}
              length={item?.childComments?.length} // length of parent comments
              titleStyle={{
                marginLeft: 12,
                color: 'grey',
              }}
              lastCommentIndex={item.childComments.findIndex(
                (comment: any) => comment.id === getLastChildCommentId(item)
              )}
              title={
                item?.childComments?.length === 1
                  ? `mostrar ${item?.childComments?.length} comentario`
                  : `mostrar ${item?.childComments?.length} comentarios`
              }
              collapsedTitle={item?.childComments?.length === 1 ? 'ocultar comentario' : 'ocultar comentarios'}
              parentCommentLength={item?.childComments?.length || 0}
              unmountOnCollapse
            >
              {item.childComments.map((levelOneComment, idx) => {
                return (
                  <React.Fragment key={levelOneComment.id}>
                    <NBView
                      mt={1}
                      _web={{
                        marginLeft: 3,
                      }}
                    >
                      <Comment
                        handleSelectReaction={handleCommentSelectReaction}
                        comment={levelOneComment}
                        hasChildren={levelOneComment?.childComments?.length > 0}
                        index={idx}
                        key={item.id}
                        lastCommentParentId={getLastChildCommentIdFromParent(item)}
                        lastCommentGrandId={getLastChildCommentId(item)}
                        nested={1}
                        isParentLast={levelOneComment.id === item.childComments[item.childComments.length - 1].id}
                        isParent={levelOneComment?.childComments?.length > 0}
                        parentCommentLength={item?.childComments?.length || 0}
                        totalChildren={levelOneComment?.childComments?.length || 0}
                        isLast={levelOneComment.id === item.childComments[item.childComments.length - 1].id}
                        setShowComment={setShowComment}
                        setParentId={setParentId}
                      />
                    </NBView>
                    {levelOneComment?.childComments?.length > 0 ? (
                      <CollapsibleView
                        // arrowStyling={styles.arrow}
                        initExpanded={false}
                        nested={2}
                        length={levelOneComment?.childComments?.length}
                        lastCommentIndex={levelOneComment.childComments.findIndex(
                          (comment: any) => comment.id === getLastChildCommentId(levelOneComment)
                        )}
                        title={
                          levelOneComment?.childComments?.length === 1
                            ? `show ${levelOneComment?.childComments?.length} reply`
                            : `show ${levelOneComment?.childComments?.length} replies`
                        }
                        collapsedTitle={levelOneComment?.childComments?.length === 1 ? 'hide reply' : 'hide replies'}
                        isParentLast={levelOneComment.id === item.childComments[item.childComments.length - 1].id}
                        parentCommentLength={levelOneComment.childComments.length}
                        titleStyle={{
                          marginLeft: 12,
                          marginTop: 8,
                          color: 'grey',
                        }}
                        unmountOnCollapse
                      >
                        {levelOneComment.childComments.map((levelTwoComment, idxTwo) => {
                          return (
                            <React.Fragment key={levelTwoComment.id}>
                              <NBView mt={1} ml={5}>
                                <Comment
                                  comment={levelTwoComment}
                                  handleSelectReaction={handleCommentSelectReaction}
                                  hasChildren={false}
                                  index={idxTwo}
                                  key={levelTwoComment.id}
                                  lastCommentParentId={getLastChildCommentIdFromParent(levelOneComment)}
                                  nested={2}
                                  lastCommentGrandId={getLastChildCommentId(levelOneComment)}
                                  parentCommentLength={levelOneComment.childComments.length}
                                  isLast={
                                    levelTwoComment.id ===
                                    levelOneComment.childComments[levelOneComment.childComments.length - 1].id
                                  }
                                  isParentLast={
                                    levelOneComment.id === item.childComments[item.childComments.length - 1].id
                                  }
                                  totalChildren={levelOneComment?.childComments?.length || 0}
                                  setShowComment={setShowComment}
                                  setParentId={setParentId}
                                />
                              </NBView>
                            </React.Fragment>
                          );
                        })}
                      </CollapsibleView>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </CollapsibleView>
          ) : null}
        </VStack>
      );
    },
    [newsComments, getLastChildCommentId, getLastChildCommentIdFromParent]
  );

  if (isLoading) {
    return (
      <Box flex={1} bg="#ffffff">
        <FlatList data={[1, 2, 3]} keyExtractor={(item) => item.toString()} renderItem={renderLoadingComments} />
      </Box>
    );
  }

  return (
    <FlatList
      initialNumToRender={70}
      maxToRenderPerBatch={70}
      ListEmptyComponent={() => {
        return (
          <Box justifyContent="center" alignItems="center">
            <FontAwesome name="comments-o" size={64} color="black" />
            <NBText bold fontSize={12}>
              Aún no hay comentarios
            </NBText>
            <NBText fontSize={10}>Sé el primero en comentar</NBText>
          </Box>
        );
      }}
      data={newsComments?.comments ?? []}
      keyExtractor={keyExtractor}
      flex={1}
      bgColor="#fff"
      pb={5}
      scrollEventThrottle={500}
      renderItem={renderItems}
      // contentInsetAdjustmentBehavior="automatic"
    />
  );
}
