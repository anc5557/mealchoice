import React from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';

const NavBar = () => {
    const router = useRouter();
    const isLogin = false; // 로그인 상태 관리 로직에 따라 변경
    const onClickLogout = () => {
        toast.success('로그아웃 되었습니다.');
        router.push('/');
    }   

    return (
        <div className="navbar flex justify-between items-center p-4 bg-gray-200">
            <div className="navbar__left">
                <Link href="/">
                    <span className="text-blue-500 hover:text-blue-700 cursor-pointer">홈</span>
                </Link>
            </div>
            <div className="navbar__right space-x-4">
                {isLogin ? (
                    <>
                        <Link href="/myinfo">
                            <span className="text-blue-500 hover:text-blue-700 cursor-pointer">내정보</span>
                        </Link>
                        <button onClick={onClickLogout} className="text-blue-500 hover:text-blue-700 cursor-pointer">로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link href="/signup">
                            <span className="text-blue-500 hover:text-blue-700 cursor-pointer">회원가입</span>
                        </Link>
                        <Link href="/login">
                            <span className="text-blue-500 hover:text-blue-700 cursor-pointer">로그인</span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default NavBar;
