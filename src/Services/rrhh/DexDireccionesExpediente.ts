import { IResponseModel } from "../../interfaces/IResponseModel";
import { IOption } from "../../interfaces/shared/IOption";
import API from "../../Axios";
import { IDexDirecciones } from "../../interfaces/rrhh/IExpExpediente";

export const GetAdressType = async () => {
  const { data } = await API.get<IOption[]>(
    `/ExpExpediente/DexDireccionesExpediente/getAdresses`
  );

  return data;
};

export const GetAllUserAdresses = async (codigo: string) => {
  const { data } = await API.get<IDexDirecciones[]>(
    `/ExpExpediente/DexDireccionesExpediente/getAllUserAdresses?codigo=${codigo}`
  );

  return data;
};

export const GetAdress = async (codigo: number) => {
  const { data } = await API.get<IDexDirecciones>(
    `/ExpExpediente/DexDireccionesExpediente/getAdress?codigo=${codigo}`
  );

  return data;
};

export const SaveAdress = async (adress: IDexDirecciones, codigo: string) => {
  const { data } = await API.post<IResponseModel>(
    `/ExpExpediente/DexDireccionesExpediente/save?codigo=${codigo}`,
    adress
  );

  return data;
};

export const UpdateAdress = async (values: IDexDirecciones) => {
  const { data } = await API.put<IResponseModel>(
    `/ExpExpediente/DexDireccionesExpediente/update`,
    values
  );
  return data;
};

export const DeleteAdress = async (codigo: number) => {
  const { data } = await API.delete<IResponseModel>(
    `/ExpExpediente/DexDireccionesExpediente/delete?codigo=${codigo}`
  );

  return data;
};
