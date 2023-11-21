// path : mealchoice/src/pages/signin.tsx

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import withAuth from "@/hooks/withAuth";

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user); // 사용자 정보를 가져옵니다.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignin } = useAuth();

  // 로그인 상태 확인
  useEffect(() => {
    if (user) {
      router.push("/home"); // 로그인 상태이면 홈 페이지로 리디렉션합니다.
    }
  }, [user, router]);

  const goindex = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center slide-in-right">
      <div className="p-6 max-w-sm w-full bg-white  rounded-md">
        <div className="p-4">
          <button
            onClick={goindex}
            className="rounded-full p-2 text-gray-600 hover:text-gray-900 bg-white shadow-xl "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          로그인
        </h2>
        <form className="space-y-6" onSubmit={handleSignin}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              이메일 주소
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="이메일을 입력하세요"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end">
            <div>
              <a
                href="#"
                className="font-medium text-sm text-blue-600 hover:text-blue-500"
              >
                비밀번호를 잊으셨나요?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium"
          >
            로그인
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text">
            {" "}
            계정이 없으신가요?{" "}
            <Link href="/signup">
              <span className="font-medium text-blue-600 hover:text-blue-500 px-2">
                회원가입
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(SignIn, false);
