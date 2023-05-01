import { FC } from "react";
import { IGeneral } from "@/types/types";
import { ContainerItemGeneral } from "../items";
import Circular from "../../ui/CircularProgress";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { subFromGeneralShift } from "@/redux/slices/cashboxStateSlice";
import { toast } from "react-hot-toast";

interface ContainerGeneralProps {
  generalShift: IGeneral[];
  checkedSum: number;
}

const ContainerGeneral: FC<ContainerGeneralProps> = ({
  generalShift,
  checkedSum,
}) => {
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const dispatch = useAppDispatch();

  const subFromGeneralState = (id: string) => {
    const deletedElement = generalShift?.find((item) => item.id === id);
    dispatch(subFromGeneralShift(deletedElement?.price!));
  };

  const handleDeleteGeneral = async (id: string) => {
    try {
      const updatedArray = generalShift?.filter((item) => item.id !== id);
      await updateDoc(doc(db, "work shifts", shiftId!), {
        generalShift: updatedArray,
      });
      subFromGeneralState(id);
    } catch (err) {
      toast.error("Не удалось удалить. Попробуйте еще раз.");
    }
  };

  return (
    <div className="bg-white w-full h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {!generalShift && <Circular size={40} className="mt-5" />}
      {!checkedSum ? (
        <h2 className="text-3xl text-center mt-4">
          Для начала работы, укажите сумму на начало смены
        </h2>
      ) : !generalShift?.length ? (
        <h2 className="text-3xl text-center mt-4">Нет записей</h2>
      ) : null}
      {generalShift &&
        generalShift.map((item) => (
          <ContainerItemGeneral
            key={item.id}
            handleDeleteGeneral={handleDeleteGeneral}
            {...item}
          />
        ))}
    </div>
  );
};

export default ContainerGeneral;
