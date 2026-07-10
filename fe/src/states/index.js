import { configureStore } from "@reduxjs/toolkit";
import pemantauanReducer from "../Features/pemantauanOperasional/pemantauanOperasionalSlice";

const store = configureStore({
  reducer: {
    pemantauanOperasional: pemantauanReducer,
  },
});

export default store;