export interface IProfile extends IExtraData {
  points: number;
}

export interface IExtraData {
  gender: string;
  birthday: string;
  antiquity: number;
  isVolunteer: boolean;
  isTemporary: boolean;
}
