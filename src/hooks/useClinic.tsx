import { useQuery } from 'react-query';

import { QueryKeys } from '../Helpers/QueryKeys';
import {
  IClinic,
  IClinicAppointment,
  IClinicAttentionType,
  IGroupedClinicAppointment,
} from '../interfaces/rrhh/IClinic';
import { IOption } from '../interfaces/shared/IOption';
import {
  GetAllClinics,
  GetAllPendingAppointments,
  GetAttendantsByAttentionType,
  GetAttendingByClinic,
  GetAttentionTypes,
  GetMyPendingAppointments,
} from '../Services/rrhh/Clinic';

export function useClinicAttentionType(clinicId: number) {
  const { data, isLoading, error, isFetching } = useQuery<IClinicAttentionType[], Error>(
    [QueryKeys.CLINIC_ATTENTION_TYPES, clinicId],
    () => GetAttentionTypes(clinicId)
  );

  return {
    attentionTypes: data ?? [],
    isLoadingClinicAttentionTypes: isLoading,
    error,
    isFetchingAttentionTypes: isFetching,
  };
}

export function useClinicAttendantsByType(attentionTypeId: number) {
  const { data, isLoading, error, isFetching } = useQuery<IOption[], Error>(
    [QueryKeys.CLINIC_ATTENDANTS_BY_TYPE, attentionTypeId],
    () => GetAttendantsByAttentionType(attentionTypeId)
  );

  return {
    attendants: data ?? [],
    isLoadingAttendants: isLoading,
    error,
    isFetchingAttendants: isFetching,
  };
}

export function useClinic() {
  const { data, isLoading, error, isFetching } = useQuery<IClinic[], Error>([QueryKeys.CLINICS], () => GetAllClinics());

  return {
    clinics: data ?? [],
    isLoadingClinics: isLoading,
    error,
    isFetchingClinics: isFetching,
  };
}

export function useMyAppointments() {
  const { data, isLoading, error, isFetching } = useQuery<IClinicAppointment[], Error>(
    [QueryKeys.CLINIC_MY_APPOINTMENTS],
    () => GetMyPendingAppointments()
  );

  return {
    myAppointments: data ?? [],
    isLoadingMyAppointments: isLoading,
    error,
    isFetchingMyAppointments: isFetching,
  };
}

export function useAttendingAppointments(clinicId: number) {
  const { data, isLoading, error, isFetching } = useQuery<IClinicAppointment[], Error>(
    [QueryKeys.CLINIC_ATTENDIND, clinicId],
    () => GetAttendingByClinic(clinicId)
  );

  return {
    currentlyAttending: data ?? [],
    isLoadingCurrentlyAttending: isLoading,
    error,
    isFetchingCurrentlyAttending: isFetching,
  };
}

export function usePendingAppointments() {
  const { data, isLoading, error, isFetching } = useQuery<IGroupedClinicAppointment[], Error>(
    [QueryKeys.CLINIC_PENDING_APPOINTMENTS],
    () => GetAllPendingAppointments()
  );

  return {
    appointments: data ?? [],
    isLoadingAppointments: isLoading,
    error,
    isFetchingAppointments: isFetching,
  };
}
