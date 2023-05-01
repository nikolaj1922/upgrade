import MainHeader from "@/components/Header";
import React from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { getFullDate } from "@/lib/utils";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IArchiveData } from "@/types/types";
import { ContainerArchive } from "@/components/container/containers";

interface ArchiveProps {}

const Archive: React.FC<ArchiveProps> = ({}) => {
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs(getFullDate(String(new Date()), true))
  );
  const [archiveData, setArchiveData] = React.useState<IArchiveData[] | null>(
    null
  );

  const day = value?.date()! < 9 ? `0${value?.date()}` : value?.date();
  const month =
    value?.month()! + 1 < 9 ? `0${value?.month()! + 1}` : value?.month()! + 1;
  const year = value?.year();

  React.useEffect(() => {
    const getCurrentShiftData = async () => {
      setArchiveData(null);
      const collectionRef = collection(db, "work shifts");
      const q = query(
        collectionRef,
        where("archiveTimestamp", "==", `${year}-${month}-${day}`)
      );
      const doc = await getDocs(q);
      setArchiveData(doc.docs.map((doc) => doc.data() as IArchiveData));
    };

    getCurrentShiftData();
  }, [value]);

  return (
    <main>
      <MainHeader header="Архив смен" />
      <div className="flex space-x-5 h-full">
        <DateCalendar
          className="!m-0 !w-[45%]"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
        <ContainerArchive archiveData={archiveData as IArchiveData[]} />
      </div>
    </main>
  );
};

export default Archive;
