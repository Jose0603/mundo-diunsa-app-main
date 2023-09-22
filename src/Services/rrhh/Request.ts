import {
  IPermissionDetail,
  IRequestCupon,
} from "../../interfaces/rrhh/IRequestCupon";
import {ISelect} from "../../interfaces/rrhh/ISelect";
import API from "../../Axios";
import {IResponseModel} from "../../interfaces/IResponseModel";
import {
  IRecordDetail,
  IRequestConstancia,
  RangeDate,
} from "../../interfaces/rrhh/IRequestConstancia";
import {
  IRequestFreetimeCupon,
  ICouponCount,
  ICouponEnjoyedDays,
  IFreeTimeCouponDetail,
} from "../../interfaces/rrhh/IRequestFreetimeCupon";
import {IRequestParams} from "../../interfaces/IParams";
import {IRequestDetail} from "../../interfaces/rrhh/IRequestDetail";
import {PagedData} from "../../interfaces/IIncident";
import {
  IRequestData,
  IRequestStatus,
} from "../../interfaces/rrhh/IRequestStatus";
import {IRequestPendingApproval} from "../../interfaces/rrhh/IRequestPendingApproval";
import {IExtraHourDetail} from "../../interfaces/rrhh/IExtraHourDetail";
import {IVacationDetail} from "../../interfaces/rrhh/IRequestVacation";
import {ITimeNotWorkedDetail} from "../../interfaces/rrhh/ITimeNotWorked";
import {
  ISavingNewPositionRequisition,
  ISavingSubstitutionRequisition,
  ISavingVacancyRequisition,
  ISubordinatePosition,
  IVacancy,
} from "../../interfaces/rrhh/IRequisition";
import {IRequisitionDetail} from "../../interfaces/rrhh/IRequestRequisition";

export const SaveRequestConstancia = async (values: IRequestConstancia) => {
  const {data} = await API.post<IResponseModel[]>(
    `/Requests/SaveRequestConstancia`,
    values
  );
  return data;
};

export const GetTntTiposTiempoNoTrabajado = async () => {
  const {data} = await API.get<ISelect[]>(
    `/Requests/GetTntTiposTiempoNoTrabajado`
  );
  return data;
};

export const SaveRequestCupon = async (values: IRequestCupon) => {
  const {data} = await API.post<IResponseModel[]>(
    `/Requests/SaveRequestCupon`,
    values
  );
  return data;
};

export const GetBusinessDays = async (req: RangeDate) => {
  const {data} = await API.post<IResponseModel>(
    `/Requests/GetBusinessDays`,
    req
  );
  return data;
};

export const GetGeneralParam = async (CodPar: string) => {
  const {data} = await API.get<boolean>(
    `/Requests/GetGeneralParam?CodPar=${CodPar}`
  );
  return data;
};

export const SaveRequestFreetimeCupon = async (
  values: IRequestFreetimeCupon
) => {
  const {data} = await API.post<IResponseModel[]>(
    `/Requests/SaveRequestFreeTimeCoupon`,
    values
  );
  return data;
};

export const GetCouponCount = async () => {
  const {data} = await API.get<ICouponCount>(`/Requests/GetCouponCount`);
  return data;
};

export const GetCouponEnjoyedDays = async () => {
  const {data} = await API.get<ICouponEnjoyedDays[]>(
    `/Requests/GetCouponEnjoyedDays`
  );
  return data;
};
export const GetAllRequestsByUser = async (params: IRequestParams) => {
  const {data} = await API.get<PagedData<IRequestDetail>>(
    `/Requests/GetAllRequestsByUser?Page=${params.Page}&Limit=${params.Limit}&StartDate=${params.StartDate}&EndDate=${params.EndDate}&Status=${params.Status}`
  );

  return data;
};

export const GetRequestStatuses = async () => {
  const {data} = await API.get<IRequestStatus[]>(`/Requests/GetStatus`);

  return data;
};
export const GetRequestsPendingApproval = async () => {
  const {data} = await API.get<IRequestPendingApproval[]>(
    `/Requests/GetRequestsPendingApprovalByUser`
  );

  return data;
};

export const GetRecordRequestDetail = async (codigoEntidad: number) => {
  const {data} = await API.get<IRecordDetail>(
    `/Requests/GetRecordRequestDetail?codigoEntidad=${codigoEntidad}`
  );

  return data;
};

export const GetVacationRequestDetail = async (codigoEntidad: number) => {
  const {data} = await API.get<IVacationDetail>(
    `/Requests/GetVacationsRequestDetail?codigoEntidad=${codigoEntidad}`
  );

  return data;
};

export const GetExtraHourDetail = async (codigoEntidad: number) => {
  const {data} = await API.get<IExtraHourDetail>(
    `/Requests/GetExtraHourRequestDetail?codigoEntidad=${codigoEntidad}`
  );

  return data;
};

export const GetTimeNotWorkedDetail = async (codigoEntidad: number) => {
  const {data} = await API.get<ITimeNotWorkedDetail>(
    `/Requests/GetTimesNotWorkedRequestDetail?codigoEntidad=${codigoEntidad}`
  );

  return data;
};

export const GetPermissionDetail = async (codigoEntidad: number) => {
  const {data} = await API.get<IPermissionDetail>(
    `/Requests/GetPermisionRequestDetail?codigoEntidad=${codigoEntidad}`
  );

  return data;
};

export const GetFreeTimeCouponDetail = async (codigoEntidad: number) => {
  const {data} = await API.get<IFreeTimeCouponDetail>(
    `/Requests/GetFreeTimeCouponRequestDetail?codigoEntidad=${codigoEntidad}`
  );

  return data;
};

export const GetRequisitionRequestDetail = async (codigoEntidad: number) => {
  const {data} = await API.get<IRequisitionDetail>(
    `/Requests/GetRequisitionRequestDetail?codigoEntidad=${codigoEntidad}`
  );

  return data;
};

export const ApproveRequest = async (iraCodigo: string, comentario: string) => {
  const {data} = await API.get<IResponseModel>(
    `/Requests/AuthorizeRequest?iraCodigo=${iraCodigo}&comentario=${comentario}`
  );

  return data;
};

export const DenyRequest = async (iraCodigo: string, comentario: string) => {
  const {data} = await API.get<IResponseModel>(
    `/Requests/DenyRequest?iraCodigo=${iraCodigo}&comentario=${comentario}`
  );

  return data;
};

export const RequestData = async (id: number, peticion: string) => {
  const {data} = await API.get<IRequestData[]>(
    `Requests/GetRequestData?id=${id}&peticion=${peticion}`
  );

  return data;
};
export const RequestDataContest = async (id: number, peticion: string) => {
  const {data} = await API.get<string>(
    `Requests/GetRequestContest?id=${id}&peticion=${peticion}`
  );

  return data;
};
export const SaveRequisition = async (
  values:
    | ISavingNewPositionRequisition
    | ISavingSubstitutionRequisition
    | ISavingVacancyRequisition
) => {
  const {data} = await API.post<IResponseModel>(
    `/Requests/SaveRequestRequisition`,
    values
  );
  return data;
};

export const GetSubordinates = async () => {
  const {data} = await API.get<ISubordinatePosition[]>(
    `Requests/GetSubordinates`
  );

  return data;
};

export const GetVacancies = async () => {
  const {data} = await API.get<IVacancy[]>(`Requests/GetVacancies`);

  return data;
};
