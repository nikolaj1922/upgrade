import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICashboxSlice, IPaint, ISale } from "@/types/types";
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
  salesMenTotal: 0,
  salesMenCash: 0,
  salesMenCard: 0,
  salesMenKaspi: 0,
  paintTotal: 0,
  paintCash: 0,
  paintCard: 0,
  paintKaspi: 0,
  employeeSalaryPaint: [],
};

const cashboxStateSlice = createSlice({
  name: "cashbox",
  initialState,
  reducers: {
    initGeneral: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "signIn") {
        state.generalTotal = +action.payload.value;
        state.generalCard = +action.payload.value;
        state.generalCash = +action.payload.value;
        state.generalKaspi = +action.payload.value;
      }
      if (action.payload.type === "total") {
        state.generalTotal = +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.generalCash = +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.generalCard = +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.generalKaspi = +action.payload.value;
      }
    },
    initVisits: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "signIn") {
        state.visitsTotal = +action.payload.value;
        state.visitsCash = +action.payload.value;
        state.visitsCard = +action.payload.value;
        state.visitsKaspi = +action.payload.value;
      }
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
    initSalesMen: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "signIn") {
        state.salesMenTotal = +action.payload.value;
        state.salesMenCash = +action.payload.value;
        state.salesMenCard = +action.payload.value;
        state.salesMenKaspi = +action.payload.value;
      }
      if (action.payload.type === "total") {
        state.salesMenTotal = +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.salesMenCash = +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.salesMenCard = +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.salesMenKaspi = +action.payload.value;
      }
    },
    initPaint: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "signIn") {
        state.paintTotal = +action.payload.value;
        state.paintCash = +action.payload.value;
        state.paintCard = +action.payload.value;
        state.paintKaspi = +action.payload.value;
      }
      if (action.payload.type === "total") {
        state.paintTotal = +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.paintCash = +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.paintCard = +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.paintKaspi = +action.payload.value;
      }
    },
    initEmployeeSalaryPaint: (
      state,
      action: PayloadAction<{ id: string; employee: string; value: number }[]>
    ) => {
      state.employeeSalaryPaint = action.payload;
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
    addToSalesMen: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total") {
        state.salesMenTotal += +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.salesMenCash += +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.salesMenCard += +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.salesMenKaspi += +action.payload.value;
      }
    },
    subFromSalesMen: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total" && state.salesMenTotal >= 0) {
        state.salesMenTotal -= +action.payload.value;
      }
      if (action.payload.type === "cash" && state.salesMenCash >= 0) {
        state.salesMenCash -= +action.payload.value;
      }
      if (action.payload.type === "card" && state.salesMenCard >= 0) {
        state.salesMenCard -= +action.payload.value;
      }
      if (action.payload.type === "kaspi" && state.salesMenKaspi >= 0) {
        state.salesMenKaspi -= +action.payload.value;
      }
    },
    addToPaint: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total") {
        state.paintTotal += +action.payload.value;
      }
      if (action.payload.type === "cash") {
        state.paintCash += +action.payload.value;
      }
      if (action.payload.type === "card") {
        state.paintCard += +action.payload.value;
      }
      if (action.payload.type === "kaspi") {
        state.generalKaspi += +action.payload.value;
      }
    },
    subFromPaint: (
      state,
      action: PayloadAction<{ type: PayloadType; value: number }>
    ) => {
      if (action.payload.type === "total" && state.paintTotal >= 0) {
        state.paintTotal -= +action.payload.value;
      }
      if (action.payload.type === "cash" && state.paintCash >= 0) {
        state.paintCash -= +action.payload.value;
      }
      if (action.payload.type === "card" && state.paintCard >= 0) {
        state.paintCard -= +action.payload.value;
      }
      if (action.payload.type === "kaspi" && state.paintKaspi >= 0) {
        state.generalKaspi -= +action.payload.value;
      }
    },
    addToEmployeeSalaryPaint: (
      state,
      action: PayloadAction<{ id: string; employee: string; value: number }>
    ) => {
      state.employeeSalaryPaint.push({
        id: action.payload.id,
        employee: action.payload.employee,
        value: action.payload.value,
      });
    },
    subFromEmployeeSalaryPaint: (state, action: PayloadAction<string>) => {
      state.employeeSalaryPaint = state.employeeSalaryPaint.filter(
        (paint) => paint.id !== action.payload
      );
    },
  },
});

export const {
  initGeneral,
  initEmployeeSalaryPaint,
  initSalesMen,
  initVisits,
  initPaint,
  addToGeneral,
  subFromGeneral,
  addToVisits,
  subFromVisits,
  addToSalesMen,
  subFromSalesMen,
  addToPaint,
  subFromPaint,
  addToEmployeeSalaryPaint,
  subFromEmployeeSalaryPaint,
} = cashboxStateSlice.actions;
export default cashboxStateSlice.reducer;
