import { XCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

interface XRedCircleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const XRedCircleButton: React.FC<XRedCircleButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <button {...props}>
      <XCircleIcon
        className={`w-7 h-7 cursor-pointer text-red-400 hover:text-red-500 ${className}`}
      />
    </button>
  );
};

export default XRedCircleButton;
