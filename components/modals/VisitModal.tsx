import { FC, useState, SetStateAction, Dispatch, useEffect } from "react";
import Modal from "@mui/material/Modal";
import MainHeader from "../Header";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "../ui/Button";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { IEmployee } from "@/types/types";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import Circular from "../ui/CircularProgress";
import { toast } from "react-hot-toast";
import { getUniqId } from "@/lib/utils";

type FormData = {
  visitType: string;
  price: number;
  employee: string;
};

interface VisitModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const VisitModal: FC<VisitModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [allEmployees, setAllEmployees] = useState<
    IEmployee[] | DocumentData[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const employeesSubscribe = () => {
      if (!localStorage.getItem("shiftId")) return;
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
      if (!localStorage.getItem("shiftId")) return;
      setIsLoading(true);
      await updateDoc(
        doc(db, "work shifts", localStorage.getItem("shiftId") as string),
        {
          visits: arrayUnion({
            id: getUniqId(),
            ...data,
            timestamp: String(new Date()),
          }),
        }
      );
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-slate-200 shadow-md p-4 focus:outline-none rounded-sm flex flex-col space-y-2">
        <div className="relative">
          <MainHeader header="Новая запись" className="!text-3xl" />
          <XCircleIcon
            className="w-7 h-7 ml-9 cursor-pointer text-red-400 hover:text-red-500 absolute top-1.5 right-0"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <form
          className="px-8 space-y-3"
          onSubmit={handleSubmit(handleCreateVisit)}
        >
          <div>
            <div className="flex justify-between items-center space-x-6">
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
                {...register("employee", { required: "Обязательное поле" })}
              >
                {allEmployees.map((employee) => (
                  <MenuItem key={employee.name} value={employee.name}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <p className="text-xs text-red-500">{errors.employee?.message}</p>
          </div>
          <div>
            <div className="flex justify-between items-center space-x-6">
              <p>Услуга</p>
              <input
                type="text"
                className="h-[30px] w-[160px] rounded focus:outline-none bg-inherit border-b shadow-sm border-zinc-300 pl-1"
                {...register("visitType", { required: "Обязательное поле" })}
              />
            </div>
            <p className="text-xs text-red-500">{errors.visitType?.message}</p>
          </div>
          <div>
            <div className="flex justify-between items-center space-x-6">
              <p>Цена</p>
              <input
                type="number"
                className="h-[30px] w-[160px] rounded focus:outline-none bg-inherit border-b border-zinc-300 pl-1 shadow-sm"
                {...register("price", { required: "Обязательное поле" })}
              />
            </div>
            <p className="text-xs text-red-500">{errors.price?.message}</p>
          </div>
          <div className="w-full flex justify-center">
            <Button className="py-2" type="submit">
              {isLoading ? <Circular /> : "Создать запись"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default VisitModal;
