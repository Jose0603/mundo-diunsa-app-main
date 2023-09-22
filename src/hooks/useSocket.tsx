import { useCallback, useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@aspnet/signalr';
import { useSelector } from 'react-redux';
import { AuthState } from '../Redux/reducers/auth/loginReducer';

export const useSocket = (serverPath: string = '/tickethub') => {
  const [socket, setSocket] = useState<HubConnection>();
  const [online, setOnline] = useState(false);

  const user: AuthState = useSelector((state: any) => state.auth.login);

  const desconectarSocket = useCallback(() => {
    socket?.stop();
  }, [socket]);

  const conectarSocket = useCallback(() => {
    if (user.isLoggedIn) {
      const connection = new HubConnectionBuilder()
        .withUrl(`http://192.168.1.81:5006${serverPath}`, {
          accessTokenFactory: () => user.token,
        })
        .configureLogging(LogLevel.Error)
        .build();

      setSocket(connection);

      connection?.start().then((a: any) => {
        setOnline(true);
        console.log('Connected');
      });
    }
  }, [user.isLoggedIn]);

  return {
    socket,
    online,
    conectarSocket,
    desconectarSocket,
  };
};
