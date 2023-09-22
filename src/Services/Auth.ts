import { Platform } from 'react-native';
import API, { AxiosResponse } from '../Axios';
import { IResponseModel } from '../interfaces/IResponseModel';
import { IRegister, IResetPassword } from '../interfaces/IUser';

interface ILoginRequest {
  username: string;
  password: string;
}

export const LoginService = async (
  loginObj: ILoginRequest
): Promise<AxiosResponse> => {
  return API.post('/Auth/Authenticate', loginObj);
};

export const RequestResetPassword = async (employeeCode: number) => {
  const { data } = await API.get<IResponseModel>(
    `/Auth/RequestPasswordReset/${employeeCode}`
  );
  return data;
};

export const ResetPassword = async (resetData: IResetPassword) => {
  const { data } = await API.post<IResponseModel>(
    `/Auth/ResetPassword`,
    resetData
  );
  return data;
};

export const RegisterData = async (resetData: IRegister) => {
  const { data } = await API.post<IResponseModel>(
    `/Auth/ResetPassword`,
    resetData
  );
  return data;
};

export const SaveEntranceUserConnection = async () => {
  const { data } = await API.get<string>(
    `/Auth/SaveEntranceUserConnection?platform=${Platform.OS}`
  );
  return data;
};

export const SaveExitUserConnection = async (
  connectionId: string,
  os: string
) => {
  const { data } = await API.get<string>(
    `/Auth/SaveExitUserConnection?connectionId=${connectionId}&platform=${os}`
  );
  return data;
};

export const TokenLoginService = async (): Promise<AxiosResponse> => {
  return API.post('/Auth/Authenticate-token');
};
