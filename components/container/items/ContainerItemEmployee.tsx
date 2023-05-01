import { FC } from "react";

interface ContainerItemEmployeeProps {
  id: string;
  name: string;
}

const ContainerItemEmployee: FC<ContainerItemEmployeeProps> = ({
  id,
  name,
}) => {
  return <div>{name}</div>;
};

export default ContainerItemEmployee;
