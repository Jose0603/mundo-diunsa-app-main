import { IMessage, MessageDTO } from '../../../interfaces/IChat';
import { Message } from '../../../Screens/chat/extra/data';
import { chatTypes } from '../../reducers/chats/chatReducer';

export const saveMessages = (data: Message[]) => {
  return (dispatch: any) =>
    dispatch({
      type: chatTypes.NEW_MESSAGE,
      message: data,
    });
};

export const sendMessage = (data: MessageDTO) => {
  return (dispatch: any) =>
    dispatch({
      type: chatTypes.SEND_MESSAGE,
      message: data,
    });
};
