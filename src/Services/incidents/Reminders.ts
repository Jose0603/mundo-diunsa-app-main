import API from '../../Axios';
import { IReminder } from '../../interfaces/IIncident';

export const ReminderService = async () => {
  const { data } = await API.get<IReminder[]>('/Reminder/getall');
  return data;
};