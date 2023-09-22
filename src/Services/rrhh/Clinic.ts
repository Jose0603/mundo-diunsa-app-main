import API from '../../Axios';
import { IClinic, IClinicAppointment, IClinicAttentionType, IGroupedClinicAppointment, ISavingClinicAppointment } from '../../interfaces/rrhh/IClinic';
import { IOption } from '../../interfaces/shared/IOption';

export const GetAllClinics = async () => {
  const { data } = await API.get<IClinic[]>(`/Clinic/getall`);

  return data;
};
export const GetAttentionTypes = async (clinicId: number) => {
  const { data } = await API.get<IClinicAttentionType[]>(`/clinic/ClinicAttentionType/getallByClinic?clinicId=${clinicId}`);

  return data;
};

export const GetAttendantsByAttentionType = async (attentionTypeId: number) => {
  const { data } = await API.get<IOption[]>(`/clinic/ClinicAppointment/getattendantstype?id=${attentionTypeId}`);

  return data;
};

export const GetAllPendingAppointments = async () => {
  const { data } = await API.get<IGroupedClinicAppointment[]>(`/clinic/ClinicAppointment/getallPending`);

  return data;
};

export const SaveClinicAppointmentRequest = async (savingAppointment: ISavingClinicAppointment) => {
  const { data } = await API.post<IClinicAppointment>(`/clinic/ClinicAppointment/save`, savingAppointment);

  return data;
};

export const GetMyPendingAppointments = async () => {
  const { data } = await API.get<IClinicAppointment[]>(`/clinic/ClinicAppointment/getMyPending`);

  return data;
};

export const GetAttendingByClinic = async (clinicId: number) => {
  const { data } = await API.get<IClinicAppointment[]>(
    `/clinic/ClinicAppointment/getAttendingByClinic?clinicId=${clinicId}`
  );

  return data;
};
