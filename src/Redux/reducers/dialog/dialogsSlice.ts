import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface DialogState {
  isOpen: boolean;
  onPress: () => void;
}
const initialState: DialogState = {
  isOpen: false,
  onPress: () => {},
};
const dialogsSlice = createSlice({
  name: "Dialogs",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<DialogState>) => {
      state.isOpen = action.payload.isOpen;
      state.onPress = action.payload.onPress;
    },
    closeDialog: (state) => {
      state.isOpen = false;
    },
    openDialog: (state) => {
      state.isOpen = true;
    },
  },
});
export const { setMessage, closeDialog, openDialog } = dialogsSlice.actions;
export default dialogsSlice.reducer;
