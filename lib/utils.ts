import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "./firebase";
import {
  getDownloadURL,
  ref,
  uploadString,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-hot-toast";

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
