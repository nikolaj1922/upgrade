import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IShiftState } from "@/types/types";

const initialState: IShiftState = {
  shiftId: null,
  timestamp: null,
};

const shiftStateSlice = createSlice({
  name: "shiftState",
  initialState,
  reducers: {
    setShift: (
      state,
      action: PayloadAction<{ shiftId: string; timestamp: string }>
    ) => {
      state.shiftId = action.payload.shiftId;
      state.timestamp = action.payload.timestamp;
    },
    clearShift: (state) => {
      state.shiftId = null;
    },
  },
});

export const { setShift, clearShift } = shiftStateSlice.actions;
export default shiftStateSlice.reducer;
