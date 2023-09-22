import { INewsComment } from '../interfaces/rrhh/INews';

export function keyExtractor(item: INewsComment) {
  if (typeof item === 'object' && item?.id != null) {
    return item.id;
  }
  if (typeof item === 'object' && item?.id != null) {
    return item.id;
  }
}

export function keyExtractorParent(item: INewsComment) {
  if (typeof item === 'object' && item?.id != null) {
    return item.id;
  }
  if (typeof item === 'object' && item?.parentId != null) {
    return item.parentId;
  }
}

export const getLastChildCommentId = (item: INewsComment) => {
  if (!item) {
    return;
  }
  const items = item['childComments'];
  return keyExtractor(items[items.length - 1]);
};

export const getLastChildCommentIdFromParent = (item: INewsComment) => {
  if (!item) {
    return;
  }
  const items = item['childComments'];
  return keyExtractorParent(items[items?.length - 1]);
};
