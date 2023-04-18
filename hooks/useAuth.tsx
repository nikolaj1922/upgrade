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
import { auth } from "../firebase";
import { useAppDispatch } from "@/hooks/useRedux";
import { setLogin } from "@/redux/slices/formStateSlice";
import toast from "react-hot-toast";

export interface IAuth {
  // user: null;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<IAuth>({
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  isLoading: false,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(setLogin());
      toast.success("Администратор создан!", {
        duration: 3000,
      });
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const memoedValue = useMemo(
    () => ({
      signIn,
      logout,
      signUp,
      isLoading,
    }),
    [isLoading]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
