import API, { AxiosResponse } from '../../Axios';
import { SubCategory } from '../../interfaces/IIncident';

export const SubcategoriesService = async () => {
  const { data } = await API.get<SubCategory[]>('/SubCategory/getall');
  return data;
};
