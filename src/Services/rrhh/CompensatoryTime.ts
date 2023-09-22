import { ICompensatoryTime } from '../../interfaces/rrhh/ICompensatoryTime';
import API from '../../Axios';

export const GetCompensatoryTime = async (empCode: string) => {
  const { data } = await API.get<ICompensatoryTime[]>(`/User/CompensatoryTime?empCode=${empCode}`);
  return data;
};
