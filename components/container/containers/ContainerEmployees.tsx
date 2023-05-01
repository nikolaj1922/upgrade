import { FC } from "react";
import { IEmployee } from "@/types/types";

import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { ContainerItemEmployee } from "../items";
import Circular from "../../ui/CircularProgress";

interface ContainerEmployeesProps {
  employees: IEmployee[];
}

const ContainerEmployees: FC<ContainerEmployeesProps> = ({ employees }) => {
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const dispatch = useAppDispatch();

  const handleDeleteEmployee = () => {
    
  }

  return (
    <div className="bg-white w-full h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {!employees && <Circular size={40} className="mt-5" />}
      {!employees?.length && (
        <h2 className="text-3xl text-center mt-4">Мастера не найдены</h2>
      )}
      {employees &&
        employees?.map((emp) => (
          <ContainerItemEmployee key={emp.id} id={emp.id} name={emp.name} />
        ))}
    </div>
  );
};

export default ContainerEmployees;
