import { TicketStatus } from '../Enums/TicketStatus';

export enum LogType {
  CREATED = 'Creación',
  EDITED = 'Edición',
  STATUS = 'Cambio Estado',
}

export const getLogType = (status: number) => {
  switch (status) {
    case TicketStatus.CANCELLED:
      return {
        label: 'Cancelado',
        type: 'error',
      };
    case TicketStatus.CLOSED:
      return {
        label: 'Completado',
        type: 'success',
      };
    case TicketStatus.PENDING:
      return {
        label: 'Pendiente',
        type: 'coolGray',
      };
    case TicketStatus.ASSIGNED:
      return {
        label: 'Asignado',
        type: 'info',
      };
    case TicketStatus.INPROGRESS:
      return {
        label: 'En proceso',
        type: 'info',
      };
    default:
      return {
        label: 'Pendiente',
        type: 'coolGray',
      };
  }
};
