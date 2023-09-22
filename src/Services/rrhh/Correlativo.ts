import API from "../../Axios";
import {IResponseModel} from "../../interfaces/IResponseModel";

export const CorrelativoConfirm = async () => {
  const {data} = await API.get<IResponseModel>(`/Correlativo/confirmPrefijo`);
  return data;
};
