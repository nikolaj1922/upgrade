import { FC } from "react";
import XRedCircleButton from "./ui/XRedCircleButton";

interface ContainerItemVisitProps {
  handleDeleteItem: (id: string) => void;
  id: string;
  employee: string;
  timestamp: string;
  price: number;
  visitType: string;
  payloadType: string;
}

const ContainerItemVisit: FC<ContainerItemVisitProps> = ({
  id,
  employee,
  timestamp,
  price,
  visitType,
  handleDeleteItem,
  payloadType,
}) => {
  return (
    <div className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md transition duration-200 flex items-center justify-center shadow-sm hover:shadow-md">
      <div className="w-11/12 flex justify-start space-x-8 px-1">
        <div className="container-item w-[155px] justify-start">
          <span>Мастер: </span>
          <span className="font-semibold">{employee}</span>
        </div>
        <div className="container-item w-[145px] justify-start">
          <span>Услуга: </span>
          <span className="font-semibold overflow-hidden text-ellipsis">
            {visitType}
          </span>
        </div>
        <div className="container-item justify-start w-[100px]">
          <span>Оплата: </span>
          <span className="font-semibold">{payloadType}</span>
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

export default ContainerItemVisit;
