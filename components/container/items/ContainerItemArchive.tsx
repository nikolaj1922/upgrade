import React from "react";
import { db } from "@/lib/firebase";
import { IArchiveData } from "@/types/types";
import { collection, onSnapshot } from "firebase/firestore";
import { IAdmin } from "@/types/types";
import { getFullDate } from "@/lib/utils";

interface ContainerArchiveProps {
  data: IArchiveData;
}

const ContainerItemArchive: React.FC<ContainerArchiveProps> = ({ data }) => {
  const [allAdmins, setAllAdmins] = React.useState<IAdmin[] | null>(null);

  React.useEffect(
    () =>
      onSnapshot(collection(db, "admins"), (snapshot) => {
        setAllAdmins(snapshot.docs.map((doc) => doc.data() as IAdmin));
      }),
    [db]
  );

  return (
    <div className="flex flex-col space-y-2">
      <p>
        Время открытия:{" "}
        <span className="font-semibold">{getFullDate(data.timestamp)}</span>
      </p>
      <p>
        Администратор:{" "}
        <span className="font-semibold">
          {allAdmins?.find((admin) => admin.uid === data.admin)?.name!}
        </span>
      </p>
      <div>
        <p>Отчет о смене: </p>
        <div className="flex space-x-4">
          <div className="basis-1/4">
            <p className="font-semibold">Записи:</p>
            <p>
              Наличные:{" "}
              <span className="font-semibold">
                {data.visits
                  .filter((visit) => visit.payloadType === "cash")
                  .reduce((acc, visit) => +visit.price + acc, 0)}
              </span>
            </p>
            <p>
              Карта:{" "}
              <span className="font-semibold">
                {data.visits
                  .filter((visit) => visit.payloadType === "card")
                  .reduce((acc, visit) => +visit.price + acc, 0)}
              </span>
            </p>
            <p>
              Каспи:{" "}
              <span className="font-semibold">
                {data.visits
                  .filter((visit) => visit.payloadType === "kaspi")
                  .reduce((acc, visit) => +visit.price + acc, 0)}
              </span>
            </p>
            <p>
              Итого:{" "}
              <span className="font-semibold">
                {data.visits.reduce((acc, visit) => +visit.price + acc, 0)}
              </span>
            </p>
          </div>
          <div className="basis-1/4">
            <p className="font-semibold">Продажи М:</p>
            <p>
              Начало смены:{" "}
              <span className="font-semibold">{data.salesMStartSum}</span>
            </p>
            <p>
              Конец смены:{" "}
              <span className="font-semibold">{data.salesMEndSum}</span>
            </p>
            <p>
              Наличные:{" "}
              <span className="font-semibold">
                {data.salesMen
                  .filter((sale) => sale.payloadType === "cash")
                  .reduce((acc, sale) => +sale.price + acc, 0)}
              </span>
            </p>
            <p>
              Карта:{" "}
              <span className="font-semibold">
                {data.salesMen
                  .filter((sale) => sale.payloadType === "card")
                  .reduce((acc, sale) => +sale.price + acc, 0)}
              </span>
            </p>
            <p>
              Каспи:{" "}
              <span className="font-semibold">
                {data.salesMen
                  .filter((sale) => sale.payloadType === "kaspi")
                  .reduce((acc, sale) => +sale.price + acc, 0)}
              </span>
            </p>
          </div>
          <div className="basis-1/4">
            <p className="font-semibold">Краска:</p>
            <p>
              Начало смены:{" "}
              <span className="font-semibold">{data.paintStartSum}</span>
            </p>
            <p>
              Конец смены:{" "}
              <span className="font-semibold">{data.paintEndSum}</span>
            </p>
            <p>
              Для услуг:{" "}
              <span className="font-semibold">
                {data.paint
                  .filter((paint) => paint.employee)
                  .reduce((acc, paint) => +paint.price + acc, 0)}
              </span>
            </p>
            <p>Продажи:</p>
            <p>
              Наличные:{" "}
              <span className="font-semibold">
                {data.paint
                  .filter((paint) => paint.payloadType === "cash")
                  .reduce((acc, paint) => +paint.price + acc, 0)}
              </span>
            </p>
            <p>
              Карта:{" "}
              <span className="font-semibold">
                {data.paint
                  .filter((paint) => paint.payloadType === "card")
                  .reduce((acc, paint) => +paint.price + acc, 0)}
              </span>
            </p>
            <p>
              Каспи:{" "}
              <span className="font-semibold">
                {data.paint
                  .filter((paint) => paint.payloadType === "kaspi")
                  .reduce((acc, paint) => +paint.price + acc, 0)}
              </span>
            </p>
          </div>
          <div className="basis-1/4">
            <p className="font-semibold">Общая касса:</p>
            <p>
              Начало смены:{" "}
              <span className="font-semibold">{data.shiftGeneralStartSum}</span>
            </p>
            <p>
              Конец смены:{" "}
              <span className="font-semibold">{data.shiftGeneralEndSum}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerItemArchive;
