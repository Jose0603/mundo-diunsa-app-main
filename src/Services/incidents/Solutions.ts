import { IIncidentParams } from '../../interfaces/IParams';
import API from '../../Axios';
import { ISolution, PagedData } from '../../interfaces/IIncident';

export const GetSolutionsBySubcategory = async ({
  Page = 1,
  Status = -1,
  Limit = 12,
  SubCategory = -1,
}: IIncidentParams) => {
  const { data } = await API.get<PagedData<ISolution>>(
    `/Solution/bySubcategory?Page=${Page}&Limit=${Limit}&SubCategory=${SubCategory}`
  );
  return data;
};
