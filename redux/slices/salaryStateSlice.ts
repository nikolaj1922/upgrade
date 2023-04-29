import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISalary } from "@/types/types";

const initialState: {
  salary: ISalary[];
} = {
  salary: [],
};

const salaryStateSlice = createSlice({
  name: "salary",
  initialState,
  reducers: {
    initSalary: (state, action: PayloadAction<ISalary[]>) => {
      const salaryArrayFormatted: ISalary[] = [];
      action.payload.map((item) => {
        const index = salaryArrayFormatted.findIndex(
          (salary) => salary.employee === item.employee
        );
        index !== -1
          ? ((salaryArrayFormatted[index].revenue += +item.revenue),
            (salaryArrayFormatted[index].paint += item.paint))
          : salaryArrayFormatted.push({
              employee: item.employee,
              revenue: +item.revenue,
              paint: +item.paint,
            });
      });
      state.salary = salaryArrayFormatted;
    },
    addSalary: (
      state,
      action: PayloadAction<{
        employee: string;
        value: number;
        paintValue: number;
      }>
    ) => {
      const index = state.salary.findIndex(
        (salary) => salary.employee === action.payload.employee
      );
      index !== -1
        ? ((state.salary[index].revenue += +action.payload.value),
          (state.salary[index].paint += +action.payload.paintValue))
        : state.salary.push({
            employee: action.payload.employee,
            revenue: +action.payload.value,
            paint: +action.payload.paintValue,
          });
    },
    reduceSalary: (
      state,
      action: PayloadAction<{
        employee: string;
        value: number;
        paintValue: number;
      }>
    ) => {
      const index = state.salary.findIndex(
        (state) => state.employee === action.payload.employee
      );
      index !== -1 &&
        ((state.salary[index].revenue -= +action.payload.value),
        (state.salary[index].paint -= +action.payload.paintValue));
      if (state.salary[index].revenue === 0)
        state.salary = state.salary.filter(
          (salary) => salary.employee !== action.payload.employee
        );
    },
  },
});

export default salaryStateSlice.reducer;
export const { addSalary, reduceSalary, initSalary } = salaryStateSlice.actions;
