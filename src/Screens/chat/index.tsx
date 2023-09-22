import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, StyleService, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import moment from 'moment';
import { ArrowBackIcon, Box, Pressable, Text } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { ImageSourcePropType, Keyboard, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { Loading } from '../../Components/Loading';
import { NoData } from '../../Components/NoData';
import { QueryKeys } from '../../Helpers/QueryKeys';
import { ScreenNames } from '../../Helpers/ScreenNames';
import { useSocket } from '../../hooks/useSocket';
import { IMessage } from '../../interfaces/IChat';
import { saveMessages, sendMessage } from '../../Redux/actions/chats/chatActions';
import { AuthState } from '../../Redux/reducers/auth/loginReducer';
import { SocketState } from '../../Redux/reducers/sockets/socketReducer';
import { GetChatHistory } from '../../Services/incidents/Chat';
import { AttachmentsMenu } from './extra/attachments-menu.component';
import { Chat } from './extra/chat.component';
import { Message } from './extra/data';
import { MicIcon, PaperPlaneIcon, PlusIcon } from './extra/icons';
import { KeyboardAvoidingView } from './extra/keyboard-avoiding-view.component';

const galleryAttachments: ImageSourcePropType[] = [
  require('./assets/image-attachment-1.png'),
  require('./assets/image-attachment-2.jpg'),
  require('./assets/image-attachment-1.png'),
  require('./assets/image-attachment-2.jpg'),
];

const keyboardOffset = (height: number): number =>
  Platform.select({
    android: 0,
    ios: height,
  }) || 0;

interface IProps extends NativeStackScreenProps<any, any> {}
interface IFBSavingMessage {
  createdAt: Date;
  createdBy: string;
  message: string;
}

export default ({ navigation, route }: IProps): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const insets = useSafeAreaInsets();
  const user: AuthState = useSelector((state: any) => state.auth.login);
  const sockets: SocketState = useSelector((state: any) => state.socket.sockets);
  // const messages: Message[] = useSelector((state: any) => state.chats.chat);
  const { ticketId } = route?.params?.ticketId && route.params;
  // const [messages, setMessages] = useState<Message[]>();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState([]);
  const [attachmentsMenuVisible, setAttachmentsMenuVisible] = useState<boolean>(false);
  // const [ticketId, setTicketId] = useState<number>(route.params?.ticketId ?? 0);
  const [tUuid, setTUuid] = useState<string>(route.params?.tUuid ?? '');

  function saveMessage(ticketId: string, data: IFBSavingMessage) {
    const db = getDatabase();
    const reference = ref(db, `/chat/tickets/${ticketId}/messages/`);
    push(reference, data);
  }

  useEffect(() => {
    const db = getDatabase();
    const reference = ref(db, `/chat/tickets/${`TKT-${ticketId.toString().padStart(7, '0')}`}/messages/`);
    onValue(reference, (snapshot) => {
      // const highscore = snapshot.val().highscore;
      let processedMessages = [];

      for (const msgId in snapshot.val()) {
        if (Object.prototype.hasOwnProperty.call(snapshot.val(), msgId)) {
          const receivedMsg: IFBSavingMessage = snapshot.val()[msgId];

          const isSender = receivedMsg.createdBy === user.employeeId;
          const newMsg = new Message(
            msgId,
            receivedMsg.message,
            moment(receivedMsg.createdAt).format('DD/MM hh:mm a'),
            isSender,
            null
          );
          processedMessages.push(newMsg);
        }
      }

      if (processedMessages) setMessages([...processedMessages]);
    });
  }, [ticketId]);

  // if (route && route.params) {
  //   if (route.params.ticketId) {
  //     setTicketId(route.params.ticketId);
  //   }
  //   if (route.params.tUuid) {
  //     setTUuid(route.params.tUuid);
  //   }
  // }

  // const { data: incident } = useQuery([QueryKeys.SINGLE_INCIDENT, route.params?.ticketId], () =>
  //   GetIncident(route.params?.ticketId)
  // );

  const dispatch = useDispatch();

  const {
    isLoading,
    isError,
    data: chatHistory,
    error,
  } = useQuery([QueryKeys.CHAT, ticketId], () => GetChatHistory(ticketId));

  // useEffect(() => {
  //   conectarSocket();
  // }, []);

  // useEffect(() => {
  //   socket?.on('TKT-0000077', (res: IMessage) => {
  //     if (res && messages) {
  //       // setMessages([
  //       //   ...messages,
  //       //   new Message(
  //       //     res.id,
  //       //     res.message,
  //       //     moment(res.createdAt).format('DD/MM hh:mm'),
  //       //     user.employeeId === res.createdBy,
  //       //     null
  //       //   ),
  //       // ]);
  //       setMessages((prev) => [
  //         ...prev,
  //         new Message(
  //           res.id,
  //           res.message,
  //           moment(res.createdAt).format('DD/MM hh:mm'),
  //           user.employeeId === res.createdBy,
  //           null
  //         ),
  //       ]);

  //       console.log('Recibido desde ticket number ', res);
  //     } else if (res) {
  //       // setMessages([
  //       //   new Message(
  //       //     res.id,
  //       //     res.message,
  //       //     moment(res.createdAt).format('DD/MM hh:mm'),
  //       //     user.employeeId === res.createdBy,
  //       //     null
  //       //   ),
  //       // ]);
  //     }
  //     // setMessages([...messages, new Message(res.message, 'now', true, null)]);
  //   });
  // }, [socket]);

  // useEffect(() => {
  //   const processedMessages = chatHistory?.map((el) => {
  //     return new Message(el.id, el.message, moment(el.createdAt).format('DD/MM hh:mm'), el.isSender, null);
  //   });
  //   // setMessages(processedMessages);
  //   if (processedMessages) dispatch(saveMessages(processedMessages));
  // }, [chatHistory]);

  const sendButtonEnabled = (): boolean => {
    return message && message.trim().length > 0;
  };

  const toggleAttachmentsMenu = (): void => {
    setAttachmentsMenuVisible(!attachmentsMenuVisible);
  };

  const onSendButtonPress = (): void => {
    // setMessages([...messages, new Message(message, 'now', true, null)]);

    const sendingMessage: any = {
      message: message.trim(),
      createdAt: moment().toString(),
      createdBy: user.employeeId,
      senderName: user.username ?? 'Usuario',
    };

    saveMessage(`TKT-${ticketId.toString().padStart(7, '0')}`, sendingMessage);

    // dispatch(sendMessage({ message: message.trim(), userId: user.employeeId, ticketId }));

    // sockets.socket
    //   ?.invoke('SendMessage', `TKT-${ticketId.toString().padStart(7, '0')}`, {
    //     message: message.trim(),
    //     userId: user.employeeId,
    //     ticketId: route.params?.ticketId,
    //   })
    //   ?.then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
    setMessage('');
    Keyboard.dismiss();
  };

  const renderAttachmentsMenu = (): React.ReactElement => (
    <AttachmentsMenu
      attachments={galleryAttachments}
      onSelectPhoto={toggleAttachmentsMenu}
      onSelectFile={toggleAttachmentsMenu}
      onSelectLocation={toggleAttachmentsMenu}
      onSelectContact={toggleAttachmentsMenu}
      onAttachmentSelect={toggleAttachmentsMenu}
      onCameraPress={toggleAttachmentsMenu}
      onDismiss={toggleAttachmentsMenu}
    />
  );

  const RenderRightActions = () => (
    <>
      <Pressable onPress={async () => {}}>
        <Box flexDirection="row" alignItems="center"></Box>
      </Pressable>
    </>
  );

  const RenderLeftActions = () => (
    <TopNavigationAction
      icon={<ArrowBackIcon size="4" />}
      onPress={() => navigation.navigate(ScreenNames.DETAIL_INCIDENT, { ticketId })}
    />
  );

  // if (isError) {
  //   return (
  //     <View style={styles.list}>
  //       <NoData />
  //     </View>
  //   );
  // }

  // if (isLoading) {
  //   return (
  //     <View style={styles.list}>
  //       <Loading message="Cargando Mensajes..." />
  //     </View>
  //   );
  // }

  return (
    <View style={[{ paddingTop: insets.top, flex: 1, backgroundColor: '#fff' }]}>
      <TopNavigation
        alignment="center"
        title="Conversación"
        subtitle={`TKT-${ticketId.toString().padStart(7, '0')}`}
        accessoryLeft={<RenderLeftActions />}
        accessoryRight={<RenderRightActions />}
      />

      {messages && messages.length > 0 ? (
        <Chat style={styles.list} contentContainerStyle={styles.listContent} followEnd={true} data={messages} />
      ) : isLoading ? (
        <View style={styles.list}>
          <Loading message="Cargando Mensajes..." />
        </View>
      ) : (
        <View style={styles.list}>
          <NoData message="No se ha iniciado un chat" />
        </View>
      )}
      <KeyboardAvoidingView style={styles.messageInputContainer} offset={keyboardOffset}>
        {/* <Button
          style={[styles.iconButton, styles.attachButton]}
          accessoryLeft={<PlusIcon />}
          onPress={toggleAttachmentsMenu}
        /> */}
        <Input
          style={styles.messageInput}
          placeholder="Mensaje..."
          value={message}
          onChangeText={setMessage}
          // accessoryRight={MicIcon}
        />
        <Button
          appearance="ghost"
          style={[styles.iconButton, styles.sendButton]}
          accessoryLeft={<PaperPlaneIcon />}
          disabled={!sendButtonEnabled()}
          onPress={onSendButtonPress}
        />
      </KeyboardAvoidingView>
      {attachmentsMenuVisible && renderAttachmentsMenu()}
    </View>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  messageInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: 'background-basic-color-1',
  },
  attachButton: {
    borderRadius: 24,
    marginHorizontal: 8,
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  sendButton: {
    marginRight: 4,
  },
  iconButton: {
    width: 24,
    height: 24,
  },
});
