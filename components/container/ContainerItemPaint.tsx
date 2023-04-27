import { FC } from "react";
import { payloadTypeFormat } from "@/lib/utils";
import XRedCircleButton from "../ui/XRedCircleButton";
import { IPaint } from "@/types/types";

interface ContainerItemSaleProps {
  handleDeleteItem: (id: string) => void;
  paint: IPaint;
}

const ContainerItemPaint: FC<ContainerItemSaleProps> = ({
  handleDeleteItem,
  paint,
}) => {
  return (
    <div className="bg-gray-100 hover:bg-gray-200 p-2 px-4 rounded-md transition duration-200 flex items-center justify-between shadow-sm hover:shadow-md">
      <div className="w-11/12 flex justify-between items-center space-x-8 px-1">
        {paint.title && (
          <div className="container-item w-[250px] justify-start">
            <span>Продажа: </span>
            <span className="font-semibold">{paint.title}</span>
          </div>
        )}
        {paint.employee && (
          <div className="container-item w-[250px] justify-start">
            <span>Мастер: </span>
            <span className="font-semibold">{paint.employee}</span>
          </div>
        )}
        {paint.payloadType && (
          <div className="container-item justify-start w-[100px]">
            <span>Оплата: </span>
            <span className="font-semibold">
              {payloadTypeFormat(paint.payloadType)}
            </span>
          </div>
        )}
        <div className="container-item w-[100px]">
          <span>Цена: </span>
          <span className="font-semibold">{paint.price}</span>
        </div>
        <div className="container-item w-[70px]">
          <span className="font-semibold">{paint.timestamp}</span>
        </div>
      </div>
      {paint.payloadType && (
        <div className="flex justify-center items-center">
          <XRedCircleButton
            onClick={() => handleDeleteItem(paint.id)}
            className="ml-7"
          />
        </div>
      )}
    </div>
  );
};

export default ContainerItemPaint;
