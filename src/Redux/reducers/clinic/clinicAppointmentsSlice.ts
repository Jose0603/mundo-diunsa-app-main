import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IClinicAppointment, IGroupedClinicAppointment } from '../../../interfaces/rrhh/IClinic';

interface ClinicAppointmentsState {
  appointments: IGroupedClinicAppointment[] | undefined;
}

const initialState: ClinicAppointmentsState = {
  appointments: undefined,
};

const clinicAppointmentsSlice = createSlice({
  name: 'ClinicAppointments',
  initialState,
  reducers: {
    setClinicAppointments: (state, action: PayloadAction<IGroupedClinicAppointment[]>) => {
      state.appointments = action.payload;
    },
  },
});

export const { setClinicAppointments } = clinicAppointmentsSlice.actions;

export default clinicAppointmentsSlice.reducer;
