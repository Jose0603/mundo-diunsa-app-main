import {useQuery} from "react-query";

import {IPregunta} from "../interfaces/rrhh/IPregunta";
import {
  GetPeriodos,
  GetPreguntasByTipoEncuesta,
  GetReporteClimometro,
} from "../Services/rrhh/Pregunta";
import {QueryKeys} from "../Helpers/QueryKeys";
import {IResponseModel} from "../interfaces/IResponseModel";
import {CorrelativoConfirm} from "../Services/rrhh/Correlativo";

export function usePreguntaTipoEncuesta(id: number) {
  const {data, isLoading, error, isFetching} = useQuery<IPregunta[], Error>(
    [QueryKeys.PREGUNTAS, id],
    () => GetPreguntasByTipoEncuesta(id)
  );

  return {
    preguntas: data ?? [],
    isLoadingPreguntas: isLoading,
    error,
    isFetchingPreguntas: isFetching,
  };
}

export function useClimometroInfo() {
  const {data, isLoading, error, isFetching} = useQuery<IResponseModel, Error>(
    [QueryKeys.CLIMOMETROINFO],
    () => CorrelativoConfirm()
  );

  return {
    climometroInfo: data ?? [],
    isLoadingClimometroInfo: isLoading,
    error,
  };
}

export function useReporteClimometro(id: number) {
  const {data, isLoading, error, isFetching} = useQuery<IResponseModel, Error>(
    [QueryKeys.REPORTECLIMOMETRO, id],
    () => GetReporteClimometro(id)
  );

  return {
    reporteClimometro: data?.data ?? [],
    isLoadingReporteClimometro: isLoading,
    error,
  };
}

export function usePeriodo() {
  const {data, isLoading, error, isFetching} = useQuery<IResponseModel, Error>(
    [QueryKeys.REPORTECLIMOMETRO],
    () => GetPeriodos()
  );

  return {
    periodos: data?.data ?? [],
    isLoadingPeriodos: isLoading,
    error,
  };
}
