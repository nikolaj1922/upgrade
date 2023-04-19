import { ReactElement } from "react";
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { useAppSelector } from "@/hooks/useRedux";

const Login = ({}) => {
  const { formState } = useAppSelector((state) => state.formState);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {formState === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Login;
