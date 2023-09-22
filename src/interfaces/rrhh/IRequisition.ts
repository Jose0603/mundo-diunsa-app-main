export interface ISavingRequisition {
  repCodigo?: number | null;
  repTipoRequisicion: string;
  repCodgrc: number;
  repJustificacion: string | null;
  repCodncc: number | null;
  repCodtco: number;
  repFechaIniContratacion: string | undefined;
  repFechaFinContratacion: string | undefined;
  repFechaSolicitud: string | undefined;
}

export interface ISavingNewPositionRequisition extends ISavingRequisition {
  perPersonasRequisicions: PerPersonasRequisicion[];
  repNombrePlaza: string;
  repCodtpp: number;
  repCodpue: number;
}
export interface ISavingSubstitutionRequisition extends ISavingRequisition {
  sustitucionRequisiciones: sustitutosRequisicion[];
  repCodtpp: number | null;
  repCodpue: number | null;
}
export interface ISavingVacancyRequisition extends ISavingRequisition {
  vacantesRequisiciones: vacanteRequisicion[];
}

export interface PerPersonasRequisicion {
  perCodigo: number | null;
  perCodrep: number | null;
  perNumPersonas: number;
  perCodcdt: number;
  perCodjor: number;
  perCoduni: number;
}

export interface sustitutosRequisicion {
  serCodrep: number | null;
  serCodemp: number;
  serCodplz: number;
}

export interface vacanteRequisicion {
  pvrCodplzVacante: number;
  pvrCodjor: number;
  pvrNumPlazas: number;
}

export interface ISubordinatePosition {
  codPlaza: number;
  codEmpleo: number;
  nombrePlaza: string;
  codPuesto: number;
  nombrePuesto: string;
  codUnidad: number;
  nombreUnidad: string;
  codCentroTrabajo: number;
  nombreCentroTrabajo: string;
  codCentroCosto: number;
  nombreCentroCosto: string;
  maxEmpleados: number;
  disponibles: number;
  ocupadas: number;
  temporale: number;
  codigoAlternativo: string;
  nombre: string;
}

export interface IVacancy {
  codPlaza: number;
  nombrePlaza: string;
  codPuesto: number;
  nombrePuesto: string;
  codUnidad: number;
  nombreUnidad: string;
  codCentroTrabajo: number;
  nombreCentroTrabajo: string;
  codCentroCosto: number;
  nombreCentroCosto: string;
  maxEmpleados: number;
  disponibles: number;
  ocupadas: number;
  temporale: number;
  numPlazas?: number | null;
}
