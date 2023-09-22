import { AppPermissions } from '../../../Helpers/AppPermissions';

export interface AuthState {
  permissions: string[];
  isLoggedIn: boolean;
  employeeId: string;
  username: string;
  name: string;
  email: string;
  token: string;
  profile: string;
  employeePosition: string;
  acceptedTerms: boolean;
  __jsogObjectId: string;
  picture: string;
}

export enum loginTypes {
  CHANGE_DATA = 'CHANGE_USER_DATA',
  RESET_DATA = 'RESET_USER_DATA',
  ACCEPT_TERMS = 'ACCEPT_TERMS',
}

const initalState: AuthState = {
  __jsogObjectId: '',
  permissions: [],
  isLoggedIn: false,
  employeeId: '',
  username: '',
  name: '',
  email: '',
  token: '',
  profile: '',
  employeePosition: '',
  acceptedTerms: false,
  picture: '',
};

export const login = (state = initalState, action: any): AuthState => {
  switch (action.type) {
    case loginTypes.CHANGE_DATA: {
      return {
        permissions: action.permissions,
        isLoggedIn: action.isLoggedIn,
        employeeId: action.employeeId,
        username: action.username,
        name: action.name,
        email: action.email,
        token: action.token,
        profile: action.profile,
        employeePosition: action.employeePosition,
        __jsogObjectId: action.__jsogObjectId,
        acceptedTerms: action.acceptedTerms,
        picture: action.picture,
      };
    }
    case loginTypes.RESET_DATA: {
      return { ...initalState };
    }
    case loginTypes.ACCEPT_TERMS: {
      return { ...state, acceptedTerms: true };
    }
    default: {
      return state;
    }
  }
};
