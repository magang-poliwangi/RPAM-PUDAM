import userApi from '../../api/user';
import { getToken } from '../../utils/local-storage';
import { setAuthUserActionCreator } from '../authUser/action';

export const ActionType = {
  SET_IS_PRELOAD: 'SET_IS_PRELOAD',
};

export function setIsPreloadActionCreator(isPreload) {
  return {
    type: ActionType.SET_IS_PRELOAD,
    payload: {
      isPreload,
    },
  };
}

export function asyncPreloadProcess() {
  return async (dispatch) => {
    const token = getToken();
    if (!token) {
      dispatch(setAuthUserActionCreator(null));
      dispatch(setIsPreloadActionCreator(false));
      return;
    }
    try {
      const authUser = await userApi.getSelf();
      dispatch(setAuthUserActionCreator(authUser));
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      dispatch(setAuthUserActionCreator(null));
    } finally {
      dispatch(setIsPreloadActionCreator(false));
    }
  };
}
