import AddAndSortSection from "@/components/AddAndSortSection";
import MainHeader from "@/components/Header";
import Container from "@/components/container/Container";
import PaintModal from "@/components/modals/PaintModal";
import { useAppSelector } from "@/hooks/useRedux";
import { db } from "@/lib/firebase";
import { IPaint } from "@/types/types";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { FC, useState, useEffect } from "react";

interface dyeProps {}

const Paint: FC<dyeProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortSelect, setSortSelect] = useState<string>("");
  const [paint, setPaint] = useState<IPaint[] | DocumentData[] | null>(null);
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const { paintTotal } = useAppSelector((state) => state.cashboxState);

  console.log(paintTotal);

  const sortData = [
    { value: "", title: "Не выбрано" },
    {
      value: "price",
      title: "Цена",
    },
    {
      value: "payload",
      title: "Тип оплаты",
    },
  ];

  console.log(paint);

  useEffect(() => {
    const paintSubscribe = () => {
      if (!shiftId) return;
      onSnapshot(doc(db, "work shifts", shiftId), (snapshot) => {
        const data = snapshot.data();
        const paintArray: Array<IPaint> = data?.paint;
        if (!paintArray) return;
        setPaint(paintArray.reverse());
      });
    };
    paintSubscribe();

    return () => paintSubscribe();
  }, [db, shiftId]);

  return (
    <main>
      <MainHeader header="Краска" />
      <AddAndSortSection
        setIsModalOpen={setIsModalOpen}
        setSortSelect={setSortSelect}
        sortItems={sortData}
      />
      <Container dataType="paint" paint={paint as IPaint[]} />
      {isModalOpen && (
        <PaintModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          shiftId={shiftId}
        />
      )}
    </main>
  );
};

export default Paint;
