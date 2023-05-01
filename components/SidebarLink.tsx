import Link from "next/link";
import React from "react";

interface SidebarLinkProps {
  title: string;
  path: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ title, Icon, path }) => {
  return (
    <Link href={`${path}`}>
      <div className="flex items-center hover:bg-gray-300 pl-4 pr-6 py-1 rounded-md transition duration-150">
        <Icon className="w-7 h-7 mr-2 text-neutral-700" />
        <h3>{title}</h3>
      </div>
    </Link>
  );
};

export default SidebarLink;
