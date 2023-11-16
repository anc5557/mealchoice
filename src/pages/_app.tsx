// src/pages/_app.tsx
import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import NavBar from '../components/NavBar';
import '../styles/globals.css';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

const InnerComponent = ({ Component, pageProps, router }: AppProps) => {
  useFirebaseAuth(); // 사용자 정의 훅 사용
  const user = useSelector((state: { user: any }) => state.user);
  const isLoggedIn = !!user;

  return (
    <>
      <Head>
        <title>Meal Choice</title>
        <meta name="description" content="Meal Choice" />
      </Head>
      <div className="border-2 min-h-screen">
        <Component {...pageProps} />
      </div>
      {isLoggedIn && <NavBar />}
    </>
  );
};

const App = ({ Component, pageProps, router }: AppProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <InnerComponent Component={Component} pageProps={pageProps} router={router} />
      </PersistGate>
    </Provider>
  );
};

export default App;
