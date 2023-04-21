import { DocumentData, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "./firebase";
import {
  getDownloadURL,
  ref,
  uploadString,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-hot-toast";
import { IVisits } from "@/types/types";

export const setAvatar = (file: string, adminUid: string) => {
  const avatarRef = ref(storage, `admins/${adminUid}/avatar`);

  uploadString(avatarRef, file, "data_url").then(async () => {
    const downloadURL = await getDownloadURL(avatarRef);
    await updateDoc(doc(db, "admins", adminUid), {
      avatarUrl: downloadURL,
    });
  });
};

export const deleteAvatar = async (adminUid: string) => {
  const avatarRef = ref(storage, `admins/${adminUid}/avatar`);
  deleteObject(avatarRef)
    .then(() => toast.success("Фото удалено."))
    .catch(() => toast.error("Не удалось удалить фото. Попробуйте снова."));
  await updateDoc(doc(db, "admins", adminUid), {
    avatarUrl: "",
  });
};

export const convertDataToTime = (data: string) => {
  const date = new Date(data);
  const minutes =
    date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
  const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
  return `${hours}:${minutes}`;
};

export const getUniqId = () => Math.random().toString(16).slice(2);

export const sortContainerItems = (
  sortSetting: string,
  array: IVisits[] | DocumentData[]
) => {
  if (!sortSetting) return array;
  if (sortSetting === "employees") {
    console.log("works");
    const sortedArray = array.sort((a, b) =>
      a.employee.localeCompare(b.employee)
    );
    console.log(sortedArray);
    return sortedArray;
  }
  if (sortSetting === "payload") {
    const sortedArray = array.sort((a, b) =>
      a.payloadType.localeCompare(b.payloadType)
    );
    return sortedArray;
  }
};
