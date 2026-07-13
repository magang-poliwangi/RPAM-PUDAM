import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './authUser/reducer';
import errorReducer from './error/reducer';
import usersReducer from './user/reducer';
import isPreloadReducer from './isPreload/reducer';
import kajiUlangRisikosReducer from './kajiUlangRisiko/reducer';
import rencanaPerbaikansReducer from './rencanaPerbaikan/reducer';

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    error: errorReducer,
    users: usersReducer,
    isPreload : isPreloadReducer,
    kajiUlangRisikos: kajiUlangRisikosReducer,
    rencanaPerbaikans: rencanaPerbaikansReducer,
  },
});

export default store;
