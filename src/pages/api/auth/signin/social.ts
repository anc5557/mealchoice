// path: mealchoice/src/pages/api/auth/login/social.ts
// 입력값 : 소셜 로그인 방법(google, github)
// 출력값 : 성공 여부, 사용자 정보, 토큰, 음식 정보

import { NextApiRequest, NextApiResponse } from "next";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "@/firebase/firebasedb";
import { setCookie } from "nookies";
import { FIREBASE_ERRORS } from "@/firebase/errors";

interface FirebaseError extends Error {
  code: keyof typeof FIREBASE_ERRORS;
}

// providerMap의 타입을 명시적으로 지정합니다.
const providerMap: {
  [key in "google" | "github"]: GoogleAuthProvider | GithubAuthProvider;
} = {
  google: new GoogleAuthProvider(),
  github: new GithubAuthProvider(),
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const provider: "google" | "github" = req.body.provider;
  const auth = getAuth(app);
  const db = getFirestore(app);

  if (req.method === "POST") {
    try {
      const authProvider = providerMap[provider];
      if (!authProvider) {
        res
          .status(400)
          .json({ error: "지원하지 않는 소셜 로그인 방법입니다." });
        return;
      }

      const result = await signInWithPopup(auth, authProvider); // 소셜 로그인
      const user = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        profilePic: result.user.photoURL,
      };
      const token = await result.user.getIdToken();

      // Firestore에서 사용자의 foods 하위 컬렉션에서 음식 정보 가져오기
      const foodsRef = doc(
        db,
        "users",
        result.user.uid,
        "foods",
        "preferences"
      );
      const foodsSnap = await getDoc(foodsRef);

      let foodData;
      if (foodsSnap.exists()) {
        foodData = foodsSnap.data();
      } else {
        // 문서가 없는 경우, 기본 food 데이터를 생성합니다.
        foodData = { ExclusionPeriod: 1, hate: [], like: [] };
        await setDoc(foodsRef, foodData);
      }

      setCookie({ res }, "access_token", token, {
        maxAge: 3600,
        httpOnly: true,
        path: "/",
      });

      res.status(200).json({ user, token, food: foodData });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as FirebaseError;
        const errorMessage =
          FIREBASE_ERRORS[firebaseError.code] ||
          "소셜 로그인 처리 중 오류가 발생했습니다.";
        res.status(401).json({ error: errorMessage });
      } else {
        res
          .status(401)
          .json({ error: "소셜 로그인 처리 중 오류가 발생했습니다." });
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
