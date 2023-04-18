import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Background from "./components/Background";
import { AuthProvider } from "@/hooks/useAuth";
import { Provider } from "react-redux";
import { store } from "@/redux";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Background />
      <Provider store={store}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </Provider>
    </>
  );
}
