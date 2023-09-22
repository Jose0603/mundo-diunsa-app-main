import API from '../../Axios';
import { IMessage } from '../../interfaces/IChat';

export const GetChatHistory = async (ticketId: number) => {
  const { data } = await API.get<IMessage[]>(`/Chat/getByTicketId?ticketId=${ticketId}`);
  return data;
};
