// path : mealchoice/src/pages/signup.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import withAuth from "@/hooks/withAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setdisplayName] = useState("");
  const { handleEmailSignup } = useAuth();

  const goindex = () => {
    router.push("/");
  };

  const validate = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=\[\]{}~?:;`|\/]).{6,50}$/;

    if (!emailRegex.test(email)) {
      return "유효하지 않은 이메일 형식입니다.";
    }

    if (!passwordRegex.test(password)) {
      return "비밀번호는 6자 이상이며, 대소문자, 숫자, 특수문자를 포함해야 합니다.";
    }

    if (displayName.trim() === "") {
      return "이름을 입력해주세요.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const errorMessage = validate();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      await handleEmailSignup(email, password, displayName);
      setIsLoading(false);
      toast.success("회원가입 성공!");
    } catch (error: unknown) {
      setIsLoading(false);
      toast.error(
        (error as Error).message || "회원가입 처리 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="spinner"></div>
        </div>
      )}
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          회원가입
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_-+=[]{}~?:;`|/]).{6,50}$"
              title="영문 대소문자, 숫자, 특수문자를 꼭 포함하여 6자 이상의 비밀번호를 입력해주세요."
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
              <span className="font-medium text-blue-600 hover:text-blue-500">
                로그인
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(SignUp, false);
