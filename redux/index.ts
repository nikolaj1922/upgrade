import { configureStore } from "@reduxjs/toolkit";
import formStateReducer from "./slices/formStateSlice";

export const store = configureStore({
  reducer: {
    formState: formStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
