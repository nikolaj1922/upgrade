import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Background from "@/components/Background";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/hooks/useAuth";
import { Provider } from "react-redux";
import { store } from "@/redux";
import { Toaster } from "react-hot-toast";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  if (Component.getLayout) {
    return Component.getLayout(
      <div className="h-screen">
        <Toaster position="top-center" reverseOrder={false} />
        <Background />
        <Provider store={store}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </Provider>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <Background />
      <Provider store={store}>
        <AuthProvider>
          <div className="w-[70%] h-[80%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-8">
            <Sidebar />
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </Provider>
    </div>
  );
}
