import {
  RequestContestStatusStr,
  RequestStatus,
  RequestStatusStr,
} from "../Enums/RequestStatus";
import {EntityTypes} from "../interfaces/rrhh/IRequestPendingApproval";

export const RequestStatuses = [
  {label: "Denegado", value: RequestStatus.DENIED},
  {label: "Pendiente", value: RequestStatus.PENDING},
  {label: "Aprobado", value: RequestStatus.APPROVED},
  {label: "Notificado", value: RequestStatus.NOTIFIED},
  {label: "Anulado", value: RequestStatus.ANULLED},
  {
    label: "Todos",
    value: -1,
  },
];

export const getRequestStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case RequestStatusStr.DENIED:
      return {
        label: "Denegado",
        type: "error",
      };
    case RequestStatusStr.ANULLED:
      return {
        label: "Denegado",
        type: "error",
      };
    case RequestStatusStr.APPROVED:
      return {
        label: "Autorizado",
        type: "success",
      };
    case RequestStatusStr.NOTIFIED:
      return {
        label: "Notificado",
        type: "info",
      };
    case RequestStatusStr.PENDING:
      return {
        label: "Pendiente",
        type: "coolGray",
      };
    default:
      return {
        label: "Todos",
        type: "warn",
      };
  }
};

export const getRequestContestStatus = (status: string) => {
  switch (status) {
    case RequestContestStatusStr.CREACION:
      return {
        label: "Creación",
      };
    case RequestContestStatusStr.INSCRIPCION:
      return {
        label: "Inscripción Candidatos",
      };
    case RequestContestStatusStr.EVALUACION:
      return {
        label: "Evaluación Candidatos",
      };
    case RequestContestStatusStr.SELECCION:
      return {
        label: "Selección Finalistas",
      };
    case RequestContestStatusStr.CONTRATACION:
      return {
        label: "Contratación Finalistas",
      };
    case RequestContestStatusStr.PENDIENTE:
      return {
        label: "Pendiente Autorización",
      };
    case RequestContestStatusStr.ANULLED:
      return {
        label: "Anulado",
      };
    case RequestContestStatusStr.DENEGADO:
      return {
        label: "Denegado",
      };
    case RequestContestStatusStr.FINALIZADO:
      return {
        label: "Finalizado",
      };
    default:
      return {
        label: "Todos",
      };
  }
};
export const getRequestType = (status: EntityTypes) => {
  switch (status) {
    case EntityTypes.constancias:
      return "Solicitud de Constancia";
    case EntityTypes.horas:
      return "Horas extras automaticas";
    case EntityTypes.incapacidades:
      return "Incapacidad";
    case EntityTypes.permiso:
      return "Solicitud de Permiso";
    case EntityTypes.solHoras:
      return "Solicitud de Horas Extra";
    case EntityTypes.tnn:
      return "Solicitud de Tiempo no Trabajado";
    case EntityTypes.vacacion:
      return "Solicitud de Vacaciones";
    case EntityTypes.cupontiempolibre:
      return "Solicitud de Cupon de Tiempo Libre";
    case EntityTypes.requisiciones:
      return "Requisición de Personal";
    default:
      return "Solicitud";
  }
};
