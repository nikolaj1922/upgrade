import { FC } from "react";
import MainHeader from "@/components/Header";
import CashBoxAccordion from "@/components/CashBoxAccordion";
import { useAppDispatch } from "@/hooks/useRedux";
import { addToGeneral } from "@/redux/slices/cashboxStateSlice";

interface cashboxProps {}

const cashbox: FC<cashboxProps> = ({}) => {
  const dispatch = useAppDispatch();

  return (
    <main>
      <MainHeader header="Касса" />
      <button
        onClick={() => {
          dispatch(addToGeneral({ type: "total", value: 100 }));
        }}
      >
        +100 to general total
      </button>
      <CashBoxAccordion />
    </main>
  );
};

export default cashbox;
