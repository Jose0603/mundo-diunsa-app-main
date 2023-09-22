import { IEmployeeData } from './IEmployeeData';

export interface ITimeNotWorkedDetail {
  request: IRequestTimeNotWorkedDetail;
  employeePosition: IEmployeeData;
}

export interface IRequestTimeNotWorkedDetail {
  tnnCodigo: number;
  tnnLoteMasivo: any;
  tnnCodsli: any;
  tnnCodemp: number;
  expNombresApellidos: string;
  tnnCodtnt: number;
  tntDescripcion: string;
  tnnFechaDel: string;
  tnnFechaAl: string;
  tnnNumDias: number;
  tnnNumHoras: number;
  tnnNumMins: number;
  tnnModoIngreso: string;
  tnnMotivo: string;
  tnnObservacion: string;
  tnnCodempSolicita: number;
  solicitante: string;
  tnnGeneradoReloj: boolean;
  tnnPorcentajeDescuento: number;
  tnnEspecificaHoras: boolean;
  tnnSalarioDiario: number;
  tnnSalarioHora: number;
  tnnValorAPagar: number;
  tnnValorADescontar: number;
  tnnCodmon: string;
  monDescripcion: string;
  expCodigoAlternativo: string;
  tnnEstado: string;
  tnnFechaCambioEstado: string;
  tnnComentarioAnulacion: string;
  tnnCodppl: number;
  planilla: string;
  pplCodtpl: number;
  tplDescripcion: string;
  tnnAplicadoPlanilla: boolean;
  tnnPlanillaAutorizada: boolean;
  tnnIgnorarEnPlanilla: boolean;
  tnnCodslp: any;
  tnnPropertyBagData: string;
  tnnCodigoWorkflow: string;
  tnnEstadoWorkflow: string;
  tnnIngresadoPortal: boolean;
  tnnUsuarioGrabacion: string;
  tnnFechaGrabacion: string;
  tnnUsuarioModificacion: string;
  tnnFechaModificacion: string;
  tnnWflCeDefAuth: number;
  tnnWflCeSolicita: number;
  tnnWflCeSujAcc: number;
  tnnWflCeAutorizador: number;
  tnnPagado: any;
  tnnCodixe: any;
  tnnGeneradoAutomatico: any;
}
