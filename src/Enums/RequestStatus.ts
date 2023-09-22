export enum RequestStatus {
  PENDING = 1,
  NOTIFIED,
  APPROVED,
  DENIED,
  ANULLED,
}

export enum RequestStatusStr {
  PENDING = "pendiente",
  NOTIFIED = "notificado",
  APPROVED = "autorizado",
  DENIED = "denegado",
  ANULLED = "anulado",
}

export enum RequestContestStatusStr {
  CREACION = "Creacion",
  INSCRIPCION = "InscripcionCandidatos",
  EVALUACION = "EvaluacionCandidatos",
  SELECCION = "SeleccionFinalistas",
  CONTRATACION = "ContratacionFinalistas",
  PENDIENTE = "PendienteAutorizacion",
  ANULLED = "Anulado",
  DENEGADO = "Denegado",
  FINALIZADO = "Finalizado",
}

export enum AllPossibleRequestStatuses {
  PENDING = "pendiente",
  NOTIFIED = "notificado",
  NOTIFIED2 = "notificada",
  APPROVED = "autorizado",
  APPROVED2 = "autorizada",
  DENIED = "denegado",
  DENIED2 = "denegada",
  ANULLED = "anulado",
  ANULLED2 = "anulada",
  CREATED = "creado",
  CREATED2 = "creada",
}
