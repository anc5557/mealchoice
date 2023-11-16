// path : mealchoice/src/pages/_app.tsx

import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebasedb";
import "react-toastify/dist/ReactToastify.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import NavBar from "../components/NavBar";
import { NextRouter } from "next/router";

const App = ({
  Component,
  pageProps,
  router,
}: AppProps & { router: NextRouter }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div></div>} persistor={persistor}>
        <InnerComponent
          Component={Component}
          pageProps={pageProps}
          router={router}
        />
      </PersistGate>
    </Provider>
  );
};

const InnerComponent = ({ Component, pageProps }: AppProps) => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const user = useSelector((state: { user: any }) => state.user);
  const isLoggedIn = !!user;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          profilePic: firebaseUser.photoURL,
        };
        dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Meal Choice</title>
        <meta name="description" content="Meal Choice" />
      </Head>
      <div className="bg-gray-50 min-h-screen">
        <Component {...pageProps} />
      </div>
      {isLoggedIn && <NavBar />}
    </>
  );
};

export default App;
