import { FC } from "react";
import { IVisit, ISale } from "@/types/types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/hooks/useRedux";
import ContainerItemVisit from "./ContainerItemVisit";
import ContainerItemSale from "./ContainerItemSale";
import Circular from "./ui/CircularProgress";

interface ContainerProps {
  visits?: IVisit[];
  sales?: ISale[];
  dataType: "visits" | "sales";
}

const Container: FC<ContainerProps> = ({ visits, sales, dataType }) => {
  const { shiftId } = useAppSelector((state) => state.shiftState);

  const handleDeleteItem = async (id: string) => {
    try {
      if (!shiftId) return;
      if (dataType === "visits") {
        const updatedArray = visits?.filter((item) => item.id !== id);
        await updateDoc(doc(db, "work shifts", shiftId), {
          visits: updatedArray,
        });
        toast.success("Запись удалена.");
        return;
      }
      if (dataType === "sales") {
        const updatedArray = sales?.filter((item) => item.id !== id);
        await updateDoc(doc(db, "work shifts", shiftId), {
          sales: updatedArray,
        });
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
        return (
          <h2 className="text-3xl font-semibold text-center mt-4">
            Нет записей
          </h2>
        );
      return visits?.map((item) => (
        <ContainerItemVisit
          key={item.id}
          id={item.id}
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
        return (
          <h2 className="text-3xl font-semibold text-center mt-4">
            Нет продаж
          </h2>
        );
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
