import { Button, HStack, Image, Text as NBText, Pressable } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { LikeType } from '../../../../../Enums/LikeType';
import { QueryKeys } from '../../../../../Helpers/QueryKeys';
import { useCustomToast } from '../../../../../hooks/useCustomToast';
import { INews } from '../../../../../interfaces/rrhh/INews';
import { setProfile } from '../../../../../Redux/reducers/auth/profileSlice';
import { RootState } from '../../../../../Redux/reducers/rootReducer';
import { ToggleNewsLike } from '../../../../../Services/rrhh/News';
import { getMyPoints } from '../../../../../Services/User';
import { images } from '../../LikesComponents/Themes/Images';
import { getText, getTextColor } from './getReactions';

interface IProps {
  news: INews;
}
export default function LikeButton({ news }: IProps) {
  const user = useSelector((state: RootState) => state.auth.login);
  const [selectedReaction, setSelectedReaction] = useState<LikeType>(0);
  const [currentUserHasReacted, setCurrentUserHasReacted] = useState(false);
  const dispatch = useDispatch();
  const qClient = useQueryClient();
  const showToast = useCustomToast();

  useEffect(() => {
    const found =
      news &&
      news?.likes &&
      news?.likes?.users &&
      Array.isArray(news?.likes?.users) &&
      news?.likes?.users.find((c) => c.id === user.employeeId);
    if (found) {
      setCurrentUserHasReacted(true);
      setSelectedReaction(found.type);
    }
  }, [news.likes]);

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

  const handleNewsSelectReaction = async (selectedReaction: LikeType) => {
    try {
      setSelectedReaction(selectedReaction);
      SheetManager.hide('reactions');
      var res = await ToggleNewsLike(news.id, selectedReaction);
      if (res.result && res.message === 'Agregado correctamente') {
        showToast({
          title: 'Puntos por reacción agregados con éxito',
          status: 'success',
        });
      }
      qClient.invalidateQueries([QueryKeys.SINGLE_NEWS, news.id]);
      // setisOpen(false);
    } catch (error) {
      console.error('🚀 ~ file: index.tsx ~ line 295 ~ renderHeader ~ error', error);
    } finally {
      fetchMyPoints();
    }
  };
  const onPress = () => {
    SheetManager.show('reactions', {
      payload: {
        title: 'Reaccionar a la noticia',
        commentId: 0,
        handleSelectReaction: handleNewsSelectReaction,
        isParent: false,
        parentId: 0,
        currentSelected: 0,
      },
    });
  };

  const getIconBtn = (reaction: LikeType) => {
    switch (reaction) {
      case LikeType.LOVE:
        return <Image w={4} h={4} source={images.love_static} alt="Me encanta" />;
      case LikeType.LIKE:
        return <Image w={4} h={4} source={images.like_static} alt="Me gusta" />;
      case LikeType.HAHA:
        return <Image w={4} h={4} source={require('../../LikesComponents/LikesImages/haha2.png')} alt="Me divierte" />;
      case LikeType.WOW:
        return <Image w={4} h={4} source={require('../../LikesComponents/LikesImages/wow2.png')} alt="Me Asombra" />;
      case LikeType.SAD:
        return <Image w={4} h={4} source={require('../../LikesComponents/LikesImages/sad2.png')} alt="Me entristece" />;
      case LikeType.ANGRY:
        return <Image w={4} h={4} source={require('../../LikesComponents/LikesImages/angry2.png')} alt="Me enoja" />;
      // default:
      //   return <Image w={4} h={4} source={require('../../LikesComponents/LikesImages/like.gif')} alt="Me gusta" />;
    }
  };

  const icon = getIconBtn(selectedReaction);
  console.log('🚀 ~ file: LikeButton.tsx:106 ~ LikeButton ~ icon', icon);
  const textColor = getTextColor(selectedReaction);
  const text = getText(selectedReaction);

  return (
    <>
      {Platform.OS === 'web' ? (
        <Button variant={'outline'} onPress={onPress} flexDir="row" alignItems="center">
          <HStack>
            <NBText ml={2} color={textColor}>
              {text}
            </NBText>
          </HStack>
        </Button>
      ) : (
        <Pressable onPress={onPress} flexDir="row" alignItems="center">
          {/* <Image w={4} h={4} source={icon} alt="Reaccion" /> */}
          {getIconBtn(selectedReaction)}
          <NBText ml={2} color={textColor}>
            {text}
          </NBText>
        </Pressable>
      )}
      {/* <Reactions
         isOpen={isOpen}
         setIsOpen={setisOpen}
         isParent={false}
         commentId={0}
         parentId={0}
         handleSelectReaction={handleNewsSelectReaction}
         title="Reaccionar a la noticia"
       /> */}
    </>
  );
}
