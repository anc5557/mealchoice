// path : api/history/[historyId].ts

import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";
import { admin } from "@/firebase/firebaseAdmin";

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    const { historyId } = req.query;
    const decodedToken = req.user;

    if (req.method === "PATCH") {
      try {
        const memo = req.body.memo; // 메모 내용을 req.body에서 추출
        const historyDocRef = admin
          .firestore()
          .doc(`users/${decodedToken.uid}/history/${historyId}`);

        // 히스토리 문서에 memo 필드 업데이트
        await historyDocRef.update({ memo });

        res.status(200).json({ message: "Memo updated successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.setHeader("Allow", "PATCH");
      res.status(405).end("Method Not Allowed");
    }
  });
};

export default handler;
