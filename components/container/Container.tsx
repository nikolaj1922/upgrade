import { FC } from "react";
import { IVisit, ISale, ISalary, IPaint, IGeneral } from "@/types/types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import ContainerItemVisit from "./ContainerItemVisit";
import ContainerItemSale from "./ContainerItemSale";
import Circular from "../ui/CircularProgress";
import {
  subFromEmployeeSalaryPaint,
  subFromGeneralShift,
  subFromPaint,
  subFromVisits,
} from "@/redux/slices/cashboxStateSlice";
import { subFromSalesMen } from "@/redux/slices/cashboxStateSlice";
import { reduceSalary } from "@/redux/slices/salaryStateSlice";
import ContainerItemSalary from "./ContainerItemSalary";
import ContainerItemPaint from "./ContainerItemPaint";
import ContainerItemGeneral from "./ContainerItemGeneral";

interface ContainerProps {
  visits?: IVisit[];
  salesMen?: ISale[];
  salary?: ISalary[];
  paint?: IPaint[];
  generalShift?: IGeneral[];
  checkedSum?: number;
  dataType: "visits" | "salesMen" | "salary" | "paint" | "general";
}

type SubFrom = "visits" | "salesMen" | "paint" | "general";

const Container: FC<ContainerProps> = ({
  visits,
  salesMen,
  salary,
  paint,
  generalShift,
  dataType,
  checkedSum,
}) => {
  const { shiftId } = useAppSelector((state) => state.shiftState);
  const dispatch = useAppDispatch();

  const subFromCashState = (id: string, subFrom: SubFrom, paintId?: string) => {
    if (subFrom === "general") {
      const deletedElement = generalShift?.find((item) => item.id === id);
      dispatch(subFromGeneralShift(deletedElement?.price!));
    }
    if (subFrom === "visits") {
      const deletedElement = visits?.find((item) => item.id === id);
      dispatch(
        subFromVisits({
          type: deletedElement?.payloadType!,
          value: deletedElement?.price!,
        })
      );
      dispatch(
        subFromVisits({
          type: "total",
          value: deletedElement?.price!,
        })
      );
      if (paintId) {
        dispatch(subFromEmployeeSalaryPaint(paintId));
        dispatch(
          subFromPaint({
            type: "total",
            value: deletedElement?.paint!,
          })
        );
      }
      return;
    }
    if (subFrom === "salesMen") {
      const deletedElement = salesMen?.find((item) => item.id === id);
      dispatch(
        subFromSalesMen({
          type: deletedElement?.payloadType!,
          value: deletedElement?.price!,
        })
      );
      dispatch(
        subFromSalesMen({
          type: "total",
          value: deletedElement?.price!,
        })
      );
      return;
    }
    if (subFrom === "paint") {
      const deletedElement = paint?.find((item) => item.id === id);
      if (deletedElement?.payloadType) {
        dispatch(
          subFromPaint({
            type: deletedElement?.payloadType!,
            value: deletedElement?.price!,
          })
        );
      }
      dispatch(
        subFromPaint({
          type: "total",
          value: deletedElement?.price!,
        })
      );
      return;
    }
  };

  const handleDeleteItem = async (
    id: string,
    paintId?: string,
    employee?: string,
    value?: number
  ) => {
    try {
      if (!shiftId) return;
      if (dataType === "general") {
        const updatedArray = generalShift?.filter((item) => item.id !== id);
        await updateDoc(doc(db, "work shifts", shiftId), {
          generalShift: updatedArray,
        });
        subFromCashState(id, "general");
      }
      if (dataType === "visits") {
        const updatedVisitsArray = visits?.filter((item) => item.id !== id);
        const updatedPaintArray = paint?.filter((item) => item.id !== paintId);
        await updateDoc(doc(db, "work shifts", shiftId), {
          visits: updatedVisitsArray,
          paint: updatedPaintArray,
        });
        subFromCashState(id, "visits", paintId);
        if (employee && value) {
          dispatch(
            reduceSalary({
              employee,
              value,
            })
          );
        }
        toast.success("Запись удалена.");
        return;
      }
      if (dataType === "salesMen") {
        const updatedArray = salesMen?.filter((item) => item.id !== id);
        await updateDoc(doc(db, "work shifts", shiftId), {
          salesMen: updatedArray,
        });
        subFromCashState(id, "salesMen");
        toast.success("Продажа удалена.");
        return;
      }
      if (dataType === "paint") {
        const updatedArray = paint?.filter((item) => item.id !== id);
        await updateDoc(doc(db, "work shifts", shiftId), {
          paint: updatedArray,
        });
        subFromCashState(id, "paint");
        toast.success("Краска удалена.");
        return;
      }
    } catch (err) {
      console.log(err);
      toast.error("Не удалось удалить. Попробуйте еще раз.");
    }
  };

  const render = () => {
    if (dataType === "general") {
      if (!generalShift) return <Circular size={40} className="mt-5" />;
      if (!checkedSum)
        return (
          <h2 className="text-3xl text-center mt-4">
            Для начала работы, укажите сумму на начало смены
          </h2>
        );
      if (!generalShift.length)
        return <h2 className="text-3xl text-center mt-4">Нет записей</h2>;
      return generalShift?.map((item) => (
        <ContainerItemGeneral
          key={item.id}
          id={item.id}
          title={item.title}
          price={item.price}
          timestamp={item.timestamp}
          handleDeleteItem={handleDeleteItem}
        />
      ));
    }
    if (dataType === "paint") {
      if (!paint) return <Circular size={40} className="mt-5" />;
      if (!checkedSum)
        return (
          <h2 className="text-3xl text-center mt-4">
            Для начала работы, укажите сумму на начало смены
          </h2>
        );
      if (!paint.length)
        return <h2 className="text-3xl text-center mt-4">Нет записей</h2>;
      return paint?.map((paint) => (
        <ContainerItemPaint
          key={paint.id}
          paint={paint}
          handleDeleteItem={handleDeleteItem}
        />
      ));
    }
    console.log(checkedSum);

    if (dataType === "salary") {
      if (!salary) return <Circular size={40} className="mt-5" />;
      if (!salary.length)
        return (
          <h2 className="text-3xl text-center mt-4">
            Чтобы узнать зарплату, добавьте записи
          </h2>
        );
      return salary?.map((salary) => (
        <ContainerItemSalary
          key={salary.employee}
          employee={salary.employee}
          revenue={salary.revenue}
        />
      ));
    }
    if (dataType === "visits") {
      if (!visits) return <Circular size={40} className="mt-5" />;
      if (!visits.length)
        return <h2 className="text-3xl text-center mt-4">Нет записей</h2>;
      return visits?.map((item) => (
        <ContainerItemVisit
          key={item.id}
          id={item.id}
          paintId={item.paintId}
          employee={item.employee}
          price={item.price}
          timestamp={item.timestamp}
          visitType={item.visitType}
          handleDeleteItem={handleDeleteItem}
          payloadType={item.payloadType}
        />
      ));
    }
    if (dataType === "salesMen") {
      if (!salesMen) return <Circular size={40} className="mt-5" />;
      if (!checkedSum)
        return (
          <h2 className="text-3xl text-center mt-4">
            Для начала работы, укажите сумму на начало смены
          </h2>
        );
      if (!salesMen.length)
        return <h2 className="text-3xl text-center mt-4">Нет продаж</h2>;
      return salesMen?.map((item) => (
        <ContainerItemSale
          key={item.id}
          id={item.id}
          title={item.title}
          timestamp={item.timestamp}
          price={item.price}
          payloadType={item.payloadType}
          handleDeleteItem={handleDeleteItem}
        />
      ));
    }
  };

  return (
    <div className="bg-white h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {render()}
    </div>
  );
};

export default Container;
