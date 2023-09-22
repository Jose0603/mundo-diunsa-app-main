import moment from 'moment';
import { Box, HStack, Image, Pressable, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { View as NBView } from 'native-base';
import { SheetManager } from 'react-native-actions-sheet';

import { LikeType } from '../../../../Enums/LikeType';
import { INewsComment } from '../../../../interfaces/rrhh/INews';
import { RootState } from '../../../../Redux/reducers/rootReducer';
import { GetCommentLikes } from '../../../../Services/rrhh/News';
import { images } from '../LikesComponents/Themes/Images';
import Reactions from './Reactions';
import {
  ActionRowLeftBorderInnerSVG,
  ActionRowLeftBorderOuterSVG,
  CommentContent,
  Container,
  Content,
  ContentLeftBorderInnerSVG,
  ContentLeftBorderOuterSVG,
  DateText,
  EditedText,
  HorizontalTierSVG,
  InteractionSection,
  Name,
  TopRowLeftBorderInnerSVG,
  TopRowLeftBorderOuterSVG,
  TopRowWrapper,
} from './styledComponents';

interface Props {
  comment: INewsComment;
  handleSelectReaction: (
    selectedReaction: LikeType,
    commentId: number,
    isParent: boolean,
    parentId: number,
    setIsOpen: (isOpen: boolean) => void
  ) => void;
  index: number;
  nested: number;
  hasChildren: boolean;
  totalChildren: number;
  isParent?: boolean;
  parentCommentLength: number;
  lastCommentParentId: number;
  lastCommentGrandId: number;
  isLast: boolean;
  isParentLast: boolean;
  setShowComment: (showComment: boolean) => void;
  setParentId: (parentId: number) => void;
}

const Comment = ({
  comment,
  handleSelectReaction,
  index,
  nested,
  hasChildren,
  totalChildren,
  isParent,
  parentCommentLength,
  lastCommentParentId,
  lastCommentGrandId,
  isLast,
  isParentLast,
  setShowComment,
  setParentId,
}: Props) => {
  const user = useSelector((state: RootState) => state.auth.login);

  const [isOpen, setIsOpen] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(0);
  const isLastParent = lastCommentParentId === comment.parentId && parentCommentLength - 1 === index;

  const isLastGrand = lastCommentGrandId === comment.id;

  const getText = (reaction: LikeType) => {
    switch (reaction) {
      case LikeType.LIKE:
        return 'Me gusta';
      case LikeType.LOVE:
        return 'Me encanta';
      case LikeType.HAHA:
        return 'Me divierte';
      case LikeType.WOW:
        return 'Me asombra';
      case LikeType.SAD:
        return 'Me entristece';
      case LikeType.ANGRY:
        return 'Me enoja';
      default:
        return 'Me gusta';
    }
  };

  const getTextColor = (reaction: LikeType) => {
    switch (reaction) {
      case LikeType.LIKE:
        return 'blue.700';
      case LikeType.LOVE:
        return 'red.600';
      case LikeType.HAHA:
        return 'yellow.500';
      case LikeType.WOW:
        return 'yellow.500';
      case LikeType.SAD:
        return 'yellow.500';
      case LikeType.ANGRY:
        return 'yellow.500';
      default:
        return 'coolGray.800';
    }
  };

  const fetchCommentLike = async () => {
    try {
      const res = await GetCommentLikes(comment.id);
      if (res && res.users && res.users.length > 0) {
        let foundIdx = res.users.findIndex((x) => x.id === user.employeeId);
        if (foundIdx !== -1) {
          setCurrentReaction(res.users[foundIdx].type);
          // setCurrentReaction(1);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    // fetchCommentLike();
    if (comment && comment?.likes?.qty > 0) {
      let foundIdx = comment.likes.users.findIndex((x) => x.id === user.employeeId);
      if (foundIdx !== -1) {
        setCurrentReaction(comment?.likes?.users[foundIdx].type);
        // setCurrentReaction(1);
      }
    }
    return () => {};
  }, [comment]);

  const Content = ({ hasChildren, nested, children }: any) => {
    return (
      <Box
        bg="#eee"
        borderBottomLeftRadius="10px"
        borderBottomRightRadius="10px"
        borderTopRightRadius="10px"
        pb="12px"
        padding="12px"
        marginLeft={`${
          nested === 0 && !hasChildren
            ? 0
            : hasChildren && nested === 0
            ? 28
            : hasChildren && nested === 1
            ? 66
            : !hasChildren && nested === 1
            ? 68
            : hasChildren && nested === 2
            ? 94
            : 0
        }px`}
      >
        {children}
      </Box>
    );
  };

  const TopRowWrapper = ({ hasChildren, nested, children }: any) => {
    return (
      <HStack
        flex={1}
        marginTop="10px"
        alignItems="center"
        marginLeft={`${
          nested === 0 && !hasChildren
            ? 0
            : hasChildren && nested === 0
            ? 0
            : hasChildren && nested === 1
            ? 38
            : !hasChildren && nested === 1
            ? 38
            : !hasChildren && nested === 2
            ? 66
            : 0
        }px`}
      >
        {children}
      </HStack>
    );
  };

  const InteractionSection = ({ hasChildren, nested, children }: any) => {
    return (
      <Box
        bg="transparent"
        borderBottomLeftRadius="10px"
        borderBottomRightRadius="10px"
        borderTopRightRadius="10px"
        paddingX="16px"
        paddingBottom="12px"
        paddingTop="5px"
        marginLeft={`${
          nested === 0 && !hasChildren
            ? 0
            : hasChildren && nested === 0
            ? 28
            : hasChildren && nested === 1
            ? 66
            : !hasChildren && nested === 1
            ? 68
            : !hasChildren && nested === 2
            ? 94
            : 0
        }px`}
      >
        {children}
      </Box>
    );
  };

  const onPress = () => {
    SheetManager.show('reactions', {
      payload: {
        title: 'Reaccionar al comentario',
        commentId: comment.id,
        handleSelectReaction: handleSelectReaction,
        isParent: isParent,
        parentId: comment.parentId,
        currentSelected: 0,
      },
    });
  };

  return (
    <NBView borderWidth={1} w={'4/4'} borderRadius={'md'} borderColor={'#c0c0c0'}>
      <Container commentId={comment.id} nested={nested}>
        <View style={styles.rowDirection}>
          <TopRowWrapper nested={nested} hasChildren={hasChildren}>
            <HStack style={styles.renderTitleButton} justifyContent={'space-between'}>
              {/* <Avatar source={comment?.author_profile?.profile_images?.[0]?.uri} /> */}
              <NBView p={5}>
                <Image
                  size="xs"
                  alt="MND"
                  source={{ uri: `${comment.user.img}` }}
                  fallbackSource={require('../../../../../assets/profile-user.png')}
                  mr={2}
                />
              </NBView>
              <NBView mr={'10%'}>
                <VStack alignItems="flex-start">
                  <HStack space={3} justifyContent={'space-between'}>
                    <Text fontSize="md">{comment?.user?.name ?? 'Usuario'}</Text>
                    <Text fontSize="sm">{moment(comment?.createdAt).fromNow()}</Text>
                  </HStack>
                  <CommentContent
                    accessibilityHint={`comment content ${comment.description}`}
                    accessibilityLabel={`comment #${index + 1}`}
                    selectable
                    // staff={comment?.author_profile?.is_staff}
                    staff={true}
                  >
                    {comment?.description ?? ''}
                  </CommentContent>
                </VStack>
              </NBView>
            </HStack>
          </TopRowWrapper>
        </View>
        <View style={[styles.contentWrapper]}>
          <InteractionSection hasChildren={hasChildren} nested={nested}>
            <HStack>
              <Pressable mr={4} onPress={onPress} onLongPress={onPress}>
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <Box
                      px={0.5}
                      rounded="8"
                      style={{
                        transform: [
                          {
                            scale: isPressed ? 0.96 : 1,
                          },
                        ],
                      }}
                    >
                      <Text bold color={getTextColor(currentReaction)}>
                        {getText(currentReaction)}
                      </Text>
                    </Box>
                  );
                }}
              </Pressable>
              {/* <Reactions
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isParent={isParent}
                commentId={comment.id}
                parentId={comment.parentId}
                handleSelectReaction={handleSelectReaction}
              /> */}
              <Pressable
                mr={4}
                onPress={() => {
                  if (isParent) setParentId(comment?.id);
                  else setParentId(comment?.parentId);
                  setShowComment(true);
                }}
              >
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <Box
                      bg={isPressed ? 'coolGray.200' : isHovered ? 'coolGray.200' : 'transparent'}
                      px={0.5}
                      rounded="8"
                      style={{
                        transform: [
                          {
                            scale: isPressed ? 0.96 : 1,
                          },
                        ],
                      }}
                    >
                      <Text bold>Responder</Text>
                    </Box>
                  );
                }}
              </Pressable>
            </HStack>
          </InteractionSection>
        </View>

        <View style={styles.rowDirection}>
          {nested === 1 && hasChildren ? (
            <ActionRowLeftBorderInnerSVG hasChildren={hasChildren} nested={nested} />
          ) : null}

          {!isLast && !isLastParent && nested === 2 ? (
            <ActionRowLeftBorderInnerSVG hasChildren={hasChildren} nested={nested} />
          ) : null}

          {isParent && hasChildren && nested === 0 ? (
            <ActionRowLeftBorderOuterSVG hasChildren={hasChildren} nested={nested} />
          ) : null}

          {nested === 1 && !isLast && !isParent ? (
            <ActionRowLeftBorderOuterSVG hasChildren={hasChildren} nested={nested} />
          ) : null}

          {isParent && hasChildren && nested === 1 && !isLast ? (
            <ActionRowLeftBorderOuterSVG hasChildren={hasChildren} nested={nested} />
          ) : null}

          {nested === 2 && !isParentLast ? (
            <ActionRowLeftBorderOuterSVG hasChildren={hasChildren} nested={nested} />
          ) : null}
        </View>
      </Container>
    </NBView>
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    color: 'black',
  },
  contentWrapper: {
    flex: 1,
    marginTop: 0,
  },
  renderTitleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowDirection: {
    flexDirection: 'row',
  },
});

export default Comment;
