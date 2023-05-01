import React from "react";
import MainHeader from "@/components/Header";
import CashBoxAccordion from "@/components/CashBoxAccordion";

interface ReportProps {}

const Report: React.FC<ReportProps> = ({}) => {
  return (
    <main>
      <MainHeader header="Отчет о смене" />
      <CashBoxAccordion />
    </main>
  );
};

export default Report;
