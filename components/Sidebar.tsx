import { FC, useState } from "react";
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ScissorsIcon,
  ShoppingBagIcon,
  TagIcon,
  ArchiveBoxIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuItem } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import SidebarLink from "./SidebarLink";
import Button from "./ui/Button";
import useAuth from "@/hooks/useAuth";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { logout, admin } = useAuth();
  const isMenuOpen = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="min-w-[180px] w-1/4 bg-zinc-200 opacity-[97%] rounded-md pt-8 flex flex-col justify-start items-center relative">
      <div className="flex flex-col items-center mb-8">
        <Avatar
          // src="../public/avatar-filler.png"
          alt="Admin photo"
          sx={{ width: 56, height: 56 }}
          onClick={handleClick}
          className="cursor-pointer mb-2"
        />
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Сменить фото</MenuItem>
        </Menu>
        <div className="flex justify-center items-center relative">
          <h1>Имя</h1>
          <PencilIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 absolute -right-6 transition duration-150" />
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
        <SidebarLink title="Архив смен" path="/salary" Icon={ArchiveBoxIcon} />
      </div>
      <Button className="md:w-[160px]" type="button" onClick={logout}>
        Закрыть смену
      </Button>
    </div>
  );
};

export default Sidebar;
