export interface ISavingToken {
  token: string;
  userId: string;
}
export interface IResetPassword {
  idHash: string;
  password: string;
  confirmPassword: string;
}
export interface IRegister {
  name: string;
  email: string;
}
