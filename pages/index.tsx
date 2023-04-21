import { FC, useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IVisits } from "@/types/types";
import MainHeader from "@/components/Header";
import Button from "@/components/ui/Button";
import Container from "@/components/Container";
import VisitModal from "@/components/modals/VisitModal";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { sortContainerItems } from "@/lib/utils";

interface servicesProps {}

const Services: FC<servicesProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [visits, setVisits] = useState<IVisits[] | DocumentData[] | undefined>(
    []
  );
  const [shiftId, setShiftId] = useState<string | null>(null);
  const [sortSelect, setSortSelect] = useState<string>("");
  setTimeout(() => setShiftId(localStorage.getItem("shiftId")), 500);

  useEffect(() => {
    const worksShiftSubscribe = () => {
      if (!shiftId) return;
      onSnapshot(doc(db, "work shifts", shiftId), (snapshot) => {
        const data = snapshot.data();
        const visitArray: Array<IVisits> = data?.visits;
        if (!sortSelect) setVisits(visitArray.reverse());
        setVisits(sortContainerItems(sortSelect, visitArray));
      });
    };
    worksShiftSubscribe();
    return () => worksShiftSubscribe();
  }, [db, shiftId, sortSelect]);

  const handleSetSelect = (e: SelectChangeEvent) =>
    setSortSelect(e.target.value);

  return (
    <main className="bg-zinc-200/97 rounded-md w-full p-8 flex flex-col space-y-4">
      <MainHeader header="Записи" />
      <div className="flex justify-start items-center space-x-8">
        <Button className="space-x-2" onClick={() => setIsModalOpen(true)}>
          <span>Добавить</span>
          <PlusIcon className="w-5 h-5" />
        </Button>
        <div className="space-x-4">
          <span className="text-2xl font-semibold">Сортировать:</span>
          <FormControl>
            <Select
              defaultValue=""
              displayEmpty
              sx={{ height: "35px", width: "160px" }}
              onChange={handleSetSelect}
            >
              <MenuItem value="">Не выбрано</MenuItem>
              <MenuItem value="employees">Мастера</MenuItem>
              <MenuItem value="payload">Тип оплаты</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <Container visits={visits} />
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

export default Services;
