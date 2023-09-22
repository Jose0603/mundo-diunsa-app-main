import { HubConnection } from '@aspnet/signalr';

export interface SocketState {
  socket?: HubConnection;
  online: boolean;
}

export enum socketTypes {
  CONNECT = 'connect_socket',
  DISCONNECT = 'disconnect_socket',
}

const initalState: SocketState = {
  online: false,
  socket: undefined,
};

export const sockets = (state = initalState, action: any): SocketState => {
  switch (action.type) {
    case socketTypes.CONNECT: {
      return {
        online: action.online,
        socket: action.socket,
      };
    }
    case socketTypes.DISCONNECT: {
      return initalState;
    }
    default: {
      return state;
    }
  }
};
