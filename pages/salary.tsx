import Container from "@/components/container/Container";
import MainHeader from "@/components/Header";
import { useAppSelector } from "@/hooks/useRedux";
import { FC } from "react";

interface salaryProps {}

const Salary: FC<salaryProps> = ({}) => {
  const { salary } = useAppSelector((state) => state.salaryState);
  return (
    <main>
      <MainHeader header="Зарплата" />
      <Container dataType="salary" salary={salary} />
    </main>
  );
};

export default Salary;
