import React from "react";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import {
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { convertDataToTime, getUniqId } from "@/lib/utils";
import { addToPaint } from "@/redux/slices/cashboxStateSlice";
import { useAppDispatch } from "@/hooks/useRedux";
import { PayloadType } from "@/types/types";
import Modal from "@mui/material/Modal";
import MainHeader from "../Header";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "../ui/Button";
import Circular from "../ui/CircularProgress";
import XRedCircleButton from "../ui/XRedCircleButton";

type FormData = {
  type: string;
  title?: string;
  employee?: string;
  price: number;
  payloadType: PayloadType;
};

interface PaintModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shiftId: string | null;
}

const PaintModal: React.FC<PaintModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  shiftId,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [validateFormState, setValidateFormState] = React.useState<{
    titleState: string;
    priceState: string;
    payloadTypeState: string;
  }>({
    titleState: "",
    priceState: "",
    payloadTypeState: "",
  });
  const { register, handleSubmit } = useForm<FormData>();
  const dispatch = useAppDispatch();

  const handleClose = (): void => setIsModalOpen(false);
  const checkValidateForm = () => {
    return (
      !Boolean(validateFormState.titleState) ||
      !Boolean(validateFormState.priceState) ||
      !Boolean(validateFormState.payloadTypeState)
    );
  };

  const handleCreatePaint = async (data: FormData) => {
    try {
      if (!shiftId) return;
      setIsLoading(true);
      await updateDoc(doc(db, "work shifts", shiftId), {
        paint: arrayUnion({
          id: getUniqId(),
          ...data,
          timestamp: convertDataToTime(String(new Date())),
        }),
      });
      dispatch(
        addToPaint({
          type: data.payloadType,
          value: data.price,
        })
      );
      dispatch(
        addToPaint({
          type: "total",
          value: data.price,
        })
      );
      setIsModalOpen(false);
      toast.success("Краска добавлена.");
    } catch (err) {
      toast.error("Не удалось добавить краску.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-slate-100 shadow-md p-4 focus:outline-none rounded-sm flex flex-col">
        <div className="relative">
          <MainHeader header="Добавить запись" isModal className="!text-3xl" />
          <XRedCircleButton
            onClick={() => setIsModalOpen(false)}
            className=" ml-9 cursor-pointer absolute top-1.5 right-0"
          />
        </div>
        <form
          className="px-8 space-y-8"
          onSubmit={handleSubmit(handleCreatePaint)}
        >
          <div className="space-y-3">
            <div>
              <div className="modal-group">
                <p>Наименование</p>
                <input
                  type="text"
                  className="modal-input"
                  {...register("title", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setValidateFormState((prevState) => ({
                        ...prevState,
                        titleState: e.target.value,
                      }));
                    },
                  })}
                />
              </div>
            </div>
            <div>
              <div className="modal-group">
                <p>Цена</p>
                <input
                  type="number"
                  className="modal-input"
                  {...register("price", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setValidateFormState((prevState) => ({
                        ...prevState,
                        priceState: e.target.value,
                      }));
                    },
                  })}
                />
              </div>
            </div>
            <div>
              <div className="modal-group">
                <p>Тип оплаты</p>
                <Select
                  defaultValue=""
                  displayEmpty
                  sx={{ height: "30px", width: "160px" }}
                  {...register("payloadType", {
                    onChange: (e: SelectChangeEvent) => {
                      setValidateFormState((prevState) => ({
                        ...prevState,
                        payloadTypeState: e.target.value,
                      }));
                    },
                  })}
                >
                  <MenuItem value="cash">Наличные</MenuItem>
                  <MenuItem value="card">Карта</MenuItem>
                  <MenuItem value="kaspi">Каспи Банк</MenuItem>
                </Select>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button
              className="w-[170px]"
              type="submit"
              disabled={checkValidateForm()}
            >
              {isLoading ? <Circular /> : "Добавить"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PaintModal;
