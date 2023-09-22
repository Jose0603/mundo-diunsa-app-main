import {IPregunta} from "../../interfaces/rrhh/IPregunta";
import API from "../../Axios";
import {IResponseModel} from "../../interfaces/IResponseModel";

export const GetPreguntasByTipoEncuesta = async (tipoEncuesta: number) => {
  const {data} = await API.get<IPregunta[]>(
    `/Pregunta/GetAllByTipoEncuesta?tipoEncuesta=${tipoEncuesta}`
  );

  return data;
};

export const GetReporteClimometro = async (periodoId: number) => {
  const {data} = await API.get<IResponseModel>(
    `/EncuestaClimaLaboral/reporte?periodoId=${periodoId}`
  );

  return data;
};

export const GetPeriodos = async () => {
  const {data} = await API.get<IResponseModel>(`/Periodo/getall`);

  return data;
};
