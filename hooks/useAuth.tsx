import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
  FC,
} from "react";
import { auth, db } from "../lib/firebase";
import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { IAdmin } from "@/types/types";
import { setShiftId, clearShiftId } from "@/redux/slices/shiftStateSlice";
import { useAppDispatch } from "./useRedux";
import toast from "react-hot-toast";

export interface IAuth {
  admin: IAdmin | null;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<IAuth>({
  admin: null,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  isLoading: false,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          setAdmin(adminDoc.data() as IAdmin);
          dispatch(setShiftId(localStorage.getItem("shiftId")!));
          router.push("/");
        } else {
          setAdmin(null);
          router.push("/login");
        }

        setInitialLoading(false);
      }),
    [auth]
  );

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "admins", user.uid), {
        uid: user.uid,
        name,
      });
      const docId = await addDoc(collection(db, "work shifts"), {
        admin: user.uid,
        visits: [],
        sales: [],
        timestamp: serverTimestamp(),
      });
      localStorage.setItem("shiftId", docId.id);
      dispatch(setShiftId(docId.id));
      toast.success("Администратор создан!", {
        duration: 4500,
      });
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-email") {
          toast.error("Введите корректный e-mail.", {
            duration: 4500,
          });
        }
        if (err.code === "auth/network-request-failed") {
          toast.error("Проблемы с соединением. Попробуйте еще раз.", {
            duration: 4500,
          });
        }
        if (err.code === "auth/email-already-in-use") {
          toast.error("Этот e-mail уже занят. Используйте другой.", {
            duration: 4500,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const docId = await addDoc(collection(db, "work shifts"), {
        admin: user.uid,
        visits: [],
        sales: [],
        timestamp: serverTimestamp(),
      });
      localStorage.setItem("shiftId", docId.id);
      dispatch(setShiftId(docId.id));
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-email") {
          toast.error("Введите корректный e-mail.", {
            duration: 4500,
          });
          return;
        }
        if (err.code === "auth/network-request-failed") {
          toast.error("Проблемы с соединением. Попробуйте еще раз.", {
            duration: 4500,
          });
          return;
        }
        toast.error("Неверный e-mail или пароль.", {
          duration: 4500,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      setAdmin(null);
      localStorage.removeItem("shiftId");
      dispatch(clearShiftId());
    } catch (err) {
      toast.error("Проблемы с соединением. Попробуйте еще раз.", {
        duration: 4500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const memoedValue = useMemo(
    () => ({
      admin,
      signIn,
      logout,
      signUp,
      isLoading,
    }),
    [isLoading, admin, db]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
