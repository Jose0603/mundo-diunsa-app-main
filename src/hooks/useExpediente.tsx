import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import { QueryKeys } from "../Helpers/QueryKeys";
import { IResponseModel } from "../interfaces/IResponseModel";
import { IAdditional, IAfeAficiones, IDexDirecciones, IEmeEmergencia, IExpExpediente, IFaeFamiliares } from "../interfaces/rrhh/IExpExpediente";
import { IOption } from "../interfaces/shared/IOption";
import { AuthState } from "../Redux/reducers/auth/loginReducer";
import { GetAllUserHubbies, GetHubbies } from "../Services/rrhh/AfeAficionesExpediente";
import { GetAdress, GetAdressType, GetAllUserAdresses } from "../Services/rrhh/DexDireccionesExpediente";
import { GetAllUserEmergencyContacts, GetEmergencyContact } from "../Services/rrhh/EmeEmergenciaExpediente";
import { ExpedienteExtraData, ExpedienteService, GetDepartamentos, GetMunicipios, GetPaises, GetParentescos } from "../Services/rrhh/ExpExpediente";
import { GetAllUserFamilies, GetCurrencies, GetDocs, GetFamiliar } from "../Services/rrhh/FaeFamiliaresExpediente";
import { GetIsBoss } from "../Services/User";

export function useExpediente(codigo: string) {
  const {data, isLoading, error, isFetching} = useQuery<IExpExpediente, Error>(
    [QueryKeys.PROFILES, codigo],
    () => ExpedienteService(codigo)
  );

  return {
    expediente: data ?? [],
    isLoadingExpediente: isLoading,
    error,
    isFetchingExpediente: isFetching,
  };
}

export function usePaises() {
  const {data, isLoading, error, isFetching} = useQuery<IOption[], Error>(
    [QueryKeys.PAISES, "paises"],
    () => GetPaises()
  );

  return {
    paises: data ?? [],
    isLoadingPaises: isLoading,
    error,
    isFetchingPaises: isFetching,
  };
}

export function useDepartamentos(codigo: string) {
  const {data, isLoading, error, isFetching} = useQuery<IOption[], Error>(
    [QueryKeys.DEPARTAMENTOS, codigo],
    () => GetDepartamentos(codigo)
  );

  return {
    departamentos: data ?? [],
    isLoadingDepartamentos: isLoading,
    error,
    isFetchingDepartamentos: isFetching,
  };
}

export function useMunicipios(codigo: number) {
  const {data, isLoading, error, isFetching} = useQuery<IOption[], Error>(
    [QueryKeys.MUNICIPIOS, codigo],
    () => GetMunicipios(codigo)
  );

  return {
    municipios: data ?? [],
    isLoadingMunicipios: isLoading,
    error,
    isFetchingMunicipios: isFetching,
  };
}

export function useParentescos() {
  const {data, isLoading, error, isFetching} = useQuery<IOption[], Error>(
    [QueryKeys.PARENTESCOS, "parentescos"],
    () => GetParentescos()
  );

  return {
    parentescos: data ?? [],
    isLoadingParentescos: isLoading,
    error,
    isFetchingParentescos: isFetching,
  };
}

export function useAdressTypes() {
  const {data, isLoading, error, isFetching} = useQuery<IOption[], Error>(
    [QueryKeys.ADRESSESTYPE, "adressTypes"],
    () => GetAdressType()
  );

  return {
    adressTypes: data ?? [],
    isLoadingAdressTypes: isLoading,
    error,
    isFetchingAdressTypes: isFetching,
  };
}

export function useUserAdresses(codigo: string) {
  const {data, isLoading, error, isFetching} = useQuery<
    IDexDirecciones[],
    Error
  >([QueryKeys.ADRESSES, codigo], () => GetAllUserAdresses(codigo));

  return {
    adresses: data ?? [],
    isLoadingAdresses: isLoading,
    error,
    isFetchingAdresses: isFetching,
  };
}

export function useUserAddress(codigo: number) {
  const {data, isLoading, error, isFetching} = useQuery<IDexDirecciones, Error>(
    [QueryKeys.ADRESSES, codigo],
    () => GetAdress(codigo)
  );

  return {
    adress: data,
    isLoadingAdress: isLoading,
    error,
    isFetchingAdress: isFetching,
  };
}

export function useUserEmergencyContacts(codigo: string) {
  const {data, isLoading, error, isFetching, refetch} = useQuery<
    IEmeEmergencia[],
    Error
  >([QueryKeys.EMERGENCY_CONTACTS, codigo], () =>
    GetAllUserEmergencyContacts(codigo)
  );

  return {
    contacts: data ?? [],
    isLoadingContact: isLoading,
    error,
    isFetchingContact: isFetching,
    refetch,
  };
}

export function useUserEmergencyContact(codigo: number) {
  const {data, isLoading, error, isFetching} = useQuery<IEmeEmergencia, Error>(
    [QueryKeys.EMERGENCY_CONTACTS, codigo],
    () => GetEmergencyContact(codigo)
  );

  return {
    contact: data,
    isLoadingContact: isLoading,
    error,
    isFetchingContact: isFetching,
  };
}

export function useUserFamily(codigo: string) {
  const {data, isLoading, error, isFetching} = useQuery<
    IFaeFamiliares[],
    Error
  >([QueryKeys.FAMILIES, codigo], () => GetAllUserFamilies(codigo));

  return {
    families: data ?? [],
    isLoadingFamilies: isLoading,
    error,
    isFetchingFamilies: isFetching,
  };
}

export function useUserFam(codigo: number) {
  const {data, isLoading, error, isFetching} = useQuery<IFaeFamiliares, Error>(
    [QueryKeys.FAMILIES, codigo],
    () => GetFamiliar(codigo)
  );

  return {
    family: data,
    isLoadingFamily: isLoading,
    error,
    isFetchingFamily: isFetching,
  };
}

// export function useUserFamilyImages(codigo: number) {
//   const { data, isLoading, error, isFetching } = useQuery<string[], Error>(
//     [QueryKeys.FAMILYIMAGES, codigo],
//     () => GetAllUserFamilyImages(codigo)
//   );

//   return {
//     images: data ?? [],
//     isLoadingImages: isLoading,
//     error,
//     isFetchingImages: isFetching,
//   };
// }

export function useDocs() {
  const {data, isLoading, error, isFetching} = useQuery<IOption[], Error>(
    [QueryKeys.FAEDOCS, "faedocs"],
    () => GetDocs()
  );

  return {
    documentos: data ?? [],
    isLoadingDocumentos: isLoading,
    error,
    isFetchingDocumentos: isFetching,
  };
}

export function useCurrency() {
  const {data, isLoading, error, isFetching} = useQuery<IOption[], Error>(
    [QueryKeys.CURRENCIES, "currencies"],
    () => GetCurrencies()
  );

  return {
    currencies: data ?? [],
    isLoadingCurrencies: isLoading,
    error,
    isFetchingCurrencies: isFetching,
  };
}

export function useUserHubbies(codigo: string) {
  const {data, isLoading, error, isFetching} = useQuery<IAfeAficiones[], Error>(
    [QueryKeys.HUBBIES, codigo],
    () => GetAllUserHubbies(codigo),
    {
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );

  return {
    userHubbies: data ?? [],
    isLoadingUserHubbies: isLoading,
    error,
    isFetchingUserHubbies: isFetching,
  };
}

export function useHubby() {
  const {data, isLoading, error, isFetching} = useQuery<IOption[], Error>(
    [QueryKeys.HUBBIES, "hubbies"],
    () => GetHubbies()
  );

  return {
    hubbies: data ?? [],
    isLoadingHubbies: isLoading,
    error,
    isFetchingHubbies: isFetching,
  };
}

export function useExpedienteExtraData(codigo: string) {
  const {data, isLoading, error, isFetching} = useQuery<IAdditional, Error>(
    [QueryKeys.EXTRADATA, codigo],
    () => ExpedienteExtraData(codigo)
  );

  return {
    extraData: data ?? null,
    isLoadingExtraData: isLoading,
    error,
    isFetchingExtraData: isFetching,
  };
}

export function useIsBoss() {
  const user: AuthState = useSelector((state: any) => state.auth.login);

  const {data, isLoading, error, isFetching} = useQuery<IResponseModel, Error>(
    [QueryKeys.ISBOSS, user.employeeId],
    () => GetIsBoss()
  );

  return {
    isBoss: data?.data ?? null,
    isLoadingIsBoss: isLoading,
  };
}
