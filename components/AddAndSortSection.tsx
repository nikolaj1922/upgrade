import Button from "@/components/ui/Button";
import {
  CheckCircleIcon,
  PlusIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FC, SetStateAction, Dispatch, useState, useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import {
  setGeneralShiftStartSum,
  setPaintStartSum,
  setSalesMStartSum,
} from "@/redux/slices/startSumStateSlice";

interface AddAndSortSectionProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setSortSelect?: Dispatch<SetStateAction<string>>;
  sortItems?: {
    value: string;
    title: string;
  }[];
  needStartSum?: boolean;
  startSum?: number;
  setStartSum?: ActionCreatorWithPayload<number>;
  updateDocKey?: "salesM" | "paint" | "shiftGeneral";
}

const AddAndSortSection: FC<AddAndSortSectionProps> = ({
  setIsModalOpen,
  setSortSelect,
  sortItems,
  startSum,
  setStartSum,
  needStartSum,
  updateDocKey,
}) => {
  const handleSetSelect = (e: SelectChangeEvent) => {
    if (setSortSelect) setSortSelect(e.target.value);
  };
  const [isChangeSum, setIsChangeSum] = useState<boolean>(false);
  const [currentSum, setCurrentSum] = useState<number>(0);
  const buttonChangeSumRef = useRef<HTMLButtonElement | null>(null);
  const inputChangeSumRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const { shiftId } = useAppSelector((state) => state.shiftState);

  const handleClickOutside = () => setIsChangeSum(false);

  useOnClickOutside(
    inputChangeSumRef,
    () => handleClickOutside(),
    buttonChangeSumRef
  );

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!shiftId) return;
      setStartSum && dispatch(setStartSum(currentSum));
      setIsChangeSum(false);
      if (updateDocKey === "paint") {
        dispatch(setPaintStartSum(currentSum));
        await updateDoc(doc(db, "work shifts", shiftId), {
          paintStartSum: currentSum,
        });
      }
      if (updateDocKey === "salesM") {
        dispatch(setSalesMStartSum(currentSum));
        await updateDoc(doc(db, "work shifts", shiftId), {
          salesMStartSum: currentSum,
        });
      }
      if (updateDocKey === "shiftGeneral") {
        dispatch(setGeneralShiftStartSum(currentSum));
        await updateDoc(doc(db, "work shifts", shiftId), {
          shiftGeneralStartSum: currentSum,
        });
      }
    } catch (err) {
      toast.error("Не удалось установить значение");
    } finally {
    }
  };

  return (
    <>
      <div className="flex justify-start items-center space-x-8">
        <Button
          className="space-x-2"
          onClick={() => setIsModalOpen(true)}
          disabled={needStartSum ? !startSum : false}
        >
          <span>Добавить</span>
          <PlusIcon className="w-5 h-5" />
        </Button>
        {sortItems && (
          <div className="space-x-4">
            <span className="text-2xl">Сортировать:</span>
            <FormControl>
              <Select
                defaultValue=""
                displayEmpty
                sx={{ height: "35px", width: "160px" }}
                onChange={handleSetSelect}
              >
                {sortItems.map((item) => (
                  <MenuItem key={item.title} value={item.value}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}
      </div>
      {needStartSum && (
        <div className="flex items-center space-x-4">
          <h2 className="text-lg">Сумма на начало смены:</h2>
          {isChangeSum ? (
            <form className="relative" onSubmit={handleSubmit}>
              <input
                ref={inputChangeSumRef}
                type="number"
                className="pl-2 w-[100px] rounded focus:outline-none border-b border-r shadow-sm border-zinc-300"
                autoFocus
                onChange={(e) => {
                  setCurrentSum(+e.target.value);
                }}
                value={currentSum ? currentSum : ""}
              />
              <button type="submit" ref={buttonChangeSumRef}>
                <CheckCircleIcon className="w-6 h-6 text-green-500 cursor-pointer hover:text-green-600 absolute -right-7 top-0 transition duration-150" />
              </button>
            </form>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">{startSum}</span>
              <PencilIcon
                className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-600 transition duration-150"
                onClick={() => setIsChangeSum(true)}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AddAndSortSection;
