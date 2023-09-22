import { LikeType } from '../../../../../Enums/LikeType';
import { images } from '../../LikesComponents/Themes/Images';

export const getIconBtn = (reaction: LikeType) => {
  switch (reaction) {
    case LikeType.LIKE:
      return images.like_gif;
    case LikeType.LOVE:
      return images.love_static;
    case LikeType.HAHA:
      return images.haha_static;
    case LikeType.WOW:
      return images.wow_static;
    case LikeType.SAD:
      return images.sad_static;
    case LikeType.ANGRY:
      return images.angry_static;
    default:
      return images.like_static;
  }
};

export const getText = (reaction: LikeType) => {
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

export const getTextColor = (reaction: LikeType) => {
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
