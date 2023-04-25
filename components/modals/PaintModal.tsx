import { FC, useState, SetStateAction, Dispatch, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import {
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  collection,
  DocumentData,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { convertDataToTime, getUniqId } from "@/lib/utils";
import { addToGeneral, addToPaint } from "@/redux/slices/cashboxStateSlice";
import { useAppDispatch } from "@/hooks/useRedux";
import { IEmployee, PayloadType } from "@/types/types";
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
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  shiftId: string | null;
}

const PaintModal: FC<PaintModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  shiftId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paintType, setPaintType] = useState<string>("visit");
  const [validateFormState, setValidateFormState] = useState<{
    typeState: string;
    employeeState: string;
    titleState: string;
    priceState: string;
    payloadTypeState: string;
  }>({
    typeState: "visit",
    employeeState: "",
    titleState: "",
    priceState: "",
    payloadTypeState: "",
  });
  const [allEmployees, setAllEmployees] = useState<
    IEmployee[] | DocumentData[]
  >([]);
  const { register, handleSubmit } = useForm<FormData>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const employeesSubscribe = (): void => {
      onSnapshot(collection(db, "employees"), (snapshot) => {
        setAllEmployees(snapshot.docs.map((doc) => doc.data()));
      });
    };
    employeesSubscribe();
    return () => employeesSubscribe();
  }, [db]);

  const handleClose = (): void => setIsModalOpen(false);
  const checkValidateForm = () => {
    if (paintType === "visit") {
      return (
        !Boolean(validateFormState.typeState) ||
        !Boolean(validateFormState.employeeState) ||
        !Boolean(validateFormState.priceState)
      );
    }
    if (paintType === "sale") {
      return (
        !Boolean(validateFormState.typeState) ||
        !Boolean(validateFormState.titleState) ||
        !Boolean(validateFormState.priceState) ||
        !Boolean(validateFormState.payloadTypeState)
      );
    }
  };

  const handleCreatePaint = async (data: FormData) => {
    try {
      let paintItem;
      if (data.type === "visit") {
        paintItem = {
          id: getUniqId(),
          employee: data.employee,
          type: data.type,
          price: data.price,
          timestamp: convertDataToTime(String(new Date())),
        };
      }
      if (data.type === "sale") {
        paintItem = {
          id: getUniqId(),
          title: data.title,
          type: data.type,
          payloadType: data.payloadType,
          price: data.price,
          timestamp: convertDataToTime(String(new Date())),
        };
      }
      if (!shiftId) return;
      setIsLoading(true);
      await updateDoc(doc(db, "work shifts", shiftId), {
        paint: arrayUnion(paintItem),
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
      dispatch(
        addToGeneral({
          type: data.payloadType,
          value: data.price,
        })
      );
      dispatch(
        addToGeneral({
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
          <MainHeader header="Добавить краску" isModal className="!text-3xl" />
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
              <div className="visitModal-group">
                <p>Тип</p>
                <Select
                  defaultValue="visit"
                  displayEmpty
                  sx={{ height: "30px", width: "160px" }}
                  {...register("type", {
                    onChange: (e: SelectChangeEvent) => {
                      setPaintType(e.target.value);
                      setValidateFormState((prevState) => ({
                        ...prevState,
                        employeeState: "",
                        typeState: e.target.value,
                      }));
                    },
                  })}
                >
                  <MenuItem value="visit">Услуга</MenuItem>
                  <MenuItem value="sale">Продажа</MenuItem>
                </Select>
              </div>
            </div>
            {paintType === "visit" && (
              <div>
                <div className="visitModal-group">
                  <p>Мастер</p>
                  <Select
                    defaultValue=""
                    displayEmpty
                    sx={{ height: "30px", width: "160px" }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          height: "200px",
                        },
                      },
                    }}
                    {...register("employee", {
                      required: true,
                      onChange: (e: SelectChangeEvent) => {
                        setValidateFormState((prevState) => ({
                          ...prevState,
                          employeeState: e.target.value,
                        }));
                      },
                    })}
                  >
                    {allEmployees.map((employee) => (
                      <MenuItem key={employee.name} value={employee.name}>
                        {employee.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            )}
            {paintType === "sale" && (
              <div>
                <div className="visitModal-group">
                  <p>Наименование</p>
                  <input
                    type="text"
                    className="visitModal-input"
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
            )}
            <div>
              <div className="visitModal-group">
                <p>Цена</p>
                <input
                  type="number"
                  className="visitModal-input"
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
            {paintType === "sale" && (
              <div>
                <div className="visitModal-group">
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
            )}
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
