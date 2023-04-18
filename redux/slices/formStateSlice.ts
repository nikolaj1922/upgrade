import { createSlice } from "@reduxjs/toolkit";
import { FormType } from "@/types/types";

const initialState: { formState: FormType } = {
  formState: "login",
};

export const formStateSlice = createSlice({
  name: "formState",
  initialState,
  reducers: {
    setLogin: (state) => {
      state.formState = "login";
    },
    setRegister: (state) => {
      state.formState = "register";
    },
  },
});

export const { setLogin, setRegister } = formStateSlice.actions;
export default formStateSlice.reducer;
