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
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  IAdmin,
  IGeneral,
  IPaint,
  ISalary,
  ISale,
  IVisit,
} from "@/types/types";
import { setShift, clearShift } from "@/redux/slices/shiftStateSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";
import toast from "react-hot-toast";
import {
  initGeneralShift,
  initEmployeeSalaryPaint,
  initSalesMen,
  initVisits,
  initPaint,
} from "@/redux/slices/cashboxStateSlice";
import { initSalary } from "@/redux/slices/salaryStateSlice";
import {
  setPaintStartSum,
  setSalesMStartSum,
  setGeneralShiftStartSum,
} from "@/redux/slices/startSumStateSlice";
import { getFullDate } from "@/lib/utils";

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
    visits?: IVisit[],
    salesMen?: ISale[],
    paint?: IPaint[],
    generalShift?: IGeneral[],
    paintStartSum?: number,
    salesMStartSum?: number,
    shiftGeneralStartSum?: number
  ) => {
    if (visits && salesMen && paint && generalShift) {
      const salary: Array<ISalary> = visits.map((visit) => ({
        employee: visit.employee,
        revenue: visit.price,
        paint: visit.paint,
      }));
      dispatch(initSalary(salary));
      dispatch(setPaintStartSum(paintStartSum!));
      dispatch(setSalesMStartSum(salesMStartSum!));
      dispatch(setGeneralShiftStartSum(shiftGeneralStartSum!));
      dispatch(
        initGeneralShift(
          generalShift.reduce((acc, general) => +general.price + acc, 0)
        )
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
        initSalesMen({
          type: "total",
          value: salesMen.reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initSalesMen({
          type: "card",
          value: salesMen
            .filter((sale) => sale.payloadType === "card")
            .reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initSalesMen({
          type: "cash",
          value: salesMen
            .filter((sale) => sale.payloadType === "cash")
            .reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initSalesMen({
          type: "kaspi",
          value: salesMen
            .filter((sale) => sale.payloadType === "kaspi")
            .reduce((acc, sale) => +sale.price + acc, 0),
        })
      );
      dispatch(
        initPaint({
          type: "total",
          value: paint.reduce((acc, paint) => +paint.price + acc, 0),
        })
      );
      dispatch(
        initPaint({
          type: "card",
          value: paint
            .filter((paint) => paint.payloadType === "card")
            .reduce((acc, paint) => +paint.price + acc, 0),
        })
      );
      dispatch(
        initPaint({
          type: "cash",
          value: paint
            .filter((paint) => paint.payloadType === "cash")
            .reduce((acc, paint) => +paint.price + acc, 0),
        })
      );
      dispatch(
        initPaint({
          type: "kaspi",
          value: paint
            .filter((paint) => paint.payloadType === "kaspi")
            .reduce((acc, paint) => +paint.price + acc, 0),
        })
      );
      dispatch(
        initEmployeeSalaryPaint(
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

  const clearCashState = () => {
    dispatch(initGeneralShift(0));
    dispatch(
      initVisits({
        type: "signIn",
        value: 0,
      })
    );
    dispatch(
      initSalesMen({
        type: "signIn",
        value: 0,
      })
    );
    dispatch(
      initPaint({
        type: "signIn",
        value: 0,
      })
    );
    dispatch(setPaintStartSum(0));
    dispatch(setSalesMStartSum(0));
    dispatch(setGeneralShiftStartSum(0));
    dispatch(initEmployeeSalaryPaint([]));
    dispatch(initSalary([]));
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
              shiftParsedDoc?.visits as IVisit[],
              shiftParsedDoc?.salesMen as ISale[],
              shiftParsedDoc?.paint as IPaint[],
              shiftParsedDoc?.generalShift as IGeneral[],
              shiftParsedDoc?.paintStartSum,
              shiftParsedDoc?.salesMStartSum,
              shiftParsedDoc?.shiftGeneralStartSum
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
          salesMen: [],
          paint: [],
          generalShift: [],
          salary: [],
          paintStartSum: 0,
          salesMStartSum: 0,
          shiftGeneralStartSum: 0,
          archiveTimestamp: getFullDate(String(new Date()), true),
          timestamp: String(new Date()),
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
        salesMen: [],
        paint: [],
        generalShift: [],
        paintStartSum: 0,
        salesMStartSum: 0,
        shiftGeneralStartSum: 0,
        archiveTimestamp: getFullDate(String(new Date()), true),
        timestamp: String(new Date()),
      });
      localStorage.setItem(
        "shift",
        JSON.stringify({
          id: docId.id,
          timestamp: new Date(),
        })
      );
      dispatch(setShift({ shiftId: docId.id, timestamp: String(new Date()) }));
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
      localStorage.clear();
      dispatch(clearShift());
      clearCashState();
    } catch (err) {
      console.log(err);
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
