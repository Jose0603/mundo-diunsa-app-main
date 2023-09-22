import API from '../../Axios';
import { LikeType } from '../../Enums/LikeType';
import { FormatUrlParams } from '../../Helpers/FormatUrlParmas';
import { PagedData } from '../../interfaces/IIncident';
import { IParams, IRequestParams } from '../../interfaces/IParams';
import { IResponseModel } from '../../interfaces/IResponseModel';
import { CommentsData, INews, INewsCategory, ISavingComment, LikeData } from '../../interfaces/rrhh/INews';

export const GetAllNews = async ({ Page, Limit, StartDate, EndDate, Category, SearchParam = '' }: IRequestParams) => {
  const { data } = await API.get<PagedData<INews>>(
    `/News/GetAll${FormatUrlParams({
      Limit,
      Page,
      StartDate,
      EndDate,
      Category,
      SearchParam,
    })}`
  );

  return data;
};

export const GetLastNews = async (params: IRequestParams) => {
  const { data } = await API.get<PagedData<INews>>(`/News/GetLast?Page=${params.Page}&Limit=${params.Limit}`);

  return data;
};

export const GetAllNewsCategories = async () => {
  const { data } = await API.get<INewsCategory[]>(`/News/Categories`);

  return data;
};

export const GetNewsDetail = async (newsId: number) => {
  const { data } = await API.get<INews>(`/News/getbyid/${newsId}`);
  return data;
};

export const GetNewsComments = async (newsId: number) => {
  const { data } = await API.get<CommentsData>(`/News/Comments/${newsId}`);
  return data;
};
export const GetNewsLikes = async (newsId: number) => {
  const { data } = await API.get<LikeData>(`/News/Likes/${newsId}`);
  return data;
};
export const GetCommentLikes = async (commentId: number) => {
  const { data } = await API.get<LikeData>(`/News/Comments/Likes/${commentId}`);
  return data;
};

export const ToggleNewsLike = async (newsId: number, likeType: LikeType) => {
  const { data } = await API.post<IResponseModel>(`/News/Likes/toggle/${newsId}/${likeType}`);
  return data;
};

export const ToggleCommentLike = async (commentId: number, likeType: LikeType) => {
  const { data } = await API.post<IResponseModel>(`/News/Comments/Likes/toggle/${commentId}/${likeType}`);
  return data;
};

export const SaveComment = async (model: ISavingComment) => {
  const { data } = await API.post<IResponseModel>(`/News/Comments/Save`, model);
  return data;
};

export const AddNewsViewPoints = async (newsId: number) => {
  const { data } = await API.get<IResponseModel>(`/News/AddViewPoints/${newsId}`);
  return data;
};

export const GetPendingRead = async ({ Limit, Page }: IParams) => {
  const { data } = await API.get<IResponseModel>(
    `/News/GetPendingRead${FormatUrlParams({
      Limit,
      Page,
    })}`
  );
  return data;
};
