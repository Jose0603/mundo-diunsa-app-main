import { IUploadingImage } from '../IUploadingImage';

export interface IExpExpediente {
  expCodigoAlternativo: string;
  expCodpaiNacimiento: string;
  expCodpaiNacionalidad: string;
  expProfesion: string;
  expEstadoCivil: string;
  expFechaNac: Date;
  expCodmunNac: number;
  expCoddepNac: number;
  expEmail: string;
  expEmailInterno: string;
  expTelefonoMovil: string;
  expTelefonoInterno: string;
  expNombresApellidos: string;
  expPropertyBagData: string;
  expObservaciones: string;
}

export interface IDexDirecciones {
  dexCodigo: number;
  dexCodexp: number;
  dexDireccion: string;
  dexTipoPropiedad: string;
  dexPais: string;
  dexDep: number;
  dexCodmun: number;
  dexBarrio: string;
  dexCodigoPostal: string;
  dexTelefono: string;
  dexCodtid: number;
  dexCodtName: string;
  dexObservacion: string;
  dexCreadoUsuario: boolean;
}

export interface IEmeEmergencia {
  emeCodigo: number;
  emeCodexp: number;
  emeSecuencial: number;
  emeNombre: string;
  emeCodprt: number | null;
  emeCodprtName: string;
  emeDireccion: string;
  emeTelefono: string;
  emeTrabajo: string;
  emeTelefonoTrabajo: string;
  emePropertyBagData: string;
  emeCreadoUsuario: boolean;
  emeObservacion: string;
}

export interface IFaeFamiliares {
  faeCodigo: number;
  faeCodexp: number;
  faeNombre: string;
  faeCodprt: number;
  faeCodprtName: string;
  faeCodpaiNacionalidad: string;
  faePais: string;
  faeFechaNac: string;
  faeSexo: string;
  faeEstadoCivil: string;
  faeOcupacion: string;
  faeCodtdo: number;
  faeDocumento: string;
  faeTelefonoMovil: string;
  faeEstudia: boolean;
  faeBeca: boolean;
  faeNivelEstudio: string;
  faeLugarEstudio: string;
  faeDepende: boolean;
  faeEsBenefPrestLegales: boolean;
  faeTrabaja: boolean;
  faeCargo: string;
  faeLugarTrabajo: string;
  faeTelefonoTrabajo: string;
  faeSalario: number;
  faeCodmon: string | null;
  faeFallecido: boolean;
  faeFechaFallecido: string;
  faePropertyBagData: string;
  faeCreadoUsuario: boolean;
  faeObservacion: string;
  faeImagenes: string[];
}

export interface IAfeAficiones {
  afeCodigo: number;
  afeCodexp: number;
  afeCodafi: number;
  afeCodafiName: string;
  afePractica: boolean;
  afePropertyBagData: string;
}

export interface IAdditional {
  codigo?: string;
  tipoSangre: string;
  peso: number;
  altura: number;
  religion: string;
  talla: string;
  extension?: string;
  tipoTransporte: string;
}
