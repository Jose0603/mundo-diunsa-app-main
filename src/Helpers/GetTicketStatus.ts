import { TicketStatus } from '../Enums/TicketStatus';

export const TicketStatuses = [
  { label: 'Cancelados', value: TicketStatus.CANCELLED },
  { label: 'Completados', value: TicketStatus.CLOSED },
  { label: 'Pendientes', value: TicketStatus.PENDING },
  { label: 'Asignados', value: TicketStatus.ASSIGNED },
  { label: 'En Proceso', value: TicketStatus.INPROGRESS },
  {
    label: 'Todos',
    value: -1,
  },
];

export const getTicketStatus = (status: number) => {
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
        label: 'Todos',
        type: 'warn',
      };
  }
};
