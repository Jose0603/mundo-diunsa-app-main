import { AuthState, loginTypes } from '../../reducers/auth/loginReducer';

export const changeRole = (role: any) => {
  return (dispatch: any) => dispatch({ type: 'CHANGE_ROLE', userRole: role });
};

export const ChangeUserData = (data: AuthState) => {
  return (dispatch: any) =>
    dispatch({
      type: loginTypes.CHANGE_DATA,
      permissions: data.permissions,
      isLoggedIn: data.isLoggedIn,
      employeeId: data.employeeId,
      username: data.username,
      name: data.name,
      email: data.email,
      token: data.token,
      profile: data.profile,
      employeePosition: data.employeePosition,
      __jsogObjectId: '1',
      acceptedTerms: data.acceptedTerms,
      picture: data.picture,
    });
};

export const ResetUserData = () => {
  return (dispatch: any) =>
    dispatch({
      type: loginTypes.RESET_DATA,
    });
};

export const AcceptTerms = () => {
  return (dispatch: any) =>
    dispatch({
      type: loginTypes.ACCEPT_TERMS,
    });
};
