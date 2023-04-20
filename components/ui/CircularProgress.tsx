import { AllHTMLAttributes, FC } from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface CircularProgressProps extends AllHTMLAttributes<HTMLDivElement> {
  size?: number;
}

const Circular: FC<CircularProgressProps> = ({ className, size }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <CircularProgress color="inherit" size={size || 20} />
    </div>
  );
};

export default Circular;
