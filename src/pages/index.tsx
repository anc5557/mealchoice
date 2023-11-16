// path : mealchoice/src/pages/index.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app, db } from '../firebase/firebasedb';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from '../features/userSlice';
import { RootState } from '../store';
import { setDoc, doc } from 'firebase/firestore';

export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user); // 사용자 정보를 가져옵니다.

    // 로그인 상태 확인
    useEffect(() => {
        if (user) {
            router.push('/home'); // 로그인 상태이면 홈 페이지로 리디렉션합니다.
        }
    }, [user, router]);

    const handleGoogleLogin = async () => {
        try {
            const auth = getAuth(app); // firebase 인증 객체를 가져옵니다.
            const provider = new GoogleAuthProvider(); // 구글 로그인을 위한 provider 객체를 만듭니다.
            const result = await signInWithPopup(auth, provider); // 팝업창을 띄우고 구글 로그인을 합니다.
            
            const user = {
                uid: result.user.uid,
                email: result.user.email ?? '', // null이면 빈 문자열로 대체
                displayName: result.user.displayName ?? '', // null이면 빈 문자열로 대체
                profilePic: result.user.photoURL ?? 'public/default-profile.png', // null이면 빈 문자열로 대체
            };

            dispatch(logIn(user)); // Redux store에 사용자 정보 저장

            // Firestore에 사용자 정보 저장
            await setDoc(doc(db, 'users', user.uid), { ...user });



            router.push('/home');
        } catch (error) {
            console.error(error);
            // 에러 처리 로직을 추가할 수 있습니다.
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">
                        음식 메뉴 초이스
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        음식 메뉴를 추천하는 서비스입니다.
                    </p>
                </div>
                <div className="rounded-md -space-y-px ">
                    <div className="flex justify-center ">
                        <button onClick={handleGoogleLogin} className="group mt-5 relative w-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Google로 로그인하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}