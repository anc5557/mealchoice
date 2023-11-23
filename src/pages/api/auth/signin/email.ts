// path: mealchoice/src/pages/api/auth/login/email.ts
// 입력값 : 이메일, 비밀번호
// 출력값 : 성공 여부, 사용자 정보, 토큰, 음식 정보

import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase/firebasedb";
import { setCookie } from "nookies";
import { FIREBASE_ERRORS } from "@/firebase/errors";

interface FirebaseError extends Error {
  code: keyof typeof FIREBASE_ERRORS;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = getAuth(app);
  const db = getFirestore(app); // Firestore 초기화

  if (req.method === "POST") {
    const { email, password } = req.body;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ); // 로그인
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        profilePic: userCredential.user.photoURL,
      };
      const token = await userCredential.user.getIdToken();

      // Firestore에서 사용자의 foods 하위 컬렉션에서 음식 정보 가져오기
      const foodsRef = doc(
        db,
        "users",
        userCredential.user.uid,
        "foods",
        "preferences"
      );
      const foodsSnap = await getDoc(foodsRef);
      let food = null;

      if (foodsSnap.exists()) {
        food = foodsSnap.data();
      } else {
        throw new Error("사용자의 음식 정보를 찾을 수 없습니다.");
      }

      setCookie({ res }, "access_token", token, {
        maxAge: 3600,
        httpOnly: true,
        path: "/",
      });

      // 사용자 정보와 함께 food 정보를 응답에 포함시킴
      res.status(200).json({ user, food, token });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as FirebaseError;
        const errorMessage =
          FIREBASE_ERRORS[firebaseError.code] ||
          "로그인 처리 중 오류가 발생했습니다.";
        res.status(401).json({ error: errorMessage });
      } else {
        res.status(401).json({ error: "로그인 처리 중 오류가 발생했습니다." });
      }
    }
  } else {
    // POST 요청이 아닐 경우
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
export default handler;
