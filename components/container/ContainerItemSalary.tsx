import { FC, useState } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface ContainerItemSalaryProps {
  employee: string;
  revenue: number;
}

const ContainerItemSalary: FC<ContainerItemSalaryProps> = ({
  employee,
  revenue,
}) => {
  const [percentValue, setPercentValue] = useState<number>(0.5);
  const handleSetSelect = (e: SelectChangeEvent) =>
    setPercentValue(+e.target.value);

  return (
    <div className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md transition duration-200 flex items-center justify-center shadow-sm hover:shadow-md">
      <div className="w-11/12 flex justify-between items-center space-x-8 px-1">
        <div className="container-item justify-start w-[170px]">
          <span>Мастер: </span>
          <span className="font-semibold">{employee}</span>
        </div>
        <div className="container-item justify-start">
          <span>Выручка: </span>
          <span className="font-semibold">{revenue}</span>
        </div>
        <div className="container-item">
          <FormControl>
            <Select
              defaultValue="0.5"
              displayEmpty
              sx={{ height: "30px", width: "85px" }}
              onChange={handleSetSelect}
              MenuProps={{
                PaperProps: {
                  sx: { height: "200px" },
                },
              }}
            >
              <MenuItem value="0.6">60%</MenuItem>
              <MenuItem value="0.55">55%</MenuItem>
              <MenuItem value="0.5">50%</MenuItem>
              <MenuItem value="0.45">45%</MenuItem>
              <MenuItem value="0.4">40%</MenuItem>
              <MenuItem value="0.35">35%</MenuItem>
              <MenuItem value="0.3">30%</MenuItem>
              <MenuItem value="0.25">25%</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="container-item">
          <span>Зарплата: </span>
          <span className="font-semibold">
            {Math.round(revenue * percentValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContainerItemSalary;
