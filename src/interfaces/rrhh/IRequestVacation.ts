// Generated by https://quicktype.io

import { IEmployeeData } from './IEmployeeData';
import { RangeDate } from './IRequestConstancia';

export interface IRequestVacation {
  codEmp: string;
  requestedDays: number;
  paid: boolean;
  dates: RangeDate;
}

export interface IVacationDetail {
  request: IVacationRequestDetail;
  detail: VacationDetail[];
  employeePosition: IEmployeeData;
}

export interface VacationDetail {
  desde: string;
  hasta: string;
  gozados: number;
  saldo: number;
}

export interface IVacationRequestDetail {
  sdvCodigo: number;
  sdvLoteMasivo: any;
  sdvCodemp: number;
  sdvFechaSolicitud: string;
  sdvDesde: string;
  sdvHasta: string;
  sdvSeEspecificaronHoras: boolean;
  sdvDias: number;
  sdvHoras: number;
  sdvPagadas: boolean;
  sdvEstado: string;
  sdvFechaCambioEstado: string;
  sdvComentarioAnulacion: string;
  sdvPropertyBagData: string;
  sdvCodigoWorkflow: string;
  sdvEstadoWorkflow: string;
  sdvIngresadoPortal: boolean;
  sdvUsuarioGrabacion: string;
  sdvFechaGrabacion: string;
  sdvUsuarioModificacion: string;
  sdvFechaModificacion: string;
  sdvWflCeDefAuth: number;
  sdvWflCeSolicita: number;
  sdvWflCeSujAcc: number;
  sdvWflCeAutorizador: any;
  sdvCodempNavigation: any;
  dvaDiasVacacions: any[];
}
