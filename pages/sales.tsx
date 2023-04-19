import MainHeader from "@/components/Header";
import { FC } from "react";

interface salesProps {}

const Sales: FC<salesProps> = ({}) => {
  return (
    <main className="bg-zinc-200 opacity-[97%] rounded-md w-full p-8">
      <MainHeader header="Продажи" />
    </main>
  );
};

export default Sales;
