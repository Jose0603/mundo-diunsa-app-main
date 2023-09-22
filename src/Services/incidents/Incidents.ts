import API from '../../Axios';
import { IIncident, IResponseTicket, ISavingIncident, ISavingSolution, ITicketSummary, PagedData } from '../../interfaces/IIncident';
import { IIncidentParams } from '../../interfaces/IParams';
import { IResponseModel } from '../../interfaces/IResponseModel';
import { FILTERDATE } from '../../Screens/Incidents/DashboardScreen';

export const SaveIncident = async (values: ISavingIncident) => {
  const { data } = await API.post<IResponseModel>('/Ticket/save', values);
  return data;
};

export const GetIncidents = async ({ Page = 1, Status = -1, Limit = 12, SubCategory = -1 }: IIncidentParams) => {
  const { data } = await API.get<PagedData<IIncident>>(
    `/Ticket/getall?Page=${Page}&Status=${Status}&Limit=${Limit}&SubCategory=${SubCategory}`
  );
  return data;
};

export const GetIncident = async (ticketId: number) => {
  const { data } = await API.get<IIncident>(`/Ticket/${ticketId}`);
  return data;
};

export const AcceptOrDecline = async (ticketResponse: IResponseTicket) => {
  const { data } = await API.post<IResponseModel>('/Ticket/AcceptOrDecline', ticketResponse);
  return data;
};

export const MarkAsEnded = async (ticketId: number) => {
  const { data } = await API.post<IResponseModel>(`/Ticket/finish/${ticketId}`);
  return data;
};

export const DashboardData = async (selectedDate: FILTERDATE) => {
  const { data } = await API.get<ITicketSummary>(`/Ticket/Summary?SelectedDate=${selectedDate}`);
  return data;
};

export const SaveSolution = async (solution: ISavingSolution) => {
  const { data } = await API.post<IResponseModel>('/Solution/save', solution);
  return data;
};
// export const DashboardData = async ({ StartDate = '', EndDate = '' }: ITimeParams) => {
//   const { data } = await API.get<ITicketSummary>(`/Ticket/Summary?StartDate=${StartDate}&EndDate=${EndDate}`);
//   return data;
// };
