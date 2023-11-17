// path : mealchoice/src/pages/signup.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app } from "../firebase/firebasedb";
import { useDispatch } from "react-redux";
import { logIn } from "../features/userSlice";
import { db } from "../firebase/firebasedb";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setdisplayName] = useState("");
  const dispatch = useDispatch();
  const { handleSignup } = useAuth();

  
  const goindex = () => {
    router.push("/");
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="p-6 max-w-sm w-full bg-white rounded-md ">
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          회원가입
        </h2>
        <form className="space-y-6" onSubmit={handleSignup}>
          <div>
            <label
              htmlFor="displayName"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              이름
            </label>
            <input
              type="text"
              name="displayName"
              id="displayName"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="이름을 입력하세요"
              onChange={(e) => setdisplayName(e.target.value)}
            />
          </div>
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
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium"
          >
            회원가입
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text">
            이미 계정이 있으신가요?{" "}
            <Link href="/signin">
              <p className="font-medium text-blue-600 hover:text-blue-500">
                로그인
              </p>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
