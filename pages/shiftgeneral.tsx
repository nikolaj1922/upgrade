import AddAndSortSection from "@/components/AddAndSortSection";
import MainHeader from "@/components/Header";
import Container from "@/components/container/Container";
import GeneralShiftModal from "@/components/modals/GeneralShiftModal";
import { useAppSelector } from "@/hooks/useRedux";
import { db } from "@/lib/firebase";
import { IGeneral } from "@/types/types";
import { doc, onSnapshot } from "firebase/firestore";
import { FC, useState, useEffect } from "react";
import { setGeneralShiftStartSum } from "@/redux/slices/startSumStateSlice";

interface ShiftGeneralProps {}

const ShiftGeneral: FC<ShiftGeneralProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [generalShift, setGeneralShift] = useState<IGeneral[] | null>(null);
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const { generalShiftStartSum } = useAppSelector(
    (state) => state.startSumState
  );

  useEffect(() => {
    const generalShiftSubscribe = () => {
      if (!shiftId) return;
      onSnapshot(doc(db, "work shifts", shiftId), (snapshot) => {
        const data = snapshot.data();
        const generalShiftArray: Array<IGeneral> = data?.generalShift;
        if (!generalShiftArray) return;
        setGeneralShift(generalShiftArray);
      });
    };
    generalShiftSubscribe();

    return () => generalShiftSubscribe();
  }, [db, shiftId]);

  return (
    <main>
      <MainHeader header="Общая касса" />
      <AddAndSortSection
        setIsModalOpen={setIsModalOpen}
        needStartSum
        setStartSum={setGeneralShiftStartSum}
        startSum={generalShiftStartSum}
        updateDocKey="shiftGeneral"
      />
      <Container
        dataType="general"
        generalShift={generalShift as IGeneral[]}
        checkedSum={generalShiftStartSum}
      />
      {isModalOpen && (
        <GeneralShiftModal
          shiftId={shiftId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </main>
  );
};

export default ShiftGeneral;
