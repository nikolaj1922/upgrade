import { FC, useState, SetStateAction, Dispatch } from "react";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { convertDataToTime, getUniqId } from "@/lib/utils";
import { addToSalesMen } from "@/redux/slices/cashboxStateSlice";
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
  title: string;
  price: number;
  payloadType: PayloadType;
};

interface SaleModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  shiftId: string | null;
}

const SaleModal: FC<SaleModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  shiftId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validateFormState, setValidateFormState] = useState<{
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
  const checkValidateForm = (): boolean =>
    !Boolean(validateFormState.payloadTypeState) ||
    !Boolean(validateFormState.priceState) ||
    !Boolean(validateFormState.titleState);

  const handleCreateSale = async (data: FormData) => {
    try {
      if (!shiftId) return;
      setIsLoading(true);
      await updateDoc(doc(db, "work shifts", shiftId), {
        salesMen: arrayUnion({
          id: getUniqId(),
          ...data,
          timestamp: convertDataToTime(String(new Date())),
        }),
      });
      dispatch(
        addToSalesMen({
          type: data.payloadType,
          value: data.price,
        })
      );
      dispatch(
        addToSalesMen({
          type: "total",
          value: data.price,
        })
      );
      setIsModalOpen(false);
      toast.success("Продажа создана.");
    } catch (err) {
      toast.error("Не удалось создать продажу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-slate-100 shadow-md p-4 focus:outline-none rounded-sm flex flex-col">
        <div className="relative">
          <MainHeader header="Новая продажа" isModal className="!text-3xl" />
          <XRedCircleButton
            onClick={() => setIsModalOpen(false)}
            className=" ml-9 cursor-pointer absolute top-1.5 right-0"
          />
        </div>
        <form
          className="px-8 space-y-8"
          onSubmit={handleSubmit(handleCreateSale)}
        >
          <div className="space-y-3">
            <div>
              <div className="modal-group">
                <p>Наименование</p>
                <input
                  type="text"
                  className="modal-input"
                  {...register("title", {
                    required: true,
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
              {isLoading ? <Circular /> : "Создать продажу"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SaleModal;
