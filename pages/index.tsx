import { FC, useState, useEffect } from "react";
import MainHeader from "@/components/Header";
import Button from "@/components/ui/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import Container from "@/components/Container";
import VisitModal from "@/components/modals/VisitModal";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IVisits } from "@/types/types";

interface servicesProps {}

const Services: FC<servicesProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [visits, setVisits] = useState<IVisits[] | DocumentData[]>([]);
  const [shiftId, setShiftId] = useState<string | null>(null);

  setTimeout(() => setShiftId(localStorage.getItem("shiftId")), 500);

  useEffect(() => {
    const worksShiftSubscribe = () => {
      if (!shiftId) return;
      onSnapshot(doc(db, "work shifts", shiftId! as string), (snapshot) => {
        const data = snapshot.data();
        setVisits(data?.visits);
      });
    };
    worksShiftSubscribe();
    return () => worksShiftSubscribe();
  }, [db, shiftId]);

  return (
    <main className="bg-zinc-200/97 rounded-md w-full p-8 flex flex-col space-y-4">
      <MainHeader header="Записи" />
      <Button className="bg-green-400 hover:bg-green-500 md:w-[130px] py-2">
        <div
          className="flex justify-center items-center space-x-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span>Добавить</span>
          <PlusIcon className="w-5 h-5" />
        </div>
      </Button>
      <Container visits={visits} />
      {isModalOpen && (
        <VisitModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </main>
  );
};

export default Services;
