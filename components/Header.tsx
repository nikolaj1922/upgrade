import { FC, AllHTMLAttributes } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { getFullDate } from "@/lib/utils";

interface HeaderProps extends AllHTMLAttributes<HTMLHeadingElement> {
  header: string;
  isModal?: boolean;
}

const MainHeader: FC<HeaderProps> = ({ header, className, isModal }) => {
  const { timestamp } = useAppSelector((state) => state.shiftState);

  return (
    <div className="flex justify-between items-end border-b border-zinc-300 pb-3">
      <h1 className={`text-5xl font-bold ${className}`}>{header}</h1>
      {!isModal && (
        <h2 className="text-xl">Смена открыта {getFullDate(timestamp!)}</h2>
      )}
    </div>
  );
};

export default MainHeader;
