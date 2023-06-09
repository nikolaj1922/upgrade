import React from "react";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { IEmployee, PayloadType } from "@/types/types";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { getUniqId, convertDataToTime } from "@/lib/utils";
import { useAppDispatch } from "@/hooks/useRedux";
import {
  addToVisits,
  addToEmployeeSalaryPaint,
  addToPaint,
} from "@/redux/slices/cashboxStateSlice";
import Modal from "@mui/material/Modal";
import MainHeader from "../Header";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "../ui/Button";
import Circular from "../ui/CircularProgress";
import XRedCircleButton from "../ui/XRedCircleButton";
import { addSalary } from "@/redux/slices/salaryStateSlice";

type FormData = {
  visitType: string;
  price: number;
  employee: string;
  payloadType: PayloadType;
  paint: number;
};

interface VisitModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shiftId: string | null;
}

const VisitModal: React.FC<VisitModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  shiftId,
}) => {
  const [allEmployees, setAllEmployees] = React.useState<
    IEmployee[] | DocumentData[]
  >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [validateFormState, setValidateFormState] = React.useState<{
    employeeState: string;
    visitTypeState: string;
    priceState: string;
    payloadTypeState: string;
    paintState: string;
  }>({
    employeeState: "",
    visitTypeState: "",
    priceState: "",
    payloadTypeState: "",
    paintState: "",
  });
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<FormData>();

  React.useEffect(
    () =>
      onSnapshot(collection(db, "employees"), (snapshot) =>
        setAllEmployees(snapshot.docs.map((doc) => doc.data()))
      ),
    [db]
  );

  const handleClose = (): void => setIsModalOpen(false);
  const checkValidateForm = (): boolean =>
    !Boolean(validateFormState.employeeState) ||
    !Boolean(validateFormState.payloadTypeState) ||
    !Boolean(validateFormState.priceState) ||
    !Boolean(validateFormState.visitTypeState) ||
    !Boolean(validateFormState.paintState);

  const handleCreateVisit = async (data: FormData) => {
    try {
      if (!shiftId) return;
      setIsLoading(true);
      const paintId = getUniqId();
      await updateDoc(doc(db, "work shifts", shiftId), {
        visits: arrayUnion({
          id: getUniqId(),
          paintId: paintId,
          ...data,
          timestamp: convertDataToTime(String(new Date())),
        }),
      });
      dispatch(
        addSalary({
          employee: data.employee,
          value: +data.price,
          paintValue: +data.paint,
        })
      );
      dispatch(
        addToVisits({
          type: data.payloadType,
          value: data.price,
        })
      );
      dispatch(
        addToVisits({
          type: "total",
          value: data.price,
        })
      );
      if (data.paint > 0) {
        const paintItem = {
          id: paintId,
          employee: data.employee,
          type: "visit",
          price: data.paint,
          timestamp: convertDataToTime(String(new Date())),
        };
        await updateDoc(doc(db, "work shifts", shiftId), {
          paint: arrayUnion(paintItem),
        });
        dispatch(
          addToPaint({
            type: "total",
            value: data.paint,
          })
        );
        dispatch(
          addToEmployeeSalaryPaint({
            id: paintId,
            employee: data.employee,
            value: data.paint,
          })
        );
      }
      setIsModalOpen(false);
      toast.success("Запись создана.");
    } catch (err) {
      toast.error("Не удалось создать запись.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-slate-100 shadow-md p-4 focus:outline-none rounded-sm flex flex-col">
        <div className="relative">
          <MainHeader header="Новая запись" isModal className="!text-3xl" />
          <XRedCircleButton
            onClick={() => setIsModalOpen(false)}
            className=" ml-9 cursor-pointer absolute top-1.5 right-0"
          />
        </div>
        <form
          className="px-8 space-y-8"
          onSubmit={handleSubmit(handleCreateVisit)}
        >
          <div className="space-y-3">
            <div>
              <div className="modal-group">
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
                    <MenuItem key={employee.id} value={employee.name}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <div className="modal-group">
                <p>Услуга</p>
                <input
                  type="text"
                  className="modal-input"
                  {...register("visitType", {
                    required: true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setValidateFormState((prevState) => ({
                        ...prevState,
                        visitTypeState: e.target.value,
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
                <p>Краска</p>
                <input
                  type="number"
                  className="modal-input"
                  {...register("paint", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setValidateFormState((prevState) => ({
                        ...prevState,
                        paintState: e.target.value,
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
              className="w-[160px]"
              type="submit"
              disabled={checkValidateForm()}
            >
              {isLoading ? <Circular /> : "Создать запись"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default VisitModal;
