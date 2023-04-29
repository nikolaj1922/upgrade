import AddAndSortSection from "@/components/AddAndSortSection";
import MainHeader from "@/components/Header";
import Container from "@/components/container/Container";
import { db } from "@/lib/firebase";
import { IEmployee } from "@/types/types";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { FC, useState, useEffect } from "react";

interface employeesProps {}

const Employees: FC<employeesProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [allEmployees, setAllEmployees] = useState<
    IEmployee[] | DocumentData[] | null
  >(null);

  useEffect(
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
      <Container dataType="employees" employees={allEmployees as IEmployee[]} />
    </main>
  );
};

export default Employees;
