import React from "react";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { ISale } from "@/types/types";
import { db } from "@/lib/firebase";
import { useAppSelector } from "@/hooks/useRedux";
import MainHeader from "@/components/Header";
import AddAndSortSection from "@/components/AddAndSortSection";
import SaleModal from "@/components/modals/SaleModal";
import { setSalesMStartSum } from "@/redux/slices/startSumStateSlice";
import {
  ContainerSale,
} from "@/components/container/containers";

interface salesProps {}

const Sales: React.FC<salesProps> = ({}) => {
  const [sales, setSales] = React.useState<ISale[] | DocumentData[] | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [sortSelect, setSortSelect] = React.useState<string>("");
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
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const { salesMStartSum } = useAppSelector((state) => state.startSumState);

  const sortSales = (sortSetting: string, sales: ISale[]): ISale[] => {
    if (!sortSetting) return sales;
    if (sortSetting === "price") {
      const sortedArray = sales.sort((a, b) => +a.price - +b.price);
      return sortedArray;
    }
    if (sortSetting === "payload") {
      const sortedArray = sales.sort((a, b) =>
        a.payloadType.localeCompare(b.payloadType)
      );
      return sortedArray;
    }
    return sales;
  };

  React.useEffect(() => {
    const salesSubscribe = () => {
      if (!shiftId) return;
      onSnapshot(doc(db, "work shifts", shiftId), (snapshot) => {
        const data = snapshot.data();
        const salesArray: Array<ISale> = data?.salesMen;
        if (!salesArray) return;
        if (!sortSelect) {
          setSales(salesArray.reverse());
          return;
        }
        setSales(sortSales(sortSelect, salesArray));
      });
    };
    salesSubscribe();

    return () => salesSubscribe();
  }, [db, shiftId, sortSelect]);

  return (
    <main>
      <MainHeader header="Продажи М" />
      <AddAndSortSection
        setIsModalOpen={setIsModalOpen}
        setSortSelect={setSortSelect}
        sortItems={sortData}
        needStartSum
        startSum={salesMStartSum}
        setStartSum={setSalesMStartSum}
        updateDocKey="salesM"
      />
      <ContainerSale salesMen={sales as ISale[]} checkedSum={salesMStartSum} />
      {isModalOpen && (
        <SaleModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          shiftId={shiftId}
        />
      )}
    </main>
  );
};

export default Sales;
