import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { queryClient } from '../Configs/QueryClient';
import { AppPermissions } from '../Helpers/AppPermissions';
import { QueryKeys } from '../Helpers/QueryKeys';
import { Area, Category, IReminder, ISurvey, PagedData, SubCategory } from '../interfaces/IIncident';
import { IAdditional, IExpExpediente } from '../interfaces/rrhh/IExpExpediente';
import { INewsCategory } from '../interfaces/rrhh/INews';
import { IOption } from '../interfaces/shared/IOption';
import { RootState } from '../Redux/reducers/rootReducer';
import { AreasService, CategoriesService, StoresService } from '../Services/incidents/Categories';
import { GetIncidents } from '../Services/incidents/Incidents';
import { ReminderService } from '../Services/incidents/Reminders';
import { SubcategoriesService } from '../Services/incidents/Subcategory';
import { SurveyService } from '../Services/incidents/Surveys';
import { ExpedienteExtraData, ExpedienteService } from '../Services/rrhh/ExpExpediente';
import { GetAllNewsCategories } from '../Services/rrhh/News';
import { useHasPermissions } from './usePermissions';

export default function useIncidents() {
  const isTechnician = useHasPermissions([AppPermissions.tecnico]);
  const user = useSelector((state: RootState) => state.auth.login);
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       // ✅ tiempo del cache por defecto a 60 segundos
  //       staleTime: 1000 * 60,
  //     },
  //   },
  // });

  const RefetchQuery = async (queryKey: string) => {
    await queryClient.refetchQueries(queryKey);
  };

  return {
    Areas: useQuery<Area[], Error>(QueryKeys.AREAS, () => AreasService()),
    Categories: useQuery<Category[], Error>(QueryKeys.CATEGORIES, () =>
      CategoriesService()
    ),
    SubCategories: useQuery<SubCategory[], Error>(
      QueryKeys.SUB_CATEGORIES,
      () => SubcategoriesService()
    ),
    Incidents: useQuery<PagedData<any>, Error>(QueryKeys.INCIDENTS, () =>
      GetIncidents({})
    ),
    Stores: useQuery<IOption[], Error>(QueryKeys.STORES, () =>
      StoresService(isTechnician)
    ),
    Reminders: useQuery<IReminder[], Error>(QueryKeys.REMINDERS, () =>
      ReminderService()
    ),
    Surveys: useQuery<ISurvey[], Error>(QueryKeys.SURVEYS, () =>
      SurveyService()
    ),
    NewsCategoies: useQuery<INewsCategory[], Error>(
      QueryKeys.NEWS_CATEGORIES,
      () => GetAllNewsCategories()
    ),
    Expediente: useQuery<IExpExpediente, Error>([QueryKeys.PROFILES, user.employeeId], () =>
      ExpedienteService(user.employeeId)
    ),
    ExpedienteExtraData: useQuery<IAdditional, Error>([QueryKeys.EXTRADATA, user.employeeId], () =>
      ExpedienteExtraData(user.employeeId)
    ),
    RefetchQuery,
  };
}
