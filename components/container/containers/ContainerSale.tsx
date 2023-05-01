import { FC } from "react";
import { ISale } from "@/types/types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { ContainerItemSale } from "../items";
import Circular from "../../ui/CircularProgress";
import { subFromSalesMen } from "@/redux/slices/cashboxStateSlice";

interface ContainerSaleProps {
  salesMen: ISale[];
  checkedSum?: number;
}

const ContainerSale: FC<ContainerSaleProps> = ({ salesMen, checkedSum }) => {
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const dispatch = useAppDispatch();

  const subFromSaleState = (id: string) => {
    const deletedElement = salesMen?.find((item) => item.id === id);
    dispatch(
      subFromSalesMen({
        type: deletedElement?.payloadType!,
        value: deletedElement?.price!,
      })
    );
    dispatch(
      subFromSalesMen({
        type: "total",
        value: deletedElement?.price!,
      })
    );
  };

  const handleDeleteSale = async (id: string) => {
    try {
      const updatedArray = salesMen?.filter((item) => item.id !== id);
      await updateDoc(doc(db, "work shifts", shiftId!), {
        salesMen: updatedArray,
      });
      subFromSaleState(id);
      toast.success("Продажа удалена.");
    } catch (err) {
      toast.error("Не удалось удалить. Попробуйте еще раз.");
    }
  };

  return (
    <div className="bg-white w-full h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {!salesMen && <Circular size={40} className="mt-5" />}
      {!checkedSum ? (
        <h2 className="text-3xl text-center mt-4">
          Для начала работы, укажите сумму на начало смены
        </h2>
      ) : !salesMen?.length ? (
        <h2 className="text-3xl text-center mt-4">Нет продаж</h2>
      ) : null}
      {salesMen &&
        salesMen?.map((item) => (
          <ContainerItemSale
            key={item.id}
            {...item}
            handleDeleteSale={handleDeleteSale}
          />
        ))}
    </div>
  );
};

export default ContainerSale;
