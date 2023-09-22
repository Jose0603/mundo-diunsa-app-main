import API from '../../Axios';
import { ISurvey } from '../../interfaces/IIncident';

export const SurveyService = async () => {
  const { data } = await API.get<ISurvey[]>('/Survey/getall');
  return data;
};