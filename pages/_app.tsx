import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Background from "@/components/Background";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/hooks/useAuth";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import { Toaster } from "react-hot-toast";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PersistGate } from "redux-persist/integration/react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const progress = new ProgressBar({
  size: 4,
  color: "#818cf8",
  className: "z-50",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <div className="h-screen">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Toaster position="top-center" reverseOrder={false} />
        <Background />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              {Component.getLayout ? (
                <Component {...pageProps} />
              ) : (
                <div className="w-[85%] h-[630px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-8">
                  <Sidebar />
                  <Component {...pageProps} />
                </div>
              )}
            </AuthProvider>
          </PersistGate>
        </Provider>
      </LocalizationProvider>
    </div>
  );
}
