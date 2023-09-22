import {IResponseModel} from "../interfaces/IResponseModel";
import {ISavingToken} from "../interfaces/IUser";
import {NewsViews} from "../interfaces/rrhh/News/NewsViews";
import API from "../Axios";

export const SaveToken = async (savingToken: ISavingToken) => {
  const {data} = await API.post<IResponseModel>("/User/UserToken", savingToken);
  return data;
};

export const getMyPoints = async () => {
  const {data} = await API.get<IResponseModel>("/Gamification/MyPoints");
  return data;
};

export const SaveSignature = async (base64: string) => {
  const {data} = await API.post<IResponseModel>("/Uploads/signature", {
    base64: base64,
  });
  return data;
};

export const GetMyActivity = async () => {
  const {data} = await API.get<IResponseModel>(
    "/Gamification/UserActivityHistory"
  );
  return data;
};

export const GetMyNewsViews = async (userId: string) => {
  const {data} = await API.get<NewsViews | null>(
    `/Summary/GetNewsViews?UserId=${userId}`
  );
  return data;
};

export const GetExtraData = async () => {
  const {data} = await API.get<IResponseModel>(`/User/ExtraData`);
  return data;
};

export const GetPrivacyPolicy = async () => {
  const {data} = await API.get<IResponseModel>(`/User/PrivacyPolicy`);
  return data;
};
export const GetIsBoss = async () => {
  const {data} = await API.get<IResponseModel>(`/User/IsBoos`);
  return data;
};
