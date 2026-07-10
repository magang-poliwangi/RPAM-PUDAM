import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './authUser/reducer';
import errorReducer from './error/reducer';
import usersReducer from './user/reducer';
import isPreloadReducer from './isPreload/reducer';

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    error: errorReducer,
    users: usersReducer,
    isPreload : isPreloadReducer
  },
});

export default store;