import { IResponseModel } from "../../interfaces/IResponseModel";
import { IOption } from "../../interfaces/shared/IOption";
import API from "../../Axios";
import { IAfeAficiones } from "../../interfaces/rrhh/IExpExpediente";

export const GetAllUserHubbies = async (codigo: string) => {
  const { data } = await API.get<IAfeAficiones[]>(
    `/ExpExpediente/AfeAficionesExpediente/getuserhubbies?codigo=${codigo}`
  );

  return data;
};

export const SaveHubby = async (hubby: IAfeAficiones, codigo: string) => {
  const { data } = await API.post<IResponseModel>(
    `/ExpExpediente/AfeAficionesExpediente/save?codigo=${codigo}`,
    hubby
  );

  return data;
};

export const DeleteHubby = async (codigo: number) => {
  const { data } = await API.delete<IResponseModel>(
    `/ExpExpediente/AfeAficionesExpediente/delete?codigo=${codigo}`
  );

  return data;
};

export const GetHubbies = async () => {
  const { data } = await API.get<IOption[]>(
    `/ExpExpediente/AfeAficionesExpediente/getHubbies`
  );

  return data;
};
