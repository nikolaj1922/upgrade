import { FC } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import logo from "@/public/logo.png";
import useAuth from "@/hooks/useAuth";
import Circular from "../ui/CircularProgress";
import Button from "../ui/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAppDispatch } from "@/hooks/useRedux";
import { setRegisterForm } from "@/redux/slices/formStateSlice";

interface LoginFormProps {}

type FormValues = {
  email: string;
  password: string;
};

const LoginForm: FC<LoginFormProps> = () => {
  const { signIn, isLoading } = useAuth();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    signIn(data.email, data.password);
  };

  return (
    <form
      className="bg-neutral-100 w-[360px] flex flex-col space-y-6 p-8 rounded shadow-md relative"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="w-3/4 mx-auto">
        <Image src={logo} alt="logo" draggable="false" priority />
      </div>
      <div className="flex flex-col space-y-4">
        <div>
          <div className="login-input-group">
            <label htmlFor="name">E-mail</label>
            <input
              {...register("email", {
                required: "Обязательное поле",
                minLength: {
                  value: 9,
                  message: "Минимальная длина 9 символoв",
                },
              })}
              type="email"
              id="name"
              className="login-input"
              placeholder="example@mail.ru"
            />
          </div>
          <p className="text-xs text-red-500">{errors.email?.message}</p>
        </div>
        <div>
          <div className="login-input-group">
            <label htmlFor="password">Пароль</label>
            <input
              {...register("password", {
                required: "Введите пароль",
              })}
              type="password"
              id="password"
              className="login-input"
              placeholder="******"
            />
          </div>
          <p className="text-xs text-red-500">{errors.password?.message}</p>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-6 ml-14">
        <Button className="leading-4 sm:leading-6">
          {isLoading ? <Circular /> : "Открыть смену"}
        </Button>
        <button
          className="hover:bg-gray-200 p-2.5 rounded-full transition duration-200 ease-out"
          onClick={() => dispatch(setRegisterForm())}
          type="button"
        >
          <PersonAddIcon className="text-gray-800" />
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
