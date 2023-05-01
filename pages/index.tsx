import React from "react";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IPaint, IVisit } from "@/types/types";
import { useAppSelector } from "@/hooks/useRedux";
import MainHeader from "@/components/Header";
import VisitModal from "@/components/modals/VisitModal";
import AddAndSortSection from "@/components/AddAndSortSection";
import ContainerVisits from "@/components/container/containers/ContainerVisits";

interface ServicesProps {}

const Visits: React.FC<ServicesProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [visits, setVisits] = React.useState<IVisit[] | DocumentData[] | null>(null);
  const [sortSelect, setSortSelect] = React.useState<string>("");
  const [paint, setPaint] = React.useState<IPaint[] | null>(null);
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

  React.useEffect(() => {
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

  React.useEffect(() => {
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
      <ContainerVisits visits={visits as IVisit[]} paint={paint as IPaint[]} />
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
