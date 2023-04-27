import { FC } from "react";
import { payloadTypeFormat } from "@/lib/utils";
import XRedCircleButton from "../ui/XRedCircleButton";

interface ContainerItemGeneralProps {
  handleDeleteItem: (id: string) => void;
  id: string;
  title: string;
  price: number;
  timestamp: string;
}

const ContainerItemGeneral: FC<ContainerItemGeneralProps> = ({
  handleDeleteItem,
  id,
  timestamp,
  title,
  price,
}) => {
  return (
    <div className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md transition duration-200 flex items-center justify-center shadow-sm hover:shadow-md">
      <div className="w-11/12 flex justify-between items-center space-x-8 px-1">
        <div className="container-item w-[350px] justify-start">
          <span>Наименование: </span>
          <span className="font-semibold">{title}</span>
        </div>
        <div className="container-item w-[100px]">
          <span>Цена: </span>
          <span className="font-semibold">{price}</span>
        </div>
        <div className="container-item w-[70px]">
          <span className="font-semibold">{timestamp}</span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <XRedCircleButton
          onClick={() => handleDeleteItem(id)}
          className="ml-7"
        />
      </div>
    </div>
  );
};

export default ContainerItemGeneral;