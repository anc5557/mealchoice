// path : mealchoice/src/pages/api/auth/editDisplayName.ts
// 입력값 : 토근, 닉네임
// 출력값 : 성공 여부

import { NextApiRequest, NextApiResponse } from "next";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { admin } from "@/firebase/firebaseAdmin";
import { parseCookies } from "nookies";

interface FirebaseError extends Error {
  code: keyof typeof FIREBASE_ERRORS;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { newDisplayName } = req.body;

      // 토큰 검증
      const cookies = parseCookies({ req });
      const token = cookies.authToken;
      const decodedToken = await admin.auth().verifyIdToken(token);

      // 토큰 검증 성공, 사용자의 이름을 업데이트합니다.
      await admin.auth().updateUser(decodedToken.uid, {
        displayName: newDisplayName,
      });

      // 제외기간 업데이트
      const userDocRef = admin.firestore().doc(`users/${decodedToken.uid}/`);
      await userDocRef.update({ displayName: newDisplayName });

      

      res.status(200).json({ success: true });
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "요청을 처리할 수 없습니다." });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
