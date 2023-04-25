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
  useCallback,
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
import { IAdmin, ISale, IVisit } from "@/types/types";
import { setShift, clearShift } from "@/redux/slices/shiftStateSlice";
import { useAppDispatch } from "./useRedux";
import toast from "react-hot-toast";
import {
  initGeneral,
  initPaint,
  initSales,
  initVisits,
} from "@/redux/slices/cashboxStateSlice";

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

  const initCashState = (
    isSignIn: boolean,
    visits?: IVisit[],
    sales?: ISale[]
  ) => {
    if (isSignIn) {
      console.log("init signIn");
      dispatch(
        initGeneral({
          type: "signIn",
          value: 0,
        })
      );
      dispatch(
        initVisits({
          type: "signIn",
          value: 0,
        })
      );
      dispatch(
        initSales({
          type: "signIn",
          value: 0,
        })
      );
      dispatch(initPaint([]));
    }
    if (visits && sales) {
      dispatch(
        initGeneral({
          type: "total",
          value:
            visits.reduce((acc, visit) => +visit.price + acc, 0) +
            sales.reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initGeneral({
          type: "card",
          value:
            visits
              .filter((visit) => visit.payloadType === "card")
              .reduce((acc, visit) => +visit.price + acc, 0) +
            sales
              .filter((sale) => sale.payloadType === "card")
              .reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initGeneral({
          type: "cash",
          value:
            visits
              .filter((visit) => visit.payloadType === "cash")
              .reduce((acc, visit) => visit.price + acc, 0) +
            sales
              .filter((sale) => sale.payloadType === "cash")
              .reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initGeneral({
          type: "kaspi",
          value:
            visits
              .filter((visit) => visit.payloadType === "kaspi")
              .reduce((acc, visit) => visit.price + acc, 0) +
            sales
              .filter((sale) => sale.payloadType === "kaspi")
              .reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initVisits({
          type: "total",
          value: visits.reduce((acc, visit) => +visit.price + acc, 0),
        })
      );
      dispatch(
        initVisits({
          type: "card",
          value: visits
            .filter((visit) => visit.payloadType === "card")
            .reduce((acc, visit) => +visit.price + acc, 0),
        })
      );
      dispatch(
        initVisits({
          type: "cash",
          value: visits
            .filter((visit) => visit.payloadType === "cash")
            .reduce((acc, visit) => +visit.price + acc, 0),
        })
      );
      dispatch(
        initVisits({
          type: "kaspi",
          value: visits
            .filter((visit) => visit.payloadType === "kaspi")
            .reduce((acc, visit) => +visit.price + acc, 0),
        })
      );
      dispatch(
        initSales({
          type: "total",
          value: sales.reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initSales({
          type: "card",
          value: sales
            .filter((sale) => sale.payloadType === "card")
            .reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initSales({
          type: "cash",
          value: sales
            .filter((sale) => sale.payloadType === "cash")
            .reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initSales({
          type: "kaspi",
          value: sales
            .filter((sale) => sale.payloadType === "kaspi")
            .reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initPaint(
          visits
            .filter((visit) => visit.paint > 0)
            .map((visit) => ({
              id: visit.paintId,
              employee: visit.employee,
              value: +visit.paint,
            }))
        )
      );
    }
  };

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          setAdmin(adminDoc.data() as IAdmin);
          const shift = JSON.parse(localStorage.getItem("shift")!);
          if (shift) {
            dispatch(
              setShift({ shiftId: shift.id, timestamp: shift.timestamp })
            );
            const shiftDoc = await getDoc(doc(db, "work shifts", shift.id));
            const shiftParsedDoc = shiftDoc.data();
            initCashState(
              false,
              shiftParsedDoc?.visits as IVisit[],
              shiftParsedDoc?.sales as ISale[]
            );
          }
        } else {
          setAdmin(null);
          router.push("/login");
        }

        setInitialLoading(false);
      }),
    [auth]
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
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
        localStorage.setItem(
          "shift",
          JSON.stringify({
            id: docId.id,
            timestamp: new Date(),
          })
        );
        dispatch(
          setShift({ shiftId: docId.id, timestamp: String(new Date()) })
        );
        initCashState(true);
        toast.success("Администратор создан!", {
          duration: 4500,
        });
        router.push("/");
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
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const docId = await addDoc(collection(db, "work shifts"), {
        admin: user.uid,
        visits: [],
        sales: [],
        timestamp: serverTimestamp(),
      });
      localStorage.setItem(
        "shift",
        JSON.stringify({
          id: docId.id,
          timestamp: new Date(),
        })
      );
      dispatch(setShift({ shiftId: docId.id, timestamp: String(new Date()) }));
      initCashState(true);
      router.push("/");
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
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      setAdmin(null);
      localStorage.removeItem("shiftId");
      dispatch(clearShift());
    } catch (err) {
      toast.error("Проблемы с соединением. Попробуйте еще раз.", {
        duration: 4500,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

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
