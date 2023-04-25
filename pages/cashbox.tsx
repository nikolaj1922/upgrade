import { FC } from "react";
import MainHeader from "@/components/Header";
import CashBoxAccordion from "@/components/CashBoxAccordion";

interface cashboxProps {}

const cashbox: FC<cashboxProps> = ({}) => {
  return (
    <main>
      <MainHeader header="Касса" />
      <CashBoxAccordion />
    </main>
  );
};

export default cashbox;