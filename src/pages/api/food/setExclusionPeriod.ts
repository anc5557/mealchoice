// path : mealchoice/src/pages/api/food/setExclusionPeriod.ts
// 입력값 : days
// 출력값 : 성공시 200, 실패시 403

import type { NextApiRequest, NextApiResponse } from "next";
import admin from "@/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

/**
 * 음식 제외 기간을 설정
 * @swagger
 * @description 음식 제외 기간을 설정하는 API
 * @param req - cookie, body {days}
 * @param res - 200: 성공, 403: 실패, 405: 허용되지 않은 메소드, 500: 서버 오류, 401: 인증 토큰이 쿠키에 없음
 */
const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  try {
    await verifyAuthToken(req, res, async () => {
      if (req.method === "POST") {
        const { days } = req.body; // days 추출
        const decodedToken = req.user;

        const foodDocRef = admin
          .firestore()
          .doc(`users/${decodedToken.uid}/foods/${decodedToken.uid}`);
        await foodDocRef.update({ exclusionPeriod: days });

        res
          .status(200)
          .json({ message: "Exclusion period updated successfully" });
      } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
