import {
  FC,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
  useRef,
} from "react";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { IEmployee } from "@/types/types";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { getUniqId } from "@/lib/utils";
import Modal from "@mui/material/Modal";
import MainHeader from "../Header";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "../ui/Button";
import Circular from "../ui/CircularProgress";
import XRedCircleButton from "../ui/XRedCircleButton";

type FormData = {
  visitType: string;
  price: number;
  employee: string;
  payloadType: string;
};

interface VisitModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  shiftId: string | null;
}

const VisitModal: FC<VisitModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  shiftId,
}) => {
  const [allEmployees, setAllEmployees] = useState<
    IEmployee[] | DocumentData[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeState, setEmployeeState] = useState<string | null>(null);
  const [visitTypeState, setVisitTypeState] = useState<string | null>(null);
  const [priceState, setPriceState] = useState<string | null>(null);
  const [payloadTypeState, setPayloadTypeState] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
  } = useForm<FormData>();

  useEffect(() => {
    const employeesSubscribe = () => {
      onSnapshot(collection(db, "employees"), (snapshot) => {
        setAllEmployees(snapshot.docs.map((doc) => doc.data()));
      });
    };
    employeesSubscribe();
    return () => employeesSubscribe();
  }, [db]);

  const handleClose = () => setIsModalOpen(false);

  const handleCreateVisit = async (data: FormData) => {
    try {
      if (!shiftId) return;
      setIsLoading(true);
      await updateDoc(doc(db, "work shifts", shiftId), {
        visits: arrayUnion({
          id: getUniqId(),
          ...data,
          timestamp: String(new Date()),
        }),
      });
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
          <MainHeader header="Новая запись" className="!text-3xl" />
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
                      setEmployeeState(e.target.value);
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
            <div>
              <div className="visitModal-group">
                <p>Услуга</p>
                <input
                  type="text"
                  className="visitModal-input"
                  {...register("visitType", {
                    required: true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setVisitTypeState(e.target.value);
                    },
                  })}
                />
              </div>
            </div>
            <div>
              <div className="visitModal-group">
                <p>Цена</p>
                <input
                  type="number"
                  className="visitModal-input"
                  {...register("price", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setPriceState(e.target.value);
                    },
                  })}
                />
              </div>
            </div>
            <div>
              <div className="visitModal-group">
                <p>Тип оплаты</p>
                <Select
                  defaultValue=""
                  displayEmpty
                  sx={{ height: "30px", width: "160px" }}
                  {...register("payloadType", {
                    onChange: (e: SelectChangeEvent) => {
                      setPayloadTypeState(e.target.value);
                    },
                  })}
                >
                  <MenuItem value="Нал.">Наличные</MenuItem>
                  <MenuItem value="Карта">Карта</MenuItem>
                  <MenuItem value="Каспи">Каспи Банк</MenuItem>
                </Select>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button
              className="w-[160px]"
              type="submit"
              disabled={
                Boolean(!employeeState) ||
                Boolean(!priceState) ||
                Boolean(!visitTypeState) ||
                Boolean(!payloadTypeState)
              }
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
