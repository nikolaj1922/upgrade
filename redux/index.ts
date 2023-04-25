import { configureStore } from "@reduxjs/toolkit";
import formStateReducer from "./slices/formStateSlice";
import shiftStateReducer from "./slices/shiftStateSlice";
import cashboxStateReducer from "./slices/cashboxStateSlice";
import salaryStateReducer from "./slices/salaryStateSlice";

export const store = configureStore({
  reducer: {
    formState: formStateReducer,
    shiftState: shiftStateReducer,
    cashboxState: cashboxStateReducer,
    salaryState: salaryStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
