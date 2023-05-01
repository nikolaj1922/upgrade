import { FC } from "react";
import { IPaint, IVisit } from "@/types/types";
import { ContainerItemVisit } from "../items";
import Circular from "@/components/ui/CircularProgress";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { reduceSalary } from "@/redux/slices/salaryStateSlice";
import { toast } from "react-hot-toast";
import {
  subFromEmployeeSalaryPaint,
  subFromPaint,
  subFromVisits,
} from "@/redux/slices/cashboxStateSlice";

interface ContainerVisitsProps {
  visits: IVisit[];
  paint: IPaint[];
}

const ContainerVisits: FC<ContainerVisitsProps> = ({ visits, paint }) => {
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const dispatch = useAppDispatch();

  const subFromVisitState = (id: string, paintId: string) => {
    const deletedElement = visits.find((item) => item.id === id);
    dispatch(
      subFromVisits({
        type: deletedElement?.payloadType!,
        value: deletedElement?.price!,
      })
    );
    dispatch(
      subFromVisits({
        type: "total",
        value: deletedElement?.price!,
      })
    );
    dispatch(subFromEmployeeSalaryPaint(paintId));
    dispatch(
      subFromPaint({
        type: "total",
        value: deletedElement?.paintValue!,
      })
    );
  };

  const handleDeleteVisit = async (
    id: string,
    paintId: string,
    employee: string,
    value: number,
    paintValue: number
  ) => {
    try {
      const updatedVisitsArray = visits?.filter((item) => item.id !== id);
      const updatedPaintArray = paint?.filter((item) => item.id !== paintId);
      await updateDoc(doc(db, "work shifts", shiftId!), {
        visits: updatedVisitsArray,
        paint: updatedPaintArray,
      });
      subFromVisitState(id, paintId);
      dispatch(
        reduceSalary({
          employee,
          value,
          paintValue,
        })
      );
      toast.success("Запись удалена.");
    } catch (err) {
      toast.error("Не удалось удалить. Попробуйте еще раз.");
    }
  };

  return (
    <div className="bg-white w-full h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {!visits && <Circular size={40} className="mt-5" />}
      {!visits?.length && (
        <h2 className="text-3xl text-center mt-4">Нет записей</h2>
      )}
      {visits &&
        visits.map((item) => (
          <ContainerItemVisit
            key={item.id}
            handleDeleteVisit={handleDeleteVisit}
            {...item}
          />
        ))}
    </div>
  );
};

export default ContainerVisits;
