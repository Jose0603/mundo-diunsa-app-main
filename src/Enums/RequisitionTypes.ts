export enum RequisitionTyoes {
  vacante = 'Vacante',
  nuevaPlaza = 'NuevaPlaza',
  sustitucion = 'Sustitucion',
}

export const getRequisitionType = (status: RequisitionTyoes) => {
  switch (status) {
    case 'NuevaPlaza':
      return 'Nueva Plaza';
    case 'Sustitucion':
      return 'Sustitución';
    case 'Vacante':
      return 'Vacante';
    default:
      return 'Tipo';
  }
};
