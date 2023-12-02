import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import NavBar from "../components/NavBar";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const InnerComponent = ({ Component, pageProps, router }: AppProps) => {
  const user = useSelector((state: { user: any }) => state.user);
  const isLoggedIn = !!user;

  return (
    <>
      <Head>
        <title>Meal Choice</title>
        <meta name="description" content="Meal Choice" />
      </Head>
      <div className="min-h-screen">
        <Component {...pageProps} />
      </div>
      {isLoggedIn && <NavBar />}
      <ToastContainer />
    </>
  );
};

const App = ({ Component, pageProps, router }: AppProps) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <InnerComponent
          Component={Component}
          pageProps={pageProps}
          router={router}
        />
      </PersistGate>
    </Provider>
  );
};

export default App;
