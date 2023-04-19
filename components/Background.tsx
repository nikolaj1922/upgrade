import Image from "next/image";
import bg from "@/public/upgrade_bg.jpg";
import { FC } from "react";

interface BackgroundProps {}

const Background: FC<BackgroundProps> = ({}) => {
  return (
    <div className="absolute h-full w-full -z-50">
      <Image
        src={bg}
        alt="Upgrade"
        fill
        className="object-cover object-center brightness-50"
      />
    </div>
  );
};

export default Background;
