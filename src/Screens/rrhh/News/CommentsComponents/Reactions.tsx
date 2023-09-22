import { Box, Image, Pressable, Text, VStack } from 'native-base';
import React from 'react';
import { ImageSourcePropType } from 'react-native';
import ActionSheet, { ActionSheetRef, SheetProps } from 'react-native-actions-sheet';
import { LikeType } from '../../../../Enums/LikeType';
import { images } from '../LikesComponents/Themes/Images';

type Props = {
  commentId: number;
  isParent: boolean;
  parentId: number;
  handleSelectReaction: (selectedReaction: LikeType, commentId: number, isParent: boolean, parentId: number) => void;
  currentSelected?: LikeType;
  title?: string;
};

type ImgReactionProps = {
  gifUrl: ImageSourcePropType;
  staticUrl: ImageSourcePropType;
  onPress: (e: any) => void;
};

function Reactions({ sheetId, payload }: SheetProps<Props>) {
  const actionSheetRef = React.useRef<ActionSheetRef>(null);

  const ImgReaction = ({ gifUrl, staticUrl, onPress }: ImgReactionProps) => {
    return (
      <Pressable onPress={onPress}>
        <Image w={36} h={36} source={gifUrl} fallbackSource={gifUrl} alt="Reaccion" />
      </Pressable>
    );
  };

  const { title, commentId, handleSelectReaction, isParent, parentId, currentSelected } = payload;

  return (
    <ActionSheet
      id={sheetId}
      ref={actionSheetRef}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      }}
      indicatorStyle={{
        width: 100,
      }}
      snapPoints={[100]}
      initialSnapIndex={0}
      // statusBarTranslucent
      // drawUnderStatusBar={true}
      keyboardHandlerEnabled={false}
      gestureEnabled={true}
      defaultOverlayOpacity={0.3}
      backgroundInteractionEnabled={false}
    >
      <VStack p={2} alignItems="center" justifyContent="center">
        <Text mb={2} bold>
          {title}
        </Text>
        <Box w="80%" rounded="full" shadow={2} bg="#fff" py={2} px={2} flexDir="row" justifyContent="space-around">
          <ImgReaction
            gifUrl={images.like_gif}
            staticUrl={images.like_static_fill}
            onPress={() => {
              handleSelectReaction(LikeType.LIKE, commentId, isParent, parentId);
            }}
          />
          <ImgReaction
            gifUrl={images.love_gif}
            staticUrl={images.love_static}
            onPress={() => {
              handleSelectReaction(LikeType.LOVE, commentId, isParent, parentId);
            }}
          />
          <ImgReaction
            gifUrl={images.haha_gif}
            staticUrl={images.haha_static}
            onPress={() => {
              handleSelectReaction(LikeType.HAHA, commentId, isParent, parentId);
            }}
          />
          <ImgReaction
            gifUrl={images.wow_gif}
            staticUrl={images.wow_static}
            onPress={() => {
              handleSelectReaction(LikeType.WOW, commentId, isParent, parentId);
            }}
          />
          <ImgReaction
            gifUrl={images.sad_gif}
            staticUrl={images.sad_static}
            onPress={() => {
              handleSelectReaction(LikeType.SAD, commentId, isParent, parentId);
            }}
          />
          <ImgReaction
            gifUrl={images.angry_gif}
            staticUrl={images.angry_static}
            onPress={() => {
              handleSelectReaction(LikeType.ANGRY, commentId, isParent, parentId);
            }}
          />
        </Box>
      </VStack>
    </ActionSheet>
  );
}

export default React.memo(Reactions);
