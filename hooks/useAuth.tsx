import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
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
import { auth } from "../lib/firebase";
import { useAppDispatch } from "@/hooks/useRedux";
import { setLoginForm } from "@/redux/slices/formStateSlice";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";

export interface IAuth {
  admin: User | null;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => void;
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
  const [admin, setAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setAdmin(user);
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(setLoginForm());
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const signIn = async (email: string, password: string) => {
  //   try {
  //     setIsLoading(true);
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     setAdmin(userCredential.user);
  //     router.push("/");
  //   } catch (err) {
  //     toast.error("Неверный e-mail или пароль.", {
  //       duration: 4500,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const signIn = (email: string, password: string) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setAdmin(userCredential.user);
        router.push("/");
      })
      .catch((err) => {
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
      })
      .finally(() => setIsLoading(false));
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      setAdmin(null);
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
    [isLoading, admin]
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
