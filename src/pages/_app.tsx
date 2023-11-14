// path : mealchoice/src/pages/_app.tsx

import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from '@/pages/index';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>Meal Choice</title>
                <meta name="description" content="Meal Choice" />
            </Head>
            <NavBar />

            <Home />
            

            <Component {...pageProps} />
        </>
    );
};
export default App;
