import { IMarking, IMarkingReq } from '../../interfaces/rrhh/IMarking';
import API from '../../Axios';

export const GetMarkingsByDate = async (req: IMarkingReq) => {
  const { data } = await API.post<IMarking[]>('/User/Markings/ByDate', req);
  return data;
};
