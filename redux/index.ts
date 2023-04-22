import { configureStore } from "@reduxjs/toolkit";
import formStateReducer from "./slices/formStateSlice";
import shiftStateReducer from "./slices/shiftStateSlice";

export const store = configureStore({
  reducer: {
    formState: formStateReducer,
    shiftState: shiftStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
