import { FC } from "react";
import { payloadTypeFormat } from "@/lib/utils";
import XRedCircleButton from "../../ui/XRedCircleButton";
import { PayloadType } from "@/types/types";

interface ContainerItemPaintProps {
  handleDeletePaint: (id: string) => void;
  id: string;
  payloadType: PayloadType;
  employee: string;
  title: string;
  price: number;
  timestamp: string;
  type: string;
}

const ContainerItemPaint: FC<ContainerItemPaintProps> = ({
  handleDeletePaint,
  id,
  payloadType,
  employee,
  title,
  price,
  timestamp,
}) => {
  return (
    <div className="bg-gray-100 hover:bg-gray-200 p-2 px-4 rounded-md transition duration-200 flex items-center justify-between shadow-sm hover:shadow-md">
      <div className="w-11/12 flex justify-between items-center space-x-8 px-1">
        {title && (
          <div className="container-item w-[250px] justify-start">
            <span>Продажа: </span>
            <span className="font-semibold">{title}</span>
          </div>
        )}
        {employee && (
          <div className="container-item w-[250px] justify-start">
            <span>Мастер: </span>
            <span className="font-semibold">{employee}</span>
          </div>
        )}
        {payloadType && (
          <div className="container-item justify-start w-[100px]">
            <span>Оплата: </span>
            <span className="font-semibold">
              {payloadTypeFormat(payloadType)}
            </span>
          </div>
        )}
        <div className="container-item w-[100px]">
          <span>Цена: </span>
          <span className="font-semibold">{price}</span>
        </div>
        <div className="container-item w-[70px]">
          <span className="font-semibold">{timestamp}</span>
        </div>
      </div>
      {payloadType && (
        <div className="flex justify-center items-center">
          <XRedCircleButton
            onClick={() => handleDeletePaint(id)}
            className="ml-7"
          />
        </div>
      )}
    </div>
  );
};

export default ContainerItemPaint;
