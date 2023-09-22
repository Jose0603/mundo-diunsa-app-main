import { useQuery } from 'react-query';

import { QueryKeys } from '../Helpers/QueryKeys';
import { IResponseModel } from '../interfaces/IResponseModel';
import { IJobOffer } from '../interfaces/rrhh/IJobOffer';
import { GetAllJobOffers } from '../Services/rrhh/JobOffer';

export function useJobOffers() {
  const { data, isLoading, error, isFetching } = useQuery<IResponseModel, Error>([QueryKeys.JOB_OFFERS], () =>
    GetAllJobOffers()
  );

  return {
    jobOffers: (data?.data as IJobOffer[]) ?? [],
    isLoadingJobOffers: isLoading,
    error,
  };
}
