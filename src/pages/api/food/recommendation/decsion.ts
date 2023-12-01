// path : pages/api/food/recommendation/decsion.ts

// 음식 히스토리에 추가 api

import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";
import { admin } from "@/firebase/firebaseAdmin";

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    if (req.method === "POST") {
      // 히스토리에 추가할 음식 정보
      const { foodname, description, date, category, time, memo } = req.body;
      const decodedToken = req.user;

      // 히스토리 컬렉션 가져오기
      const historyCollectionRef = admin
        .firestore()
        .collection(`users/${decodedToken.uid}/history`);

      // 히스토리에 추가(문서 id는 자동 생성)
      await historyCollectionRef.add({
        foodname,
        description,
        date,
        category,
        time,
        memo,
      });

      res.status(200).json({ message: "success" });
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  });
};
