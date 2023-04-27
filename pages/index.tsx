import { FC, useState, useEffect } from "react";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IPaint, IVisit } from "@/types/types";
import { useAppSelector } from "@/hooks/useRedux";
import MainHeader from "@/components/Header";
import Container from "@/components/container/Container";
import VisitModal from "@/components/modals/VisitModal";
import AddAndSortSection from "@/components/AddAndSortSection";

interface ServicesProps {}

const Visits: FC<ServicesProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [visits, setVisits] = useState<IVisit[] | DocumentData[] | null>(null);
  const [sortSelect, setSortSelect] = useState<string>("");
  const [paint, setPaint] = useState<IPaint[] | null>(null);
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const sortData = [
    { value: "", title: "Не выбрано" },
    {
      value: "employees",
      title: "Мастера",
    },
    {
      value: "payload",
      title: "Тип оплаты",
    },
  ];

  const sortVisits = (sortSetting: string, visits: IVisit[]) => {
    if (!sortSetting) return visits;
    if (sortSetting === "employees") {
      const sortedArray = visits.sort((a, b) =>
        a.employee.localeCompare(b.employee)
      );
      return sortedArray;
    }
    if (sortSetting === "payload") {
      const sortedArray = visits.sort((a, b) =>
        a.payloadType.localeCompare(b.payloadType)
      );
      return sortedArray;
    }
    return visits;
  };

  useEffect(() => {
    const paintSubscribe = () => {
      if (!shiftId) return;
      onSnapshot(doc(db, "work shifts", shiftId), (snapshot) => {
        const data = snapshot.data();
        const dataPaintArray: Array<IPaint> = data?.paint;
        if (!dataPaintArray) return;
        setPaint(dataPaintArray.reverse());
      });
    };
    paintSubscribe();

    return () => paintSubscribe();
  }, [db, shiftId, sortSelect]);

  useEffect(() => {
    const worksShiftSubscribe = () => {
      if (!shiftId) return;
      onSnapshot(doc(db, "work shifts", shiftId), (snapshot) => {
        const data = snapshot.data();
        const visitArray: Array<IVisit> = data?.visits;
        if (!visitArray) return;
        if (!sortSelect) {
          setVisits(visitArray.reverse());
          return;
        }
        setVisits(sortVisits(sortSelect, visitArray));
      });
    };
    worksShiftSubscribe();
    return () => worksShiftSubscribe();
  }, [db, shiftId, sortSelect]);

  return (
    <main>
      <MainHeader header="Записи" />
      <AddAndSortSection
        setIsModalOpen={setIsModalOpen}
        setSortSelect={setSortSelect}
        sortItems={sortData}
      />
      <Container
        visits={visits as IVisit[]}
        paint={paint as IPaint[]}
        dataType="visits"
      />
      {isModalOpen && (
        <VisitModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          shiftId={shiftId}
        />
      )}
    </main>
  );
};

export default Visits;
