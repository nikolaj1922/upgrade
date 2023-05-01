import { FC } from "react";
import { IPaint } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { ContainerItemPaint } from "../items";
import Circular from "../../ui/CircularProgress";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { subFromPaint } from "@/redux/slices/cashboxStateSlice";

interface ContainerPaintProps {
  paint: IPaint[];
  checkedSum: number;
}

const ContainerPaint: FC<ContainerPaintProps> = ({ paint, checkedSum }) => {
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const dispatch = useAppDispatch();

  const subFromPaintState = (id: string) => {
    const deletedElement = paint.find((item) => item.id === id);
    dispatch(
      subFromPaint({
        type: deletedElement?.payloadType!,
        value: deletedElement?.price!,
      })
    );
    dispatch(
      subFromPaint({
        type: "total",
        value: deletedElement?.price!,
      })
    );
  };
  const handleDeletePaint = async (id: string) => {
    try {
      const updatedArray = paint?.filter((item) => item.id !== id);
      await updateDoc(doc(db, "work shifts", shiftId!), {
        paint: updatedArray,
      });
      subFromPaintState(id);
      toast.success("Краска удалена.");
    } catch (err) {
      toast.error("Не удалось удалить. Попробуйте еще раз.");
    }
  };

  return (
    <div className="bg-white w-full h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {!paint && <Circular size={40} className="mt-5" />}
      {!checkedSum ? (
        <h2 className="text-3xl text-center mt-4">
          Для начала работы, укажите сумму на начало смены
        </h2>
      ) : !paint?.length ? (
        <h2 className="text-3xl text-center mt-4">Нет записей</h2>
      ) : null}
      {paint &&
        paint?.map((item) => (
          <ContainerItemPaint
            key={item.id}
            {...item}
            handleDeletePaint={handleDeletePaint}
          />
        ))}
    </div>
  );
};

export default ContainerPaint;
