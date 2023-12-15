// path : pages/api/food/recommendation/like.ts

// 음식 싫어요 api
import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";
import admin from "@/firebase/firebaseAdmin";

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    if (req.method === "POST") {
      const { foodname } = req.body; // 좋아요 음식 이름
      const decodedToken = req.user;

      const foodDocRef = admin
        .firestore()
        .doc(`users/${decodedToken.uid}/foods/${decodedToken.uid}`);

      // 좋아요 음식 추가
      await foodDocRef.update({
        like: admin.firestore.FieldValue.arrayUnion(foodname),
      });

      res.status(200).json({ message: "success" });
    }
  });
};

export default handler;
