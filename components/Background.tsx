import Image from "next/image";
import bg from "@/public/upgrade_bg.jpg";
import React from "react";

interface BackgroundProps {}

const Background: React.FC<BackgroundProps> = ({}) => {
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
