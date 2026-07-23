import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './authUser/reducer';
import errorReducer from './error/reducer';
import usersReducer from './user/reducer';
import isPreloadReducer from './isPreload/reducer';
import kajiUlangRisikosReducer from './kajiUlangRisiko/reducer';
import rencanaPerbaikansReducer from './rencanaPerbaikan/reducer';
import pemantauanOperasionalReducer from './pemantauanOperasional/reducer';
import identifikasiDanKejadianBahayaReducer from './indentifikasiDanKejadianBahaya/reducer';
import penilaianRisikoReducer from './penilaianRisiko/reducer';
import lokasiSpamReducer from './lokasiSpam/reducer';
import auditLogReducer from './auditLog/reducer';
import bahayaKontaminasiReducer from './BahayaKontaminasi/reducer';
const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    error: errorReducer,
    users: usersReducer,
    isPreload : isPreloadReducer,
    lokasiSpam: lokasiSpamReducer,
    identifikasiDanKejadianBahaya:identifikasiDanKejadianBahayaReducer,
    penilaianRisiko:penilaianRisikoReducer,
    kajiUlangRisiko: kajiUlangRisikosReducer,
    rencanaPerbaikan: rencanaPerbaikansReducer,
    pemantauanOperasional:pemantauanOperasionalReducer,
    auditLog: auditLogReducer,
    bahayaKontaminasi: bahayaKontaminasiReducer,
  }
});

export default store;
