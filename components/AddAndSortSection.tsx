import Button from "@/components/ui/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FC, SetStateAction, Dispatch } from "react";

interface AddAndSortSectionProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setSortSelect: Dispatch<SetStateAction<string>>;
  sortItems: {
    value: string;
    title: string;
  }[];
}

const AddAndSortSection: FC<AddAndSortSectionProps> = ({
  setIsModalOpen,
  setSortSelect,
  sortItems,
}) => {
  const handleSetSelect = (e: SelectChangeEvent) =>
    setSortSelect(e.target.value);

  return (
    <div className="flex justify-start items-center space-x-8">
      <Button className="space-x-2" onClick={() => setIsModalOpen(true)}>
        <span>Добавить</span>
        <PlusIcon className="w-5 h-5" />
      </Button>
      <div className="space-x-4">
        <span className="text-2xl font-semibold">Сортировать:</span>
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
    </div>
  );
};

export default AddAndSortSection;
