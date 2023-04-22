import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IShiftState } from "@/types/types";

const initialState: IShiftState = {
  shiftId: null,
};

const shiftStateSlice = createSlice({
  name: "shiftState",
  initialState,
  reducers: {
    setShiftId: (state, action: PayloadAction<string>) => {
      state.shiftId = action.payload;
    },
    clearShiftId: (state) => {
      state.shiftId = null;
    },
  },
});

export const { setShiftId, clearShiftId } = shiftStateSlice.actions;
export default shiftStateSlice.reducer;
