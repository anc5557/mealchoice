import React, { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [buttonText, setButtonText] = useState("비밀번호 재설정 이메일 보내기");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
      setButtonText("다시 보내기");
    } catch (err) {
      setError("이메일 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };
  const gosignin = () => {
    router.push("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center slide-in-right">
      <div className="p-6 max-w-sm w-full bg-white  rounded-md">
        <div className="p-4">
          <button
            onClick={gosignin}
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
        <div className="flex justify-center mb-6">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} priority />
        </div>
        <div className="p-6 max-w-sm w-full bg-white rounded-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            비밀번호 재설정
          </h2>
          {message && <div className="alert">{message}</div>}
          {error && <div className="alert error">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium"
            >
              {buttonText}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/signin">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                로그인으로 돌아가기
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
