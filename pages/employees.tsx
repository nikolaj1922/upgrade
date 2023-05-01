import AddAndSortSection from "@/components/AddAndSortSection";
import MainHeader from "@/components/Header";
import { ContainerEmployees } from "@/components/container/containers";
import { db } from "@/lib/firebase";
import { IEmployee } from "@/types/types";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import React from "react";

interface employeesProps {}

const Employees: React.FC<employeesProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [allEmployees, setAllEmployees] = React.useState<
    IEmployee[] | DocumentData[] | null
  >(null);

  React.useEffect(
    () =>
      onSnapshot(collection(db, "employees"), (snapshot) =>
        setAllEmployees(snapshot.docs.map((doc) => doc.data()))
      ),
    [db]
  );

  return (
    <main>
      <MainHeader header="Мастера" />
      <AddAndSortSection setIsModalOpen={setIsModalOpen} />
      <ContainerEmployees employees={allEmployees as IEmployee[]} />
    </main>
  );
};

export default Employees;
