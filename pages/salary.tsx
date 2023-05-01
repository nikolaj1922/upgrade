import React from "react";
import MainHeader from "@/components/Header";
import { ContainerSalary } from "@/components/container/containers";
import { useAppSelector } from "@/hooks/useRedux";

interface salaryProps {}

const Salary: React.FC<salaryProps> = ({}) => {
  const { salary } = useAppSelector((state) => state.salaryState);
  return (
    <main>
      <MainHeader header="Зарплата" />
      <ContainerSalary salary={salary} />
    </main>
  );
};

export default Salary;
