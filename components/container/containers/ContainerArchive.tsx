import React from "react";
import { IArchiveData } from "@/types/types";
import { ContainerItemArchive } from "../items";
import Circular from "../../ui/CircularProgress";

interface ContainerArchiveProps {
  archiveData: IArchiveData[];
}

const ContainerArchive: React.FC<ContainerArchiveProps> = ({ archiveData }) => {
  return (
    <div className="bg-white w-full h-full rounded-md p-4 space-y-2 overflow-y-scroll shadow-sm">
      {!archiveData ? (
        <Circular size={40} className="mt-5" />
      ) : !archiveData?.length ? (
        <h2 className="text-3xl text-center mt-4">Смена не найдена</h2>
      ) : archiveData ? (
        <ContainerItemArchive data={archiveData[0]} />
      ) : null}
    </div>
  );
};

export default ContainerArchive;
