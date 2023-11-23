// path : mealchoice/src/pages/apis/auth/signup/index.ts
// 회원가입 API
// 입력값 : 이메일, 비밀번호, 이름
// 출력값 : 성공 여부
// 회원가입시 파이어베이스에 저장만 하고 로그인으로 넘어가지 않도록 함
// 파이어베이스에 저장할 것
// users[uid] -> 이메일, 이름, 프로필 사진("/default-profile.png")
// foods[uid] -> 제외기간(0), 싫어하는 음식([]), 좋아하는 음식([])

import { NextApiRequest, NextApiResponse } from "next";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { app, db } from "@/firebase/firebasedb";
import { FIREBASE_ERRORS } from "@/firebase/errors";

interface FirebaseError extends Error {
  code: keyof typeof FIREBASE_ERRORS;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = getAuth(app);

  if (req.method === "POST") {
    const { email, password, name } = req.body; // 'name'으로 받아옴
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 이름과 기본 프로필 사진으로 프로필 업데이트
      await updateProfile(userCredential.user, {
        displayName: name, // 'displayName' 대신 'name' 사용
        photoURL: "/default-profile.png",
      });

      // users 컬렉션에 사용자 문서 생성
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        email,
        name, // 'displayName' 대신 'name' 사용
        profilePic: "/default-profile.png",
      });

      // 해당 사용자의 foods 하위 컬렉션에 문서 생성
      const foodsRef = doc(
        collection(db, "users", userCredential.user.uid, "foods")
      );
      await setDoc(foodsRef, {
        ExclusionPeriod: 1,
        hate: [],
        like: [],
      });

      res.status(200).json({ success: true });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as FirebaseError;
        const errorMessage =
          FIREBASE_ERRORS[firebaseError.code] ||
          "회원가입 처리 중 오류가 발생했습니다.";
        res.status(400).json({ error: errorMessage });
      } else {
        res
          .status(400)
          .json({ error: "회원가입 처리 중 오류가 발생했습니다." });
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
