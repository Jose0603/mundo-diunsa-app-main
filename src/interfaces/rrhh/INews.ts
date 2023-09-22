import { LikeType } from '../../Enums/LikeType';

export interface INews {
  id: number;
  description: string;
  img: Img[];
  mainImg: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  category: number;
  categoryName: string;
  publishDate: string;
  expiration: string;
  labels: string;
  categories: Option[];
  likes: LikeData;
  applyMultiplier: boolean;
  comments: null;
  detail: UserDetail2;
  estimatedReadingTime: number;
  shouldAddPoints: boolean;
}

interface UserDetail2 {
  id: number;
  news: number;
  userId: string;
  userCompleteName: string;
}

export interface Option {
  value: number;
  label: string;
}

export interface LikeData {
  qty: number;
  users: UserLikeDetail[];
}

export interface UserDetail {
  id: string;
  name: string;
  img?: string;
}

export interface UserLikeDetail extends UserDetail {
  type: LikeType;
}

export interface Img {
  id: number;
  name: string;
  mimeType: string;
  uploadedBy: string;
}

export interface INewsComment {
  id: number;
  parentId: number;
  newsId: number;
  description: string;
  user: UserDetail;
  likes: LikeData;
  createdAt: string;
  childComments: INewsComment[];
}

export interface CommentsData {
  qty: number;
  comments: INewsComment[];
}

export interface ISavingComment {
  id?: number;
  newsId: number;
  parentId?: number;
  description: string;
}

export interface INewsCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  newsCategories: any[];
}
