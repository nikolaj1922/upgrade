import { FC } from "react";

interface HeaderProps {
  header: string;
}

const MainHeader: FC<HeaderProps> = ({ header }) => {
  return (
    <h1 className="text-5xl font-bold border-b border-zinc-300 pb-3">
      {header}
    </h1>
  );
};

export default MainHeader;
