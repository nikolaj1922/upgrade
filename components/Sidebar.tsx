import { FC, useState, useEffect, useRef } from "react";
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ScissorsIcon,
  ShoppingBagIcon,
  TagIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuItem } from "@mui/material";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { IAdmin } from "@/types/types";
import { setAvatar, deleteAvatar } from "@/lib/utils";
import Avatar from "@mui/material/Avatar";
import SidebarLink from "./SidebarLink";
import Button from "./ui/LoginButton";
import useAuth from "@/hooks/useAuth";
import Circular from "./ui/CircularProgress";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { logout, admin } = useAuth();
  const [isChangeName, setIsChangeName] = useState<boolean>(false);
  const isMenuOpen = Boolean(anchorEl);
  const [currentAdminData, setCurrentAdminData] = useState<IAdmin | null>(null);
  const [currentName, setCurrentName] = useState<string>("");
  const [editedNameIsLoading, setEditedNameIsLoading] =
    useState<boolean>(false);
  const inputChangeNameRef = useRef<HTMLInputElement | null>(null);
  const buttonChangeNameRef = useRef<HTMLButtonElement | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
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
    <div className="min-w-[180px] w-1/5 bg-zinc-200/97 rounded-md pt-8 flex flex-col justify-start items-center relative">
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
      <div className="flex flex-col space-y-3 mb-16">
        <SidebarLink title="Записи" path="/" Icon={ScissorsIcon} />
        <SidebarLink title="Продажи" path="/sales" Icon={TagIcon} />
        <SidebarLink title="Касса" path="/" Icon={BanknotesIcon} />
        <SidebarLink title="Заказы" path="/" Icon={ShoppingBagIcon} />
        <SidebarLink
          title="Зарплата"
          path="/salary"
          Icon={CurrencyDollarIcon}
        />
        <SidebarLink
          title="Архив смен"
          path="/salary"
          Icon={CalendarDaysIcon}
        />
      </div>
      <Button type="button" onClick={logout}>
        Закрыть смену
      </Button>
    </div>
  );
};

export default Sidebar;
