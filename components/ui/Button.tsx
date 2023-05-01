import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({
  className,
  onClick,
  children,
  disabled,
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 text-base  leading-6 text-white whitespace-no-wrap bg-green-600 border border-green-700 rounded-md hover:bg-green-700 focus:outline-none w-[140px] transition duration-150 shadow-sm hover:shadow-md disabled:pointer-events-none disabled:bg-green-700 ${className}`}
      data-rounded="rounded-md"
      data-primary="blue-600"
      data-primary-reset="{}"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
