import React from "react";
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ScissorsIcon,
  TagIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  PaintBrushIcon,
  CircleStackIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuItem } from "@mui/material";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { IAdmin } from "@/types/types";
import { storage } from "@/lib/firebase";
import {
  getDownloadURL,
  ref,
  uploadString,
  deleteObject,
} from "firebase/storage";
import Avatar from "@mui/material/Avatar";
import SidebarLink from "./SidebarLink";
import Button from "./ui/LoginButton";
import useAuth from "@/hooks/useAuth";
import Circular from "./ui/CircularProgress";
import { useAppSelector } from "@/hooks/useRedux";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = ({}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const { logout, admin } = useAuth();
  const [isChangeName, setIsChangeName] = React.useState<boolean>(false);
  const isMenuOpen = Boolean(anchorEl);
  const [currentAdminData, setCurrentAdminData] = React.useState<IAdmin | null>(
    null
  );
  const [currentName, setCurrentName] = React.useState<string>("");
  const [editedNameIsLoading, setEditedNameIsLoading] =
    React.useState<boolean>(false);

  const { cashboxState, startSumState } = useAppSelector((state) => state);
  const inputChangeNameRef = React.useRef<HTMLInputElement | null>(null);
  const buttonChangeNameRef = React.useRef<HTMLButtonElement | null>(null);
  const inputFileRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const adminDataSubscribe = () => {
      if (!admin) return;
      onSnapshot(doc(db, "admins", admin?.uid), (snapshot) => {
        const data = snapshot.data();
        setCurrentAdminData(data as IAdmin);
        setCurrentName(data?.name);
      });
    };

    return () => adminDataSubscribe();
  }, [db]);

  const handleClickOutside = () => {
    setIsChangeName(false), setCurrentName(currentAdminData?.name!);
  };
  useOnClickOutside(
    inputChangeNameRef,
    () => handleClickOutside(),
    buttonChangeNameRef
  );

  const handleCloseMenuClick = () => setAnchorEl(null);
  const handleOpenMenuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuChangeName = () => {
    setIsChangeName(true);
    setAnchorEl(null);
  };

  const handleSaveEditedName = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (currentName?.trim().length! < 3)
        throw new Error("Минимальная длина 3 символа ");
      setEditedNameIsLoading(true);
      await updateDoc(doc(db, "admins", admin?.uid as string), {
        name: currentName,
      });
      toast.success("Имя изменено.");
      setIsChangeName(false);
    } catch (err: any) {
      if (err instanceof FirebaseError) {
        toast.error("Не удалось изменить имя.");
        return;
      }
      toast.error(err.message);
    } finally {
      setEditedNameIsLoading(false);
    }
  };

  const setAvatar = (file: string, adminUid: string) => {
    const avatarRef = ref(storage, `admins/${adminUid}/avatar`);

    uploadString(avatarRef, file, "data_url").then(async () => {
      const downloadURL = await getDownloadURL(avatarRef);
      await updateDoc(doc(db, "admins", adminUid), {
        avatarUrl: downloadURL,
      });
    });
  };

  const deleteAvatar = async (adminUid: string) => {
    const avatarRef = ref(storage, `admins/${adminUid}/avatar`);
    deleteObject(avatarRef)
      .then(() => toast.success("Фото удалено."))
      .catch(() => toast.error("Не удалось удалить фото. Попробуйте снова."));
    await updateDoc(doc(db, "admins", adminUid), {
      avatarUrl: "",
    });
  };

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    e.target.value = "";

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => {
      setAvatar(readerEvent.target?.result as string, admin?.uid!);
    };

    handleCloseMenuClick();
    setTimeout(() => {
      toast.success("Фото изменено.");
    }, 2000);
  };

  const handleDeleteAvatar = async () => {
    deleteAvatar(admin?.uid!);
    handleCloseMenuClick();
  };

  return (
    <div className="min-w-[210px] bg-zinc-200/97 rounded-md pt-8 flex flex-col justify-start items-center relative px-2">
      <div className="flex flex-col items-center mb-4">
        <Avatar
          src={currentAdminData?.avatarUrl}
          alt="Admin photo"
          sx={{ width: 85, height: 85 }}
          onClick={handleOpenMenuClick}
          className="cursor-pointer mb-2"
        />
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleCloseMenuClick}
        >
          <MenuItem onClick={handleMenuChangeName}>Изменить имя</MenuItem>
          <MenuItem>
            <span onClick={() => inputFileRef.current?.click()}>
              Сменить фото
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={inputFileRef}
              onChange={handleChangeAvatar}
            />
          </MenuItem>
          {currentAdminData?.avatarUrl && (
            <MenuItem onClick={handleDeleteAvatar}>Удалить фото</MenuItem>
          )}
        </Menu>
        <div className="flex justify-center items-center">
          {isChangeName ? (
            <form className="pl-4 relative" onSubmit={handleSaveEditedName}>
              <input
                ref={inputChangeNameRef}
                type="text"
                className="pl-2 w-3/4 rounded focus:outline-none"
                autoFocus
                onChange={(e) => {
                  setCurrentName(e.target.value);
                }}
                value={currentName}
              />
              {editedNameIsLoading ? (
                <Circular size={16} className="absolute right-3 top-1" />
              ) : (
                <button
                  type="submit"
                  onClick={handleSaveEditedName}
                  ref={buttonChangeNameRef}
                >
                  <CheckCircleIcon className="w-6 h-6 text-green-500 cursor-pointer hover:text-green-600 absolute right-3 top-0 transition duration-150" />
                </button>
              )}
            </form>
          ) : (
            <h1>{currentAdminData?.name}</h1>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-6 mb-8">
        <div>
          <SidebarLink title="Записи" path="/" Icon={ScissorsIcon} />
          <SidebarLink title="Продажи М" path="/sales" Icon={TagIcon} />
          <SidebarLink title="Краска" path="/paint" Icon={PaintBrushIcon} />
          <SidebarLink
            title="Общая касса"
            path="/shiftgeneral"
            Icon={CircleStackIcon}
          />
        </div>
        <div>
          <SidebarLink
            title="Отчет о смене"
            path="/report"
            Icon={BanknotesIcon}
          />
          <SidebarLink
            title="Зарплата"
            path="/salary"
            Icon={CurrencyDollarIcon}
          />
        </div>
        <div>
          <SidebarLink
            title="Мастера"
            path="/employees"
            Icon={UserCircleIcon}
          />
          <SidebarLink
            title="Архив смен"
            path="/archive"
            Icon={CalendarDaysIcon}
          />
        </div>
      </div>
      <Button
        type="button"
        onClick={async () => {
          const shift = JSON.parse(localStorage.getItem("shift")!);
          await updateDoc(doc(db, "work shifts", shift.id!), {
            salesMEndSum:
              startSumState.salesMStartSum + cashboxState.salesMenTotal,
            paintEndSum: startSumState.paintStartSum + cashboxState.paintTotal,
            shiftGeneralEndSum:
              startSumState.generalShiftStartSum +
              cashboxState.generalShiftTotal,
          }),
            logout();
        }}
      >
        Закрыть смену
      </Button>
    </div>
  );
};

export default Sidebar;
