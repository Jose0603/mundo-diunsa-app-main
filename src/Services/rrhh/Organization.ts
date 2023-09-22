import API from '../../Axios';
import { IContractType } from '../../interfaces/organization/IContractType';
import { IPosition } from '../../interfaces/organization/IPosition';
import { IPositionType } from '../../interfaces/organization/IPositionType';
import { IWorkingCenter } from '../../interfaces/organization/IWorkingCenter';
import { IWorkingUnit } from '../../interfaces/organization/IWorkingUnit';

const GetContractTypes = async () => {
  const { data } = await API.get<IContractType[]>(`/OrganizationStructure/ContractTypes`);

  return data;
};

const GetPositionTypes = async () => {
  const { data } = await API.get<IPositionType[]>(`/OrganizationStructure/PositionTypes`);

  return data;
};

const GetPositions = async (positionTyoeId: number) => {
  const { data } = await API.get<IPosition[]>(`/OrganizationStructure/Positions?positionTypeId=${positionTyoeId}`);

  return data;
};

const GetWorkingCenters = async () => {
  const { data } = await API.get<IWorkingCenter[]>(`/OrganizationStructure/WorkingCenters`);

  return data;
};

const GetWorkingUnits = async () => {
  const { data } = await API.get<IWorkingUnit[]>(`/OrganizationStructure/WorkingUnits`);

  return data;
};

export default {
  GetContractTypes,
  GetPositionTypes,
  GetPositions,
  GetWorkingCenters,
  GetWorkingUnits,
};
