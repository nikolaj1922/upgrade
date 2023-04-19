import { FC } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import logo from "@/public/logo.png";
import useAuth from "@/hooks/useAuth";
import Circular from "../ui/CircularProgress";
import Button from "../ui/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch } from "@/hooks/useRedux";
import { setLoginForm } from "@/redux/slices/formStateSlice";

interface LoginFormProps {}

type FormValues = {
  email: string;
  password: string;
  name: string;
};

const RegisterForm: FC<LoginFormProps> = ({}) => {
  const { signUp, isLoading } = useAuth();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    signUp(data.email, data.password, data.name);
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
            <label htmlFor="name">Имя</label>
            <input
              {...register("name", {
                required: "Обязательное поле",
                minLength: {
                  value: 3,
                  message: "Минимальная длина 3 символа",
                },
              })}
              type="email"
              id="name"
              className="login-input"
              placeholder="Ваше имя"
            />
          </div>
          <p className="text-xs text-red-500">{errors.name?.message}</p>
        </div>
        <div>
          <div className="login-input-group">
            <label htmlFor="email">E-mail</label>
            <input
              {...register("email", {
                required: "Обязательное поле",
                minLength: {
                  value: 9,
                  message: "Минимальная длина 9 символoв",
                },
              })}
              type="email"
              id="email"
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
                minLength: {
                  value: 6,
                  message: "Минимальная длина 6 символов",
                },
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
          {isLoading ? <Circular /> : "Регистрация"}
        </Button>
        <button
          className="hover:bg-gray-200 p-2.5 rounded-full transition duration-200 ease-out"
          onClick={() => dispatch(setLoginForm())}
          type="button"
        >
          <ArrowBackIcon className="text-gray-800" />
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
