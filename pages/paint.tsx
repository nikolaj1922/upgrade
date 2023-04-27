import AddAndSortSection from "@/components/AddAndSortSection";
import MainHeader from "@/components/Header";
import Container from "@/components/container/Container";
import PaintModal from "@/components/modals/PaintModal";
import { useAppSelector } from "@/hooks/useRedux";
import { db } from "@/lib/firebase";
import { IPaint } from "@/types/types";
import { doc, onSnapshot } from "firebase/firestore";
import { FC, useState, useEffect } from "react";
import { setPaintStartSum } from "@/redux/slices/startSumStateSlice";

interface DyeProps {}

const Paint: FC<DyeProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortSelect, setSortSelect] = useState<string>("");
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const [paint, setPaint] = useState<IPaint[] | null>(null);
  const { paintStartSum } = useAppSelector((state) => state.startSumState);

  const sortData = [
    { value: "", title: "Не выбрано" },
    {
      value: "type",
      title: "Тип",
    },
  ];

  const sortPaint = (sortSetting: string, paint: IPaint[]): IPaint[] => {
    if (!sortSetting) return paint;
    if (sortSetting === "type") {
      console.log("sort");
      const sortedArray = paint.sort((a, b) =>
        a.payloadType.localeCompare(b.payloadType)
      );
      return sortedArray;
    }
    return paint;
  };

  useEffect(() => {
    const paintSubscribe = () => {
      if (!shiftId) return;
      onSnapshot(doc(db, "work shifts", shiftId), (snapshot) => {
        const data = snapshot.data();
        const dataPaintArray: Array<IPaint> = data?.paint;
        if (!dataPaintArray) return;
        if (!sortSelect) {
          setPaint(dataPaintArray.reverse());
        }
        setPaint(sortPaint(sortSelect, dataPaintArray));
      });
    };
    paintSubscribe();

    return () => paintSubscribe();
  }, [db, shiftId, sortSelect]);

  return (
    <main>
      <MainHeader header="Краска" />
      <AddAndSortSection
        setIsModalOpen={setIsModalOpen}
        setSortSelect={setSortSelect}
        sortItems={sortData}
        needStartSum
        startSum={paintStartSum}
        setStartSum={setPaintStartSum}
        updateDocKey="paint"
      />
      <Container
        dataType="paint"
        paint={paint as IPaint[]}
        checkedSum={paintStartSum}
      />
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
