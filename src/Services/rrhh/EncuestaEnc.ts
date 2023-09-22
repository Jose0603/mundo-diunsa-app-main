import {IPregunta} from "../../interfaces/rrhh/IPregunta";
import API from "../../Axios";
import {IResponseModel} from "../../interfaces/IResponseModel";
import {IEncuestaClimometro} from "../../interfaces/rrhh/IEncuestaClimometro";

export const SavePreguntasRequest = async (preguntas: IPregunta[]) => {
  const {data} = await API.post<IResponseModel>(`/EncuestaEnc/save`, preguntas);

  return data;
};

export const SavePreguntasClimometroRequest = async (
  climometro: IEncuestaClimometro[]
) => {
  const {data} = await API.post<IResponseModel>(
    `/EncuestaClimaLaboral/save`,
    climometro
  );

  return data;
};
