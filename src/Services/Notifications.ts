import {IGeneralParams} from "../interfaces/IParams";
import {IResponseModel} from "../interfaces/IResponseModel";
import API from "../Axios";
import {PagedData} from "../interfaces/IIncident";
import {INotification, IUpdateStatus} from "../interfaces/INotification";

export const GetNotifications = async (params: IGeneralParams) => {
  const {data} = await API.get<PagedData<INotification>>(
    `/Notifications/getbyuser?Page=${params.Page}&Limit=${params.Limit}&StartDate=${params.StartDate}&EndDate=${params.EndDate}`
  );
  return data;
};

export const GetLastNotifications = async () => {
  const {data} = await API.get<INotification[]>(`/Notifications/last`);
  return data;
};

export const UpdateStatus = async (values: IUpdateStatus) => {
  const {data} = await API.put<IResponseModel>(`/Notifications/update`, values);
  return data;
};

export const DeleteNotification = async (notificationId: number) => {
  const {data} = await API.delete<IResponseModel>(
    `/Notifications/delete/${notificationId}`
  );
  return data;
};

export const DeleteAllNotifications = async () => {
  const {data} = await API.delete<IResponseModel>(`/Notifications/deleteAll`);
  return data;
};
