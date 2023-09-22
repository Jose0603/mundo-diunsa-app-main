import { useQuery } from 'react-query';

import { QueryKeys } from '../Helpers/QueryKeys';
import { IParams } from '../interfaces/IParams';
import { IResponseModel } from '../interfaces/IResponseModel';
import { CommentsData, INews } from '../interfaces/rrhh/INews';
import { GetNewsComments, GetNewsDetail, GetPendingRead } from '../Services/rrhh/News';

export function usePendingNews(options?: Partial<IParams>) {
  const { data, isLoading, error, isFetching } = useQuery<IResponseModel, Error>(
    [QueryKeys.PEDNING_READ_NEWS],
    ({ pageParam }) => GetPendingRead(Object.assign({}, options, pageParam))
  );

  return {
    pendingNews: data?.data ?? [],
    isLoadingPendingNews: isLoading,
    error,
    isFetching,
  };
}

export function useSingleNews(newsId: number) {
  const { data, isLoading, error, isFetching } = useQuery<INews, Error>([QueryKeys.SINGLE_NEWS, newsId], () =>
    GetNewsDetail(newsId)
  );

  return {
    news: data,
    isLoading,
    error,
    isFetching,
  };
}
export function useNewsComments(newsId: number) {
  const { data, isLoading, error, isFetching } = useQuery<CommentsData, Error>([QueryKeys.NEWS_COMMENTS, newsId], () =>
    GetNewsComments(newsId)
  );

  return {
    newsComments: data,
    isLoading,
    error,
    isFetching,
  };
}
