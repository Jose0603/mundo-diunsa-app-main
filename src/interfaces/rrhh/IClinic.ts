import { IOption } from '../shared/IOption';

export interface IClinicAppointment {
  id: number;
  clinicId: number;
  ticketNumber: number;
  userId: string;
  attentionTypeId: number;
  attendantId: number;
  status: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  attendantName: string;
  attentionTypeName: string;
  clinicName: string;
  userName: string;
}

export interface IGroupedClinicAppointment {
  clinicId: number;
  appointments: IClinicAppointment[];
}

export interface IClinicAttentionType {
  id: number;
  name: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  clinicAttentionAttendants: IOption[];
}

export interface IClinic {
  id: number;
  name: string;
  locationId: number;
  locationName: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  clinicAppointments: string;
}

export interface ISavingClinicAppointment {
  id?: number;
  clinicId: number;
  userId: string;
  attentionTypeId: number;
  attendantId: number;
  status?: string;
}
