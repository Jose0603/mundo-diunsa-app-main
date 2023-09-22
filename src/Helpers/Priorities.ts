export enum ticketPriority {
  LOW = 1,
  MEDIUM,
  HIGH,
}

export const Priorities = [
  { label: 'Baja', value: ticketPriority.LOW },
  { label: 'Media', value: ticketPriority.MEDIUM },
  { label: 'Alta', value: ticketPriority.HIGH },
];

export const getTicketPriority = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'baja':
      return {
        label: 'Baja',
        type: 'error',
      };
    case 'media':
      return {
        label: 'Media',
        type: 'success',
      };
    case 'alta':
      return {
        label: 'Alta',
        type: 'coolGray',
      };
  }
};
