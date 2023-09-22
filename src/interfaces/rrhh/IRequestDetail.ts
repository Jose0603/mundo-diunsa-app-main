import { EntityTypes } from './IRequestPendingApproval';

export interface IRequestDetail {
  fluSolicitud: EntityTypes;
  fluRegistro: number;
  fluSujeto: number;
  fluNombreSujeto: string;
  fluSolicitante: number;
  fluCodigoAlternativo: string;
  fluNombreSolicitante: string;
  fluEstado: string;
  fluFechaSolicitud: string;
  fluTipo: string;
  fluDescripcion: string;
  fluFechaInicio: string;
  fluFechaFin: string;
  fluMotivo: string;
  fluDias: number;
  fluHoras: number;
  fluMinutos: number;
  fluCodcia: number;
  fluCodppl: number;
  fluCodigoPlanilla: string;
  fluPeriodo: string;
  fluComentarioAprobador: string;
}
