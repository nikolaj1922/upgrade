import { FC } from "react";
import { IVisits } from "@/types/types";
import { doc, updateDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import ContainerItem from "./ContainerItem";
import Circular from "./ui/CircularProgress";

interface ContainerProps {
  visits: IVisits[] | DocumentData[] | undefined;
}

const Container: FC<ContainerProps> = ({ visits }) => {
  const handleDeleteVisit = async (id: string) => {
    try {
      if (!localStorage.getItem("shiftId")) return;
      const updatedArray = visits?.filter((visit) => visit.id !== id);
      await updateDoc(
        doc(db, "work shifts", localStorage.getItem("shiftId") as string),
        {
          visits: updatedArray,
        }
      );
      toast.success("Запись удалена.");
    } catch (err) {
      toast.error("Не удалось удалить запись.");
    }
  };

  return (
    <div className="bg-white h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {!visits && <Circular size={40} className="mt-5" />}
      {visits?.length ? (
        visits.map((visit) => (
          <ContainerItem
            key={visit.id}
            id={visit.id}
            employee={visit.employee}
            price={visit.price}
            timestamp={visit.timestamp}
            visitType={visit.visitType}
            handleDeleteVisit={handleDeleteVisit}
            payloadType={visit.payloadType}
          />
        ))
      ) : (
        <h2 className="text-3xl font-semibold text-center mt-4">Нет записей</h2>
      )}
    </div>
  );
};

export default Container;
