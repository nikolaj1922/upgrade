import { FC } from "react";
import { IVisit, ISale } from "@/types/types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import ContainerItemVisit from "./ContainerItemVisit";
import ContainerItemSale from "./ContainerItemSale";
import Circular from "./ui/CircularProgress";
import { subFromPaint, subFromVisits } from "@/redux/slices/cashboxStateSlice";
import { subFromGeneral } from "@/redux/slices/cashboxStateSlice";
import { subFromSales } from "@/redux/slices/cashboxStateSlice";

interface ContainerProps {
  visits?: IVisit[];
  sales?: ISale[];
  dataType: "visits" | "sales";
}

type SubFrom = "visits" | "sales";

const Container: FC<ContainerProps> = ({ visits, sales, dataType }) => {
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const dispatch = useAppDispatch();

  const subFromCashState = (id: string, subFrom: SubFrom, paintId?: string) => {
    if (subFrom === "visits") {
      const deletedElement = visits?.find((item) => item.id === id);
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
      dispatch(
        subFromGeneral({
          type: deletedElement?.payloadType!,
          value: deletedElement?.price!,
        })
      );
      dispatch(
        subFromGeneral({
          type: "total",
          value: deletedElement?.price!,
        })
      );
      if (paintId) {
        dispatch(subFromPaint(paintId));
      }
      return;
    }
    if (subFrom === "sales") {
      const deletedElement = sales?.find((item) => item.id === id);
      dispatch(
        subFromSales({
          type: deletedElement?.payloadType!,
          value: deletedElement?.price!,
        })
      );
      dispatch(
        subFromSales({
          type: "total",
          value: deletedElement?.price!,
        })
      );
      dispatch(
        subFromGeneral({
          type: deletedElement?.payloadType!,
          value: deletedElement?.price!,
        })
      );
      dispatch(
        subFromGeneral({
          type: "total",
          value: deletedElement?.price!,
        })
      );
      return;
    }
  };

  const handleDeleteItem = async (id: string, paintId?: string) => {
    try {
      if (!shiftId) return;
      if (dataType === "visits") {
        const updatedArray = visits?.filter((item) => item.id !== id);
        await updateDoc(doc(db, "work shifts", shiftId), {
          visits: updatedArray,
        });
        subFromCashState(id, "visits", paintId);
        toast.success("Запись удалена.");
        return;
      }
      if (dataType === "sales") {
        const updatedArray = sales?.filter((item) => item.id !== id);
        await updateDoc(doc(db, "work shifts", shiftId), {
          sales: updatedArray,
        });
        subFromCashState(id, "sales");
        toast.success("Продажа удалена.");
        return;
      }
    } catch (err) {
      toast.error("Не удалось удалить запись.");
    }
  };

  const render = () => {
    if (dataType === "visits") {
      if (!visits) return <Circular size={40} className="mt-5" />;
      if (!visits.length)
        return <h2 className="text-3xl text-center mt-4">Нет записей</h2>;
      return visits?.map((item) => (
        <ContainerItemVisit
          key={item.id}
          id={item.id}
          paintId={item.paintId}
          employee={item.employee}
          price={item.price}
          timestamp={item.timestamp}
          visitType={item.visitType}
          handleDeleteItem={handleDeleteItem}
          payloadType={item.payloadType}
        />
      ));
    }
    if (dataType === "sales") {
      if (!sales) return <Circular size={40} className="mt-5" />;
      if (!sales.length)
        return <h2 className="text-3xl text-center mt-4">Нет продаж</h2>;
      return sales?.map((item) => (
        <ContainerItemSale
          key={item.id}
          id={item.id}
          title={item.title}
          timestamp={item.timestamp}
          price={item.price}
          payloadType={item.payloadType}
          handleDeleteItem={handleDeleteItem}
        />
      ));
    }
  };

  return (
    <div className="bg-white h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {render()}
    </div>
  );
};

export default Container;
