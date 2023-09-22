import { IResponseModel } from "../../interfaces/IResponseModel";
import { IOption } from "../../interfaces/shared/IOption";
import API from "../../Axios";
import {
  IAdditional,
  IExpExpediente,
} from "../../interfaces/rrhh/IExpExpediente";
import { QueryKeys } from "../../Helpers/QueryKeys";
import { queryClient } from "../../Configs/QueryClient";

export const ExpedienteService = async (codigo: string) => {
  const { data } = await API.get<IExpExpediente>(
    `/ExpExpediente/getById?codigo=${codigo}`
  );
  return data;
};
export const UpdateExpediente = async (values: IExpExpediente) => {
  const { data } = await API.put<IResponseModel>(
    `/ExpExpediente/update`,
    values
  );
  queryClient.refetchQueries([QueryKeys.PROFILES]);
  return data;
};

export const GetPaises = async () => {
  const { data } = await API.get<IOption[]>(`/ExpExpediente/GetPai`);

  return data;
};

export const GetDepartamentos = async (PaiCodigo: string) => {
  const { data } = await API.get<IOption[]>(
    `/ExpExpediente/GetDep?codigo=${PaiCodigo}`
  );

  return data;
};

export const GetMunicipios = async (DepCodigo: number) => {
  const { data } = await API.get<IOption[]>(
    `/ExpExpediente/GetMun?codigo=${DepCodigo}`
  );

  return data;
};

export const GetParentescos = async () => {
  const { data } = await API.get<IOption[]>(`/ExpExpediente/getParent`);

  return data;
};

export const UpdateAdditionalData = async (values: IAdditional) => {
  const { data } = await API.put<IResponseModel>(
    `/ExpExpediente/updateAdditional`,
    values
  );
  return data;
};

export const ExpedienteExtraData = async (codigo: string) => {
  const { data } = await API.get<IAdditional>(
    `/ExpExpediente/getExtraDataById?codigo=${codigo}`
  );
  return data;
};
