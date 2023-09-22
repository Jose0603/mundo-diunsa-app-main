import { IEmployeeData } from './IEmployeeData';

export interface IRequestConstancia {
  comentario: string;
  delegado: string;
  delegarEntrega: boolean;
  dirigidaA: string;
  motivo: string;
  rangeDate: RangeDate;
  tipoConstancia: string;
}

export interface RangeDate {
  startDate: Date | moment.Moment;
  endDate: Date | moment.Moment;
}

// Generated by https://quicktype.io

export interface IRecordDetail {
  request: IRequestRecordDetail;
  employeePosition: IEmployeeData;
}

export interface IRequestRecordDetail {
  slcCodigo: number;
  slcFechaSolicitud: string;
  slcCodempSolicitante: number;
  slcEstado: string;
  slcFechaCambioEstado: string;
  slcTipo: string;
  slcEsPersonal: boolean;
  slcNombreDelegado: string;
  slcCodempDelegado: string;
  slcComentarios: string;
  slcDirigidaA: string;
  slcFechaSalida: string;
  slcFechaRegreso: string;
  slcMotivoViaje: string;
  slcComentarioAnulacion: string;
  slcPropertyBagData: any;
  slcCodigoWorkflow: string;
  slcEstadoWorkflow: string;
  slcIngresadoPortal: boolean;
  slcUsuarioGrabacion: string;
  slcFechaGrabacion: string;
  slcUsuarioModificacion: string;
  slcFechaModificacion: string;
  slcWflCeDefAuth: number;
  slcWflCeSolicita: number;
  slcWflCeSujAcc: number;
  slcWflCeAutorizador: string;
  slcCodempDelegadoNavigation: string;
  slcCodempSolicitanteNavigation: string;
}