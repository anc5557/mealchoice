// path : mealchoice/src/pages/api/food/setExclusionPeriod.ts
// 입력값 : days
// 출력값 : 성공시 200, 실패시 403

import type { NextApiRequest, NextApiResponse } from "next";
import { admin } from "@/firebase/firebaseAdmin";
import { parseCookies } from "nookies";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { days } = req.body; // days: 제외기간

      // 토큰 검증
      const cookies = parseCookies({ req });
      const token = cookies.authToken;
      const decodedToken = await admin.auth().verifyIdToken(token);

      // 제외기간 업데이트
      const foodDocRef = admin.firestore().doc(`users/${decodedToken.uid}/foods/${decodedToken.uid}`);
      await foodDocRef.update({ exclusionPeriod: days });

      // 응답
      res
        .status(200)
        .json({ message: "Exclusion period updated successfully" });
    } catch (error) {
      res.status(403).json({ error: "Forbidden" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
export default handler;
