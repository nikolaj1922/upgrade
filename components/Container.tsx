import { FC } from "react";
import ContainerItem from "./ContainerItem";
import { IVisits } from "@/types/types";
import { doc, updateDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import Circular from "./ui/CircularProgress";

interface ContainerProps {
  visits: IVisits[] | DocumentData[];
}

const Container: FC<ContainerProps> = ({ visits }) => {
  const handleDeleteVisit = async (id: string) => {
    try {
      if (!localStorage.getItem("shiftId")) return;
      const updatedArray = visits.filter((visit) => visit.id !== id);
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
    <div className="bg-white h-full rounded-md p-4 opacity-100 space-y-2">
      {visits ? (
        visits.map((visit) => (
          <ContainerItem
            key={visit.id}
            id={visit.id}
            employee={visit.employee}
            price={visit.price}
            timestamp={visit.timestamp}
            visitType={visit.visitType}
            handleDeleteVisit={handleDeleteVisit}
          />
        ))
      ) : (
        <Circular size={40} className="mt-5" />
      )}
    </div>
  );
};

export default Container;
