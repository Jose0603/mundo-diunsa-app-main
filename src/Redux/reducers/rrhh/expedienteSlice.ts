import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  change: false,
};

const expedienteSlice = createSlice({
  name: "Expediente",
  initialState,
  reducers: {
    setChange: (state, action: PayloadAction<boolean>) => {
      state.change = action.payload;
    },
  },
});

export const { setChange } = expedienteSlice.actions;

export default expedienteSlice.reducer;
