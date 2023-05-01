import React from "react";
import AddAndSortSection from "@/components/AddAndSortSection";
import MainHeader from "@/components/Header";
import PaintModal from "@/components/modals/PaintModal";
import { useAppSelector } from "@/hooks/useRedux";
import { db } from "@/lib/firebase";
import { IPaint } from "@/types/types";
import { doc, onSnapshot } from "firebase/firestore";
import { setPaintStartSum } from "@/redux/slices/startSumStateSlice";
import { ContainerPaint } from "@/components/container/containers";

interface DyeProps {}

const Paint: React.FC<DyeProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [sortSelect, setSortSelect] = React.useState<string>("");
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const [paint, setPaint] = React.useState<IPaint[] | null>(null);
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

  React.useEffect(() => {
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
      <ContainerPaint paint={paint as IPaint[]} checkedSum={paintStartSum} />
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
