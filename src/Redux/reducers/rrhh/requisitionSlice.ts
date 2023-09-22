import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ISubordinatePosition, IVacancy } from '../../../interfaces/rrhh/IRequisition';

interface IState {
  allPositions: ISubordinatePosition[];
  selectedPositions: ISubordinatePosition[];
  allVacancies: IVacancy[];
  selectedVacancies: IVacancy[];
}

const initialState: IState = {
  allPositions: [],
  selectedPositions: [],
  allVacancies: [],
  selectedVacancies: [],
};

function operateQtyToMainlist(state, codPlaza: number, qty: number, operation: string = 'add') {
  const foundReturningIdx = state.allVacancies.findIndex((e: IVacancy) => e.codPlaza === codPlaza);
  if (foundReturningIdx !== -1) {
    const allCopy = [...state.allVacancies];
    if (operation === 'add') {
      allCopy[foundReturningIdx].numPlazas = allCopy[foundReturningIdx].numPlazas + 1;
    } else {
      allCopy[foundReturningIdx].numPlazas = allCopy[foundReturningIdx].numPlazas - 1;
    }
    state.allVacancies = [...allCopy];
  }
}
function operateQtyToSelectedList(state, codPlaza: number, qty: number, operation: string = 'add') {
  const foundIdx = state.selectedVacancies.findIndex((e: IVacancy) => e.codPlaza === codPlaza);
  if (foundIdx !== -1) {
    const copy = [...state.selectedVacancies];
    if (operation === 'add') {
      copy[foundIdx].numPlazas = copy[foundIdx].numPlazas + 1;
      copy[foundIdx].disponibles = copy[foundIdx].disponibles - 1;
    } else {
      copy[foundIdx].numPlazas = copy[foundIdx].numPlazas - 1;
      copy[foundIdx].disponibles = copy[foundIdx].disponibles + 1;
    }
    state.selectedVacancies = [...copy];
  }
}

const requisitionSlice = createSlice({
  name: 'Requisition',
  initialState,
  reducers: {
    setAllPositions: (state, action: PayloadAction<ISubordinatePosition[]>) => {
      state.allPositions = action.payload;
    },
    addSelected: (state, action: PayloadAction<ISubordinatePosition>) => {
      state.selectedPositions = [action.payload, ...state.selectedPositions];
    },
    removeSelected: (state, action: PayloadAction<ISubordinatePosition>) => {
      const foundIdx = state.selectedPositions.findIndex(
        (e) => e.codigoAlternativo === action.payload.codigoAlternativo
      );
      if (foundIdx !== -1) {
        const copy = [...state.selectedPositions];
        copy.splice(foundIdx, 1);
        state.selectedPositions = [...copy];
      }
    },
    resetValues: (state) => {
      state.selectedPositions = [];
      state.allPositions = [];
      state.allPositions = [];
      state.selectedVacancies = [];
    },
    setAllVacancies: (state, action: PayloadAction<IVacancy[]>) => {
      state.allVacancies = action.payload;
    },
    addSelectedVacancy: (state, action: PayloadAction<IVacancy>) => {
      state.selectedVacancies = [
        { ...action.payload, numPlazas: 1, disponibles: action.payload.disponibles - 1 },
        ...state.selectedVacancies,
      ];
      operateQtyToMainlist(state, action.payload.codPlaza, 1, 'add');
    },
    removeSelectedVacancy: (state, action: PayloadAction<IVacancy>) => {
      const foundIdx = state.selectedVacancies.findIndex((e) => e.codPlaza === action.payload.codPlaza);
      const found = state.selectedVacancies.find((e) => e.codPlaza === action.payload.codPlaza);

      if (foundIdx !== -1) {
        const copy = [...state.selectedVacancies];
        copy.splice(foundIdx, 1);
        state.selectedVacancies = [...copy];
      }
      operateQtyToMainlist(state, action.payload.codPlaza, found.numPlazas, 'add');
    },
    addQtyToPosition: (state, action: PayloadAction<{ codPlaza: number; numPlazas: number }>) => {
      const found = state.selectedVacancies.find((e) => e.codPlaza === action.payload.codPlaza);
      operateQtyToSelectedList(state, action.payload.codPlaza, found.numPlazas, 'add');
      operateQtyToMainlist(state, action.payload.codPlaza, action.payload.numPlazas, 'minus');
    },
    substractQtyToPosition: (state, action: PayloadAction<{ codPlaza: number; numPlazas: number }>) => {
      const found = state.selectedVacancies.find((e) => e.codPlaza === action.payload.codPlaza);
      operateQtyToSelectedList(state, action.payload.codPlaza, found.numPlazas, 'minus');
      operateQtyToMainlist(state, action.payload.codPlaza, action.payload.numPlazas, 'add');
    },
  },
});

export const {
  setAllPositions,
  addSelected,
  removeSelected,
  removeSelectedVacancy,
  resetValues,
  setAllVacancies,
  addSelectedVacancy,
  substractQtyToPosition,
  addQtyToPosition,
} = requisitionSlice.actions;

export default requisitionSlice.reducer;
