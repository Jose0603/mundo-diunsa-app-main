import { RequisitionTyoes } from '../../Enums/RequisitionTypes';
import { IEmployeeData } from './IEmployeeData';

export interface IRequisitionDetail {
  request: Request;
  employeePosition: IEmployeeData;
}

export interface Request {
  repCodigo: number;
  repTipoRequisicion: RequisitionTyoes;
  repCodempSolicita: number;
  expNombresApellidos: string;
  expCodigoAlternativo: string;
  repJustificacion: string;
  solicitante: string;
  repEstado: string;
  repFechaSolicitud: string;
  repFechaGrabacion: string;
  repFechaModificacion: string;
  repTipoContrato: string;
  fechaInicio: string;
  fechaFin: string | null;
  tipoPuesto: string;
  puesto: string;
  plzNombre: string;
  perPersonas: PerPersonas[] | null;
  pvrPlazas: PvrPlazas[] | null;
  serSustituciones: SerSustitucion[] | null;
}

interface PerPersonas {
  perCodigo: number | null;
  perCodrep: number | null;
  perNumPer: number;
  perCodcdt: number;
  perCodjor: number;
  jorNombre: string;
  perCoduni: number;
  cdtNombre: string | null;
  uniNombre: string | null;
}

interface PvrPlazas {
  pvrCodigo: number | null;
  pvrCodrep: number | null;
  perNumPlazas: number;
  pvrCodPlz: number;
  plzNombre: number | null;
  pvrCodjor: number;
  jorNombre: string;
  uniNombre: string | null;
  pueNombre: string | null;
  cdtNombre: string | null;
}

interface SerSustitucion {
  serCodigo: number | null;
  serCodRep: number | null;
  serCodEmp: number;
  expNombresApellidos: number;
  serCodPlz: number;
  plzNombre: string | null;
  uniNombre: string | null;
  pueNombre: string | null;
  cdtNombre: string | null;
}
