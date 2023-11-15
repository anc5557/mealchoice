import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FiHome, FiUser, FiClock } from 'react-icons/fi';
import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';

const NavBar = () => {
    const router = useRouter();
    const isLogin = true; // 로그인 상태에 따라 이 값을 변경하세요.

    const onClickLogout = () => {
        toast.success('로그아웃 되었습니다.');
        router.push('/');
    };

    // NavBar 컴포넌트
    return (
        <div className="fixed inset-x-0 bottom-0 bg-black shadow-lg px-4 py-4 flex justify-around items-center">
            <div className="flex-1" />
            <Link href="/records" passHref>
                <div className="px-2">
                    <FiClock className="text-2xl text-white mx-auto" />
                </div>
            </Link>
            <div className="flex-1" />
            <Link href="/" passHref>
                <div className="px-2">
                    <FiHome className="text-2xl text-white mx-auto" />
                </div>
            </Link>
            <div className="flex-1" />
            <Link href="/myinfo" passHref>
                <div className="px-2">
                    <FiUser className="text-2xl text-white mx-auto" />
                </div>
            </Link>
            <div className="flex-1" />
        </div>
    );

};

export default NavBar;
