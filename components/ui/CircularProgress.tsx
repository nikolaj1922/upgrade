import { FC } from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface CircularProgressProps {}

const Circular: FC<CircularProgressProps> = ({}) => {
  return (
    <div className="flex justify-center items-center">
      <CircularProgress color="inherit" size={20} />
    </div>
  );
};

export default Circular;
