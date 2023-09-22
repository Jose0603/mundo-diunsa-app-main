import { IResponseModel } from '../../interfaces/IResponseModel';
import { IProduct } from '../../interfaces/rrhh/Gamification/IProduct';
import { ProductExhange } from '../../interfaces/rrhh/Gamification/IProductExchange';
import API from '../../Axios';

export const GetProducts = async () => {
  const { data } = await API.get<IProduct[]>('/Gamification/Products/Active');
  return data;
};

export const ProductExchange = async (products: ProductExhange[]) => {
  const { data } = await API.post<IResponseModel>('/Gamification/Products/Exchange', { products: products });
  return data;
};

export const GetBonusActivities = async () => {
  const { data } = await API.get<IResponseModel>('/Gamification/BonusActivities');
  return data;
};

export const GetExtrasBonusActivities = async () => {
  const { data } = await API.get<IResponseModel>('/Gamification/BonusActivities/Double');
  return data;
};

export const GetUserExchanges = async () => {
  const { data } = await API.get<IResponseModel>('/Gamification/Products/Exchange/byUser');
  return data;
};
