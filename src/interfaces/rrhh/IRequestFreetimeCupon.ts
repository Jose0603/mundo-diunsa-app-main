import { IEmployeeData } from './IEmployeeData';

export interface IRequestFreetimeCupon {
  fecha: Date;
  jornada: string;
  motivo: string;
}

export interface ICouponCount {
  periodo: string;
  gozados: number;
  saldo: number;
}

export interface ICouponEnjoyedDays {
  desde: string;
  hasta: string;
  motivo: string;
}

export interface IFreeTimeCouponDetail {
  request: Request;
  employeePosition: IEmployeeData;
}

export interface Request {
  dctCodigo: number;
  dctCodemp: number;
  expNombresApellidos: string;
  expCodigoAlternativo: string;
  dctDesde: string;
  dctHasta: string;
  dctHoras: number;
  dctMotivo: string;
  solicitante: null;
  dctEstado: string;
  dctFechaSolicitud: string;
  dctFechaGrabacion: string;
  dctFechaModificacion: string;
}
