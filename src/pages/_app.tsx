// path : mealchoice/src/pages/_app.tsx

import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>Meal Choice</title>
            </Head>



            <Component {...pageProps} />
        </>
    );
};
export default MyApp;
