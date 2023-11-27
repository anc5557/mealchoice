// path : mealchoice/src/pages/api/food/setExclusionPeriod.ts
// 입력값 : days
// 출력값 : 성공시 200, 실패시 403

import type { NextApiRequest, NextApiResponse } from "next";
import { admin } from "@/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    if (req.method === "POST") {
      try {
        const { days } = req.body;
        const decodedToken = (req as any).user;

        const foodDocRef = admin
          .firestore()
          .doc(`users/${decodedToken.uid}/foods/${decodedToken.uid}`);
        await foodDocRef.update({ exclusionPeriod: days });

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
  });
};

export default handler;
