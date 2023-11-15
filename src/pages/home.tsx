// path : mealchoice/src/pages/home.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logIn, logOut } from '../features/userSlice';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import firebasedb from '../firebase/firebasedb'
import { RootState } from '../store';
import router from 'next/router';

export default function Home() {
    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <h1>홈 페이지</h1>
        </div>
    );
}
