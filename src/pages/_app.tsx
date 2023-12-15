import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import NavBar from "../components/NavBar";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>Meal Choice</title>
          <meta name="description" content="Meal Choice" />
          <link rel="icon" href="/favicon.png" />
          <link rel="shortcut icon" type="image/png" href="/logo.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        </Head>
        <div className="min-h-screen">
          <Component {...pageProps} />
        </div>
        <NavBar />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
};

export default App;
