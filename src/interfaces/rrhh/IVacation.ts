export interface IVacationPeriod {
  desde: string;
  hasta: string;
  gozados: number;
  saldo: number;
}

export interface IEnjoyedVacation {
  desde: string;
  hasta: string;
  dias: number;
  fuePagada: boolean;
}
