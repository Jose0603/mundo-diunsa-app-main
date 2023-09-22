import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from '../../../interfaces/INotification';
import { INewsCategory } from '../../../interfaces/rrhh/INews';

interface NotificationsState {
  notifications: INotification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'Notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications.push(action.payload);
    },
    updateNotification: (state, action: PayloadAction<INotification>) => {
      let itemIndex = state.notifications.findIndex((item) => item.id === action.payload.id);
      if (itemIndex !== -1) state.notifications[itemIndex] = action.payload;
    },
    deleteNotification: (state, action: PayloadAction<number>) => {
      const newArray = state.notifications.filter((item) => item.id !== action.payload);
      state.notifications = newArray;
    },
    deleteAllNotifications: (state, action: PayloadAction<null>) => {
      state.notifications = [];
    },
  },
});

export const { setNotifications, addNotification, updateNotification, deleteNotification, deleteAllNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
