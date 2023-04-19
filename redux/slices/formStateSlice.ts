import { createSlice } from "@reduxjs/toolkit";
import { FormType } from "@/types/types";

const initialState: { formState: FormType } = {
  formState: "login",
};

export const formStateSlice = createSlice({
  name: "formState",
  initialState,
  reducers: {
    setLoginForm: (state) => {
      state.formState = "login";
    },
    setRegisterForm: (state) => {
      state.formState = "register";
    },
  },
});

export const { setLoginForm, setRegisterForm } = formStateSlice.actions;
export default formStateSlice.reducer;
