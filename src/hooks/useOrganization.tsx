import { useQuery } from 'react-query';

import { QueryKeys } from '../Helpers/QueryKeys';
import { IContractType } from '../interfaces/organization/IContractType';
import { IPosition } from '../interfaces/organization/IPosition';
import { IPositionType } from '../interfaces/organization/IPositionType';
import { IWorkingCenter } from '../interfaces/organization/IWorkingCenter';
import { IWorkingUnit } from '../interfaces/organization/IWorkingUnit';
import organizationServices from '../Services/rrhh/Organization';

export function useContractTypes() {
  const { data, isLoading, error, isError } = useQuery<IContractType[], Error>([QueryKeys.CONTRACT_TYPES], () =>
    organizationServices.GetContractTypes()
  );

  return {
    contractTypes: data ?? [],
    isLoadingContractTypes: isLoading,
    error,
    isError,
  };
}

export function usePositionTypes() {
  const { data, isLoading, error, isError } = useQuery<IPositionType[], Error>([QueryKeys.POSITION_TYPES], () =>
    organizationServices.GetPositionTypes()
  );

  return {
    positionTypes: data ?? [],
    isLoadingPositionTypes: isLoading,
    error,
    isError,
  };
}

export function usePositions(positionTypeId: number) {
  const { data, isLoading, error, isError } = useQuery<IPosition[], Error>([QueryKeys.POSITIONS, positionTypeId], () =>
    organizationServices.GetPositions(positionTypeId)
  );

  return {
    positions: data ?? [],
    isLoadingPositions: isLoading,
    error,
    isError,
  };
}

export function useWorkingCenters() {
  const { data, isLoading, error, isError } = useQuery<IWorkingCenter[], Error>([QueryKeys.WORKING_CENTERS], () =>
    organizationServices.GetWorkingCenters()
  );

  return {
    workingCenters: data ?? [],
    isLoadingWorkingCenters: isLoading,
    error,
    isError,
  };
}

export function useWorkingUnits() {
  const { data, isLoading, error, isError } = useQuery<IWorkingUnit[], Error>([QueryKeys.WORKING_UNITS], () =>
    organizationServices.GetWorkingUnits()
  );

  return {
    workingUnits: data ?? [],
    isLoadingWorkingUnits: isLoading,
    error,
    isError,
  };
}
