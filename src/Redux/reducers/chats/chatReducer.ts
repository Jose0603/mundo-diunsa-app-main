import { IMessage } from '../../../interfaces/IChat';
import { Message } from '../../../Screens/chat/extra/data';

export enum chatTypes {
  NEW_MESSAGE = '[chat] new message',
  SEND_MESSAGE = '[chat] send message',
}

const initialMessages: Message[] = [];

export const chat = (state = initialMessages, action: any): Message[] => {
  switch (action.type) {
    case chatTypes.NEW_MESSAGE: {
      return [...action.message];
    }
    default: {
      return state;
    }
  }
};
