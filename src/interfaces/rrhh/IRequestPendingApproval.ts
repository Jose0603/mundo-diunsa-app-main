export enum EntityTypes {
  constancias = 'SolicitudesConstancia',
  vacacion = 'SolicitudesVacaciones',
  tnn = 'TiemposNoTrabajados',
  horas = 'HorasExtras',
  solHoras = 'SolicitudesHoraExtra',
  permiso = 'SolicitudesPermiso',
  retiros = 'Retiros',
  movimientos = 'Movimientos',
  incrementos = 'Incrementos',
  incapacidades = 'Incapacidades',
  cupontiempolibre = 'SolicitudCuponTiempoLibre',
  entidadAdicional = 'InstanciasEntidadesAdicionales',
  requisiciones = 'RequisicionesPersonal',
}

export interface IRequestPendingApproval {
  iraCodigo: string;
  iraCodigoEntidad: string;
  iraEntitysetName: EntityTypes;
  ainCodigo: number;
  ainNombre: string;
  draTipoResponsable: string;
  draCodemp: number;
  ainOrden: number;
  codempResponsable: string;
  nombreResponsable: string;
  comempSujetoAccion: string;
  nombreSujetoAccion: string;
  ainEstado: string;
  ainFechaPendiente: string;
  ainFechaNotificado: string;
  ainFechaAutorizado: string;
  ainFechaDenegado: string;
  ainFechaAnulado: string;
  ainUsuarioGrabacion: string;
  usrNombreUsuario: string;
  iraCodempSujetoAccion: number;
  plzCodcia: number;
}
