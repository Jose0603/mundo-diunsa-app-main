export interface IMarking {
  fecha: string;
  estado: string;
  comentario?: string;
}

export interface IMarkingReq {
  startDate: string;
  endDate: string;
  empCode: string;
}
