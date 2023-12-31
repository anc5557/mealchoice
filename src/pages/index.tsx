// path : mealchoice/src/pages/index.tsx

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import withAuth from "@/hooks/withAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";

const Index = () => {
  const { handleSocialLogin } = useAuth();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="mb-5 text-center">
        <div className="text-center">
          <div className="mb-5">
            <Image
              src="/logo.svg"
              alt="Sales TOP Logo"
              width={200}
              height={200}
              className="mb-3 mx-auto"
              priority
            />
            <h2 className="text-5xl font-bold mb-6">Hello!</h2>
            <p className="text-gray-600">음식 메뉴 초이스</p>
            <p className="text-gray-600 mb-10">
              음식 메뉴를 추천하는 서비스입니다.
            </p>
          </div>
          <div>
            <div className="flex flex-col justify-center items-center ">
              <Link href="/signin">
                <button className="w-44 py-2 px-4 bg-blue-600 text-white font-bold rounded-full mb-4">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="w-44 py-2 px-4 bg-white text-gray-700 font-bold rounded-full border-2 border-gray-600">
                  SignUp
                </button>
              </Link>
            </div>
            <div className="flex flex-col justify-between my-5">
              <p>Or</p>
              <p className="text-center text-gray-600 mt-5">
                소셜 계정으로 로그인하기
              </p>
            </div>
            <div className="flex justify-center space-x-5">
              <button
                aria-label="Github login"
                onClick={() => handleSocialLogin("github")}
              >
                <FontAwesomeIcon icon={faGithub} size="3x" />
              </button>
              <button
                aria-label="Google login"
                onClick={() => handleSocialLogin("google")}
              >
                <FontAwesomeIcon icon={faGoogle} size="3x" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Index, false);
