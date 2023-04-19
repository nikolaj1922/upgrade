import { FC } from "react";
import MainHeader from "@/components/Header";

interface servicesProps {}

const Services: FC<servicesProps> = ({}) => {
  return (
    <main className="bg-zinc-200 opacity-[97%] rounded-md w-full p-8">
      <MainHeader header="Записи" />
    </main>
  );
};

export default Services;
