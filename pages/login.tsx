import { FC, useState } from "react";
import LoginForm from "./components/forms/LoginForm";
import RegisterForm from "./components/forms/RegisterForm";
import { useAppSelector } from "@/hooks/useRedux";

interface loginProps {}

const Login: FC<loginProps> = ({}) => {
  const { formState } = useAppSelector((state) => state.formState);

  return (
    <div className="flex items-center justify-center h-screen">
      {formState === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default Login;
