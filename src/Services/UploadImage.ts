import API from '../Axios';
import { IResponseModel } from '../interfaces/IResponseModel';
import { IUploadingImage } from '../interfaces/IUploadingImage';

export const FileUpload = async (file: IUploadingImage) => {
  let formData = new FormData();
  formData.append('FormFile', file);
  const { data } = await API.post<IResponseModel>('/Uploads', formData, {
    headers: { 'content-type': 'multipart/form-data' },
  });
  return data;
};

export const TicketFileUpload = async (file: IUploadingImage, ticketId: number) => {
  let formData = new FormData();
  formData.append('FormFile', file);
  const { data } = await API.post<IResponseModel>(`/Uploads/ticket/${ticketId}`, formData, {
    headers: { 'content-type': 'multipart/form-data' },
  });
  return data;
};
