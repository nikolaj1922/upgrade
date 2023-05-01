import React from "react";
import { ISalary } from "@/types/types";
import { ContainerItemSalary } from "../items";
import Circular from "../../ui/CircularProgress";

interface ContainerSalaryProps {
  salary: ISalary[];
}

const ContainerSalary: React.FC<ContainerSalaryProps> = ({ salary }) => {
  return (
    <div className="bg-white w-full h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {!salary && <Circular size={40} className="mt-5" />}
      {!salary?.length && (
        <h2 className="text-3xl text-center mt-4">
          Чтобы узнать зарплату, добавьте записи
        </h2>
      )}
      {salary &&
        salary?.map((item) => (
          <ContainerItemSalary key={item.employee} {...item} />
        ))}
    </div>
  );
};

export default ContainerSalary;
