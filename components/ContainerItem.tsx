import { FC } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { convertDataToTime } from "@/lib/utils";

interface ContainerItemProps {
  handleDeleteVisit: (id: string) => void;
  id: string;
  employee: string;
  timestamp: string;
  price: number;
  visitType: string;
}

const ContainerItem: FC<ContainerItemProps> = ({
  id,
  employee,
  timestamp,
  price,
  visitType,
  handleDeleteVisit,
}) => {
  return (
    <div className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md transition duration-150 grid grid-cols-[200px_200px_150px_100px_10px]">
      <div className="contaiter-item">
        <span>Мастер: </span>
        <span className="font-semibold">{employee}</span>
      </div>
      <div className="contaiter-item">
        <span>Услуга: </span>
        <span className="font-semibold overflow-hidden text-ellipsis">
          {visitType}
        </span>
      </div>
      <div className="contaiter-item justify-center">
        <span>Цена: </span>
        <span className="font-semibold">{price}</span>
      </div>
      <div className="contaiter-item justify-center">
        <span className="font-semibold">{convertDataToTime(timestamp)}</span>
      </div>
      <div>
        <XCircleIcon
          className="w-7 h-7 cursor-pointer text-red-400 hover:text-red-500 ml-7"
          onClick={() => handleDeleteVisit(id)}
        />
      </div>
    </div>
  );
};

export default ContainerItem;
