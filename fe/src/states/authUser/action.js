
import authApi from '../../api/auth';
import userApi from '../../api/user';
import { putAccessToken } from '../../utils/local-storage';

export const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
};

export function setAuthUserActionCreator(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: {
      authUser,
    },
  };
}

export function unsetAuthUserActionCreator() {
  return {
    type: ActionType.UNSET_AUTH_USER,
  };
}

export function asyncSetAuthUser({ username, password }) {
  return async (dispatch) => {
    await authApi.login({ username, password });
    const authUser = await userApi.getSelf();
    dispatch(setAuthUserActionCreator(authUser));
    return authUser;
  };
}

export function asyncUnsetAuthUser() {
  return async(dispatch) => {
    await authApi.logout();
    putAccessToken('');
    dispatch(unsetAuthUserActionCreator());
  };
}
