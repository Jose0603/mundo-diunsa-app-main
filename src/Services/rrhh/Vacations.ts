import { IRequestVacation } from '../../interfaces/rrhh/IRequestVacation';
import API from '../../Axios';
import { IEnjoyedVacation, IVacationPeriod } from '../../interfaces/rrhh/IVacation';
import { IResponseModel } from '../../interfaces/IResponseModel';

export const GetVacationPeriods = async (empCode: string) => {
  const { data } = await API.get<IVacationPeriod[]>(`/User/Vacations/Periods?empCode=${empCode}`);
  return data;
};

export const GetEnjoyedVacations = async (empCode: string) => {
  const { data } = await API.get<IEnjoyedVacation[]>(`/User/Vacations/Enjoyed?empCode=${empCode}`);
  return data;
};

export const SaveRequestVacations = async (request: IRequestVacation) => {
  const { data } = await API.post<IResponseModel>(`/Requests/SaveRequestVacations`, request);
  return data;
};

export const GetRemainingDays = async (empCode: string) => {
  const { data } = await API.get<number>(`/User/Vacations/RemainingDays?empCode=${empCode}`);
  return data;
};
