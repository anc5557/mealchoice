import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { FiHome, FiUser, FiClock } from "react-icons/fi";
import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const NavBar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  if (!isLoggedIn) {
    return null; // 로그인 상태가 아니면 NavBar를 렌더링하지 않습니다.
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-black shadow-lg px-4 py-4 flex justify-around items-center">
      <div className="flex-1" />
      <Link href="/history" passHref>
        <div className="px-2">
          <FiClock className="text-2xl text-white mx-auto" />
        </div>
      </Link>
      <div className="flex-1" />
      <Link href="/home" passHref>
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
