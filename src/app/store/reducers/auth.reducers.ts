import { userLogin } from '../../models/userLogin';
import { AuthActionTypes, All } from '../actions/auth.actions';

export interface State {
  isAuthenticated: boolean;
  user: userLogin | null;
  errorMessage: string | null;
}

export const initialState: State = {
    isAuthenticated: false,
    user: null,
    errorMessage: null
  };

  export function reducer(state = initialState, action: All): State {
    switch (action.type) {
      case AuthActionTypes.LOGIN_SUCCESS: {
        return {
          ...state,
          isAuthenticated: true,
          user: {
            email: action.payload.email
          },
          errorMessage: null
        };
      }
      case AuthActionTypes.LOGIN_FAILURE: {
        return {
          ...state,
          errorMessage: 'Incorrect email and/or password.'
        };
      }
      default: {
        return state;
      }
    }
  }