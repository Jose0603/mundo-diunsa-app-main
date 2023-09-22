import API from '../../Axios';
import { IResponseModel } from '../../interfaces/IResponseModel';
import { IJobOffer } from '../../interfaces/rrhh/IJobOffer';

export const GetAllJobOffers = async () => {
  const { data } = await API.get<IResponseModel>(`/Contest/GetAllUserCanApply`);

  return data;
};

export const ApplyToJobOffer = async (cosCodigo: number) => {
  const { data } = await API.get<IResponseModel>(`/Contest/ApplyToJobOffer?cosCodigo=${cosCodigo}`);

  return data;
};
