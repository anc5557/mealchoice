// path : mealchoice/src/pages/index.tsx

import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app, db } from "../firebase/firebasedb";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../features/userSlice";
import { RootState } from "../store";
import { setDoc, doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function Index() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user); // 사용자 정보를 가져옵니다.

  // 로그인 상태 확인
  useEffect(() => {
    if (user) {
      router.push("/home"); // 로그인 상태이면 홈 페이지로 리디렉션합니다.
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth(app); // firebase 인증 객체를 가져옵니다.
      const provider = new GoogleAuthProvider(); // 구글 로그인을 위한 provider 객체를 만듭니다.
      const result = await signInWithPopup(auth, provider); // 팝업창을 띄우고 구글 로그인을 합니다.

      const user = {
        uid: result.user.uid,
        email: result.user.email ?? "",
        displayName: result.user.displayName ?? "",
        profilePic: result.user.photoURL ?? "",
      };

      dispatch(logIn(user)); // Redux store에 사용자 정보 저장

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, "users", user.uid), { ...user });

      router.push("/home");
    } catch (error) {
      console.error(error);
      // 에러 처리 로직을 추가할 수 있습니다.
    }
  };

  const handleGithubLogin = async () => {
    try {
      const auth = getAuth(app); // firebase 인증 객체를 가져옵니다.
      const provider = new GithubAuthProvider(); // 구글 로그인을 위한 provider 객체를 만듭니다.
      const result = await signInWithPopup(auth, provider); // 팝업창을 띄우고 구글 로그인을 합니다.

      const user = {
        uid: result.user.uid,
        email: result.user.email ?? "",
        displayName: result.user.displayName ?? "",
        profilePic: result.user.photoURL ?? "",
      };

      dispatch(logIn(user)); // Redux store에 사용자 정보 저장

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, "users", user.uid), { ...user });

      router.push("/home");
    } catch (error) {
      console.error(error);
      // 에러 처리 로직을 추가할 수 있습니다.
    }
  };

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
                <button className="w-36 py-2 px-4 bg-blue-600 text-white font-bold rounded-full mb-4">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="w-36 py-2 px-4 bg-white text-gray-700 font-bold rounded-full border-2 border-gray-600">
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
              <button aria-label="Github login" onClick={handleGithubLogin}>
                <Image
                  src="/github-mark.svg"
                  alt="Github login"
                  width={40}
                  height={40}
                />
              </button>
              <button aria-label="Google login" onClick={handleGoogleLogin}>
                <Image
                  src="/web_light_rd_na.svg"
                  alt="Google Login"
                  width={40}
                  height={40}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
