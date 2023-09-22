import { socketTypes, SocketState } from '../../reducers/sockets/socketReducer';

export const connectSocket = (data: SocketState) => {
  return (dispatch: any) =>
    dispatch({
      type: socketTypes.CONNECT,
      online: data.online,
      socket: data.socket,
    });
};

export const disconnectSocket = () => {
  return (dispatch: any) =>
    dispatch({
      type: socketTypes.DISCONNECT,
    });
};
