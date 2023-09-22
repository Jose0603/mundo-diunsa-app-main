export interface INotification {
  id: number;
  title: string;
  description: string;
  notificationType: number;
  screenName: string;
  intScreenParam: number;
  stringScreenParam: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  lastSend: string;
  lastSuccessCount: number;
  lsatFailureCount: number;
  read: boolean;
}

export interface IUpdateStatus {
  read: boolean;
  id: number;
}
