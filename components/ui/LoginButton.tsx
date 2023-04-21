import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

const LoginButton: FC<ButtonProps> = ({
  children,
  className,
  isLoading,
  onClick,
}) => {
  return (
    <button
      className={`rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-purple-600 active:shadow-none shadow-lg bg-gradient-to-tr from-purple-600 to-purple-500 border-purple-700 text-white overflow-hidden disabled:pointer-events-none focus:outline-none w-[140px] ${className}`}
      disabled={isLoading}
      onClick={onClick}
    >
      <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-36 group-hover:h-32 opacity-10"></span>
      <span className="relative">{children}</span>
    </button>
  );
};
3;

export default LoginButton;