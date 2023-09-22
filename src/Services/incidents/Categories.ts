import API, { AxiosResponse } from '../../Axios';
import { Area, Category, IReminder } from '../../interfaces/IIncident';
import { IOption } from '../../interfaces/shared/IOption';

export const CategoriesService = async () => {
  const { data } = await API.get<Category[]>('/Category/getall');
  return data;
};

export const AreasService = async () => {
  const { data } = await API.get<Area[]>('/Area/getall');
  return data;
};

export const StoresService = async (isTechnician: boolean = false) => {
  const { data } = await API.get<IOption[]>(`/User/Technician/GetWorkplaces${isTechnician ? '?allTypes=true' : ''}`);
  return data;
};
