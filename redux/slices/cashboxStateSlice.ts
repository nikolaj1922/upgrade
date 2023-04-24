import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICashboxSlice } from "@/types/types";
import { PayloadType } from "@/types/types";

const initialState: ICashboxSlice = {
  generalTotal: 0,
  generalCash: 0,
  generalCard: 0,
  generalKaspi: 0,
  visitsTotal: 0,
  visitsCash: 0,
  visitsCard: 0,
  visitsKaspi: 0,
  salesTotal: 0,
  salesCash: 0,
  salesCard: 0,
  salesKaspi: 0,
  paintTotal: 0,
};

const cashboxStateSlice = createSlice({
  name: "cashbox",
  initialState,
  reducers: {
    initGeneral: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total") {
        state.generalTotal = +action.payload.value;
      }
      if (action.type === "cash") {
        state.generalCash = +action.payload.value;
      }
      if (action.type === "card") {
        state.generalCard = +action.payload.value;
      }
      if (action.type === "kaspi") {
        state.generalKaspi = +action.payload.value;
      }
    },
    initVisits: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total") {
        state.visitsTotal = +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.visitsCash = +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.visitsCard = +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.visitsKaspi = +action.payload.value;
      }
    },
    initSales: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total") {
        state.salesTotal = +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.salesCash = +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.salesCard = +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.salesKaspi = +action.payload.value;
      }
    },
    initPaint: (state, action: PayloadAction<number>) => {
      state.paintTotal = +action.payload;
    },
    addToGeneral: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total") {
        state.generalTotal += +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.generalCash += +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.generalCard += +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.generalKaspi += +action.payload.value;
      }
    },
    subFromGeneral: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total" && state.generalTotal >= 0) {
        state.generalTotal -= +action.payload.value;
      }
      if (action.payload.type === "cash" && state.generalCash >= 0) {
        state.generalCash -= +action.payload.value;
      }
      if (action.payload.type === "card" && state.generalCard >= 0) {
        state.generalCard -= +action.payload.value;
      }
      if (action.payload.type === "kaspi" && state.generalKaspi >= 0) {
        state.generalKaspi -= +action.payload.value;
      }
    },
    addToVisits: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total") {
        state.visitsTotal += +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.visitsCash += +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.visitsCard += +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.visitsKaspi += +action.payload.value;
      }
    },
    subFromVisits: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total" && state.visitsTotal >= 0) {
        state.visitsTotal -= +action.payload.value;
      }
      if (action.payload.type === "cash" && state.visitsCash >= 0) {
        state.visitsCash -= +action.payload.value;
      }
      if (action.payload.type === "card" && state.visitsCard >= 0) {
        state.visitsCard -= +action.payload.value;
      }
      if (action.payload.type === "kaspi" && state.visitsKaspi >= 0) {
        state.visitsKaspi -= +action.payload.value;
      }
    },
    addToSales: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total") {
        state.salesTotal += +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.salesCash += +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.salesCard += +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.salesKaspi += +action.payload.value;
      }
    },
    subFromSales: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total" && state.salesTotal >= 0) {
        state.salesTotal -= +action.payload.value;
      }
      if (action.payload.type === "cash" && state.salesCash >= 0) {
        state.salesCash -= +action.payload.value;
      }
      if (action.payload.type === "card" && state.salesCard >= 0) {
        state.salesCard -= +action.payload.value;
      }
      if (action.payload.type === "kaspi" && state.salesKaspi >= 0) {
        state.salesKaspi -= +action.payload.value;
      }
    },
    addToPaint: (state, action: PayloadAction<number>) => {
      state.paintTotal += +action.payload;
    },
    subFromPaint: (state, action: PayloadAction<number>) => {
      if (state.paintTotal >= 0) {
        state.paintTotal -= +action.payload;
      }
    },
  },
});

export const {
  initGeneral,
  initPaint,
  initSales,
  initVisits,
  addToGeneral,
  subFromGeneral,
  addToVisits,
  subFromVisits,
  addToSales,
  subFromSales,
  addToPaint,
  subFromPaint,
} = cashboxStateSlice.actions;
export default cashboxStateSlice.reducer;
