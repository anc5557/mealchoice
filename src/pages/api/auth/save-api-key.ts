// path : src/pages/api/auth/save-api-key.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";
import admin from "@/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    if (req.method === "POST") {
      try {
        // 검증된 토큰 가져오기
        const decodedToken = req.user; // 유저 정보
        const uid = decodedToken.uid; // 유저 uid
        const { apiKey } = req.body; // 요청받은 apikey

        // 파이어스토어에서 users 컬렉션에 해당 uid에 apikey 필드에 요청받은 apikey 수정, 없으면 생성
        const userDocRef = admin.firestore().doc(`users/${uid}/`);
        await userDocRef.set({ apiKey: apiKey }, { merge: true });

        res.status(200).json({ success: true, message: "API 키 저장 성공" });
      } catch (error) {
        console.error("API 키 저장 중 오류 발생", error);
        res.status(500).json({
          success: false,
          message: "API 키 저장 중 서버 오류가 발생했습니다.",
        });
      }
    } else {
      // 다른 HTTP 메소드에 대해서는 405 Method Not Allowed 오류를 반환합니다.
      res.setHeader("Allow", "POST");
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
};

export default handler;
