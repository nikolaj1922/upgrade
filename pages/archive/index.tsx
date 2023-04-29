import MainHeader from "@/components/Header";
import { FC, useState, useEffect } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { getFullDate } from "@/lib/utils";
import Container from "@/components/container/Container";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IArchiveData } from "@/types/types";

interface ArchiveProps {}

const Archive: FC<ArchiveProps> = ({}) => {
  const [value, setValue] = useState<Dayjs | null>(
    dayjs(getFullDate(String(new Date()), true))
  );
  const [archiveData, setArchiveData] = useState<IArchiveData[] | null>(null);

  const day = value?.date();
  const month =
    value?.month()! + 1 < 9 ? `0${value?.month()! + 1}` : value?.month()! + 1;
  const year = value?.year();

  useEffect(() => {
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
        <Container
          dataType="archive"
          archiveData={archiveData as IArchiveData[]}
        />
      </div>
    </main>
  );
};

export default Archive;
