import { IResponseModel } from '../../interfaces/IResponseModel';
import { IOption } from '../../interfaces/shared/IOption';
import API from '../../Axios';
import { IFaeFamiliares } from '../../interfaces/rrhh/IExpExpediente';
import { IUploadingImage } from '../../interfaces/IUploadingImage';

export const GetAllUserFamilies = async (codigo: string) => {
  const { data } = await API.get<IFaeFamiliares[]>(
    `/ExpExpediente/FaeFamiliaresExpediente/getuserfamily?codigo=${codigo}`
  );

  return data;
};

export const GetFamiliar = async (codigo: number) => {
  const { data } = await API.get<IFaeFamiliares>(
    `/ExpExpediente/FaeFamiliaresExpediente/getById?codigo=${codigo}`
  );

  return data;
};

// export const GetAllUserFamilyImages = async (codigo: number) => {
//   const { data } = await API.get(
//     `/ExpExpediente/FaeFamiliaresExpediente/getuserfamilyImage?codigo=${codigo}`
//   );

//   return data;
// };

export const SaveFamily = async (family: IFaeFamiliares, codigo: string) => {
  const { data } = await API.post<IResponseModel>(
    `/ExpExpediente/FaeFamiliaresExpediente/save?codigo=${codigo}`,
    family
  );

  return data;
};

export const UpdateFamily = async (values: IFaeFamiliares) => {
  const { data } = await API.put<IResponseModel>(
    `/ExpExpediente/FaeFamiliaresExpediente/update`,
    values
  );
  return data;
};

export const DeleteFamily = async (codigo: number) => {
  const { data } = await API.delete<IResponseModel>(
    `/ExpExpediente/FaeFamiliaresExpediente/delete?codigo=${codigo}`
  );

  return data;
};

export const GetDocs = async () => {
  const { data } = await API.get<IOption[]>(
    `/ExpExpediente/FaeFamiliaresExpediente/getDocs`
  );

  return data;
};

export const GetCurrencies = async () => {
  const { data } = await API.get<IOption[]>(
    `/ExpExpediente/FaeFamiliaresExpediente/getCurrency`
  );

  return data;
};

export const FamilyDocsFileUpload = async (
  file: IUploadingImage,
  faeCodigo: number
) => {
  let formData = new FormData();
  formData.append('FormFile', file);
  const { data } = await API.post<IResponseModel>(
    `/Uploads/faeFamiliresExpediente/${faeCodigo}`,
    formData,
    {
      headers: { 'content-type': 'multipart/form-data' },
    }
  );
  return data;
};
