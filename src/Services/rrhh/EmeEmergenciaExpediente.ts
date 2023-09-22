import { IResponseModel } from "../../interfaces/IResponseModel";
import { IOption } from "../../interfaces/shared/IOption";
import API from "../../Axios";
import { IEmeEmergencia } from "../../interfaces/rrhh/IExpExpediente";
import { queryClient } from "../../Configs/QueryClient";
import { QueryKeys } from "../../Helpers/QueryKeys";

export const GetAllUserEmergencyContacts = async (codigo: string) => {
  const { data } = await API.get<IEmeEmergencia[]>(
    `/ExpExpediente/EmeEmergenciaExpediente/getallusercontacts?codigo=${codigo}`
  );

  return data;
};

export const GetEmergencyContact = async (codigo: number) => {
  const { data } = await API.get<IEmeEmergencia>(
    `/ExpExpediente/EmeEmergenciaExpediente/getById?codigo=${codigo}`
  );

  return data;
};

export const SaveEmergencyContact = async (
  EmergencyContact: IEmeEmergencia,
  codigo: string
) => {
  const { data } = await API.post<IResponseModel>(
    `/ExpExpediente/EmeEmergenciaExpediente/save?codigo=${codigo}`,
    EmergencyContact
  );

  return data;
};

export const UpdateEmergencyContact = async (values: IEmeEmergencia) => {
  const { data } = await API.put<IResponseModel>(
    `/ExpExpediente/EmeEmergenciaExpediente/update`,
    values
  );
  return data;
};

export const DeleteEmergencyContact = async (codigo: number) => {
  const { data } = await API.delete<IResponseModel>(
    `/ExpExpediente/EmeEmergenciaExpediente/delete?codigo=${codigo}`
  );

  return data;
};

export const MoveUp = async (emeCodigo: number, emergency: number) => {
  const { data } = await API.put<IResponseModel>(
    `/ExpExpediente/EmeEmergenciaExpediente/moveUp?emeCodigo=${emeCodigo}&emergency=${emergency}`
  );
  queryClient.refetchQueries([QueryKeys.EMERGENCY_CONTACTS]);
  return data;
};

export const MoveDown = async (emeCodigo: number, emergency: number) => {
  const { data } = await API.put<IResponseModel>(
    `/ExpExpediente/EmeEmergenciaExpediente/moveDown?emeCodigo=${emeCodigo}&emergency=${emergency}`
  );
  queryClient.refetchQueries([QueryKeys.EMERGENCY_CONTACTS]);
  return data;
};
