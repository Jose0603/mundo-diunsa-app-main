export interface IPregunta {
  id: number;
  descripcion: string;
  orden: number;
  categoriaId: number;
  categoriaDescripcion: string;
  categoriaTipoEncuestaId: number;
  categoriaTipoEncuestaDescripcion: string;
  answer: number;
}
export interface IPeriodo {
  id: number;
  mes: string;
  inicio: string;
  fin: string;
  activo: boolean;
  year: number;
  departamento: any;
}
