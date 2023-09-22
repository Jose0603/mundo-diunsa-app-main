import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IExtraData, IProfile} from "../../../interfaces/rrhh/IProfile";

const initialState: IProfile = {
  points: 0,
  isVolunteer: false,
  gender: "",
  birthday: "",
  antiquity: 0,
  isTemporary: false,
};

const profileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<number>) => {
      state.points = action.payload;
    },
    subStractPoints: (state, action: PayloadAction<number>) => {
      state.points -= action.payload;
    },
    setExtraData: (state, action: PayloadAction<IExtraData>) => {
      state.antiquity = action.payload.antiquity;
      state.birthday = action.payload.birthday;
      state.gender = action.payload.gender;
      state.isVolunteer = action.payload.isVolunteer;
      state.isTemporary = action.payload.isTemporary;
    },
    resetExtraData: (state) => {
      state.antiquity = initialState.antiquity;
      state.birthday = initialState.birthday;
      state.gender = initialState.gender;
      state.isVolunteer = initialState.isVolunteer;
      state.isTemporary = initialState.isTemporary;
    },
  },
});

export const {setProfile, subStractPoints, setExtraData, resetExtraData} =
  profileSlice.actions;

export default profileSlice.reducer;
