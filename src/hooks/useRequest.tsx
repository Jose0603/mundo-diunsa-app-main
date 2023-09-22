import {useQuery} from "react-query";
import {IRequestData} from "../interfaces/rrhh/IRequestStatus";
import {
  GetSubordinates,
  GetVacancies,
  RequestData,
  RequestDataContest,
} from "../Services/rrhh/Request";

import {QueryKeys} from "../Helpers/QueryKeys";
import {ISubordinatePosition, IVacancy} from "../interfaces/rrhh/IRequisition";

export function useRequest(id: number, peticion: string) {
  const {data, isLoading, error, isFetching} = useQuery<IRequestData[], Error>(
    [QueryKeys.REQUEST_DATA, id, peticion],
    () => RequestData(id, peticion)
  );

  return {
    request: data ?? [],
    isLoadingRequest: isLoading,
    error,
    isFetchingRequest: isFetching,
  };
}
export function useRequestContest(id: number, peticion: string) {
  const {data, isLoading, error, isFetching} = useQuery<string, Error>(
    [QueryKeys.REQUEST_DATA_CONTEST, id, peticion],
    () => RequestDataContest(id, peticion)
  );

  console.log("🚀 ~ file: useRequest.tsx:23 ~ useRequestContest ~ data:", data);
  return {
    requestContest: data ?? [],
    isLoadingRequestContest: isLoading,
    error,
    isFetchingRequestContest: isFetching,
  };
}

export function useSubordinates() {
  const {data, isLoading, error, isFetching} = useQuery<
    ISubordinatePosition[],
    Error
  >([QueryKeys.SUBORDINATES], () => GetSubordinates());

  return {
    subordinates: data ?? [],
    isLoadingSubordinates: isLoading,
    error,
    isFetchingSubordinate: isFetching,
  };
}
export function useVacancies() {
  const {data, isLoading, error, isFetching} = useQuery<IVacancy[], Error>(
    [QueryKeys.VACANCIES],
    () => GetVacancies()
  );

  return {
    vacancies: data ?? [],
    isLoadingVacancies: isLoading,
    error,
    isFetchingVacancies: isFetching,
  };
}
