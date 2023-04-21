import { FC, AllHTMLAttributes } from "react";

interface HeaderProps extends AllHTMLAttributes<HTMLHeadingElement> {
  header: string;
}

const MainHeader: FC<HeaderProps> = ({ header, className }) => {
  return (
    <div>
      <h1
        className={`text-5xl font-bold border-b border-zinc-300 pb-3 ${className}`}
      >
        {header}
      </h1>
    </div>
  );
};

export default MainHeader;
