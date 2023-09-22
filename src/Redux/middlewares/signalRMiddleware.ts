// import { JsonHubProtocol, HttpTransportType, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import moment from 'moment';

import { IMessage } from '../../interfaces/IChat';
import { Message } from '../../Screens/chat/extra/data';
import chatActions from '../actions/chats';
import socketActions from '../actions/socket';
import { loginTypes } from '../reducers/auth/loginReducer';
import { chatTypes } from '../reducers/chats/chatReducer';

const signalRMiddleware = (store: any) => (next: any) => async (action: any) => {
  const onNotifReceived = (res: any) => {
    console.log('****** NOTIFICATION ******', res);
  };

  const onNewChatMessage = (res: IMessage) => {
    console.log('****** huuyyg ******', res);
    store.dispatch(
      chatActions.saveMessages([
        new Message(
          res.id,
          res.message,
          moment(res.createdAt).format('DD/MM hh:mm'),
          store.getState().auth.login.employeeId == res.createdBy,
          null
        ),
      ])
    );
  };

  const connectionHub = `https://192.168.18.18:5007/tickethub`;

  // const protocol = new JsonHubProtocol();

  // // let transport to fall back to to LongPolling if it needs to
  // const transport = HttpTransportType.WebSockets | HttpTransportType.LongPolling;

  // const options = {
  //   transport,
  //   logMessageContent: true,
  //   logger: LogLevel.Debug,
  //   accessTokenFactory: () => action.token,
  // };

  // // create the connection instance
  // const connection = new HubConnectionBuilder().withUrl(connectionHub, options).withHubProtocol(protocol).build();

  // register signalR after the user logged in
  // if (action.type === loginTypes.CHANGE_DATA) {
  //   // event handlers, you can use these to dispatch actions to update your Redux store
  //   connection.on('OperationProgress', onNotifReceived);
  //   connection.on('UploadProgress', onNotifReceived);
  //   connection.on('DownloadProgress', onNotifReceived);
  //   connection.on('chat', onNewChatMessage);

  //   // re-establish the connection if connection dropped
  //   connection.onclose(() =>
  //     setTimeout(() => {
  //       connection
  //         .start()
  //         .then(() => {
  //           store.dispatch(socketActions.connectSocket({ online: true, socket: connection }));
  //           console.info('SignalR Connected');
  //         })
  //         .catch((err: any) => console.error('SignalR Connection Error: ', err));
  //     }, 5000)
  //   );

  //   //  startSignalRConnection(connection);
  //   connection
  //     .start()
  //     .then(() => {
  //       store.dispatch(socketActions.connectSocket({ online: true, socket: connection }));
  //       console.info('SignalR Connected');
  //     })
  //     .catch((err: any) => console.error('SignalR Connection Error: ', err));
  // } else if (action.type === chatTypes.SEND_MESSAGE) {
  //   // TODO: hacer un invoke a la funcion para distribuir el mensaje
  //   if (connection) console.log('andsabhduiashudiashudi', action);
  //   connection.send('SendMessage', action.message);
  // }

  return next(action);
};

export default signalRMiddleware;
