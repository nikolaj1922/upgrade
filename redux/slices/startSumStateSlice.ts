import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: {
  salesMStartSum: number;
  paintStartSum: number;
  generalShiftStartSum: number;
} = {
  salesMStartSum: 0,
  paintStartSum: 0,
  generalShiftStartSum: 0,
};

const StartSumSlice = createSlice({
  name: "start sum",
  initialState,
  reducers: {
    setSalesMStartSum: (state, action: PayloadAction<number>) => {
      state.salesMStartSum = +action.payload;
    },
    setPaintStartSum: (state, action: PayloadAction<number>) => {
      state.paintStartSum = +action.payload;
    },
    setGeneralShiftStartSum: (state, action: PayloadAction<number>) => {
      state.generalShiftStartSum = +action.payload;
    },
  },
});

export default StartSumSlice.reducer;
export const { setSalesMStartSum, setPaintStartSum, setGeneralShiftStartSum } =
  StartSumSlice.actions;
