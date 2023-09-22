import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ICoords {
  latitude: number;
  longitude: number;
}

const initialState: ICoords = {
  // poner por defecto coordenadas de SPS
  latitude: 15.505617,
  longitude: -88.025461,
};

const coordsSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    setCoords: (state, action: PayloadAction<ICoords>) => {
      state = action.payload;
    },
    setWeather: (state, action: PayloadAction<ICoords>) => {
      state = action.payload;
    },
  },
});

export const { setCoords } = coordsSlice.actions;

export default coordsSlice.reducer;
