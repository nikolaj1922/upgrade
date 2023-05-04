import { configureStore, combineReducers } from "@reduxjs/toolkit";
import formStateReducer from "./slices/formStateSlice";
import shiftStateReducer from "./slices/shiftStateSlice";
import cashboxStateReducer from "./slices/cashboxStateSlice";
import salaryStateReducer from "./slices/salaryStateSlice";
import startSumStateReducer from "./slices/startSumStateSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  formState: formStateReducer,
  shiftState: shiftStateReducer,
  cashboxState: cashboxStateReducer,
  salaryState: salaryStateReducer,
  startSumState: startSumStateReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
