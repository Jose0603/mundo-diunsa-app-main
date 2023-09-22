import { combineReducers } from 'redux';

import auth from './auth/';
import coordsSlice from './auth/coordsSlice';
import profileSlice from './auth/profileSlice';
import chats from './chats';
import clinicAppointmentsSlice from './clinic/clinicAppointmentsSlice';
import dialogsSlice from './dialog/dialogsSlice';
import newsCategorySlice from './news/categoriesSlice';
import notificationsSlice from './notifications/notificationsSlice';
import expedienteSlice from './rrhh/expedienteSlice';
import requisitionSlice from './rrhh/requisitionSlice';
import socket from './sockets';
import couponSlice from './store/couponSlice';
import storeSlice from './store/storeSlice';

const rootReducer = combineReducers({
  auth,
  socket,
  chats,
  newsCategory: newsCategorySlice,
  notifications: notificationsSlice,
  profile: profileSlice,
  coords: coordsSlice,
  store: storeSlice,
  couponExchange: couponSlice,
  clinicAppointments: clinicAppointmentsSlice,
  expediente: expedienteSlice,
  dialogs: dialogsSlice,
  requisition: requisitionSlice,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
