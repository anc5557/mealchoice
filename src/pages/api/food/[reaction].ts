// pages/api/food/[foodname].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { admin } from "@/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    const { reaction } = req.query;
    const decodedToken = req.user;
    const userDocRef = admin
      .firestore()
      .doc(`users/${decodedToken.uid}/foods/${decodedToken.uid}`);

    if (req.method === "DELETE") {
      try {
        const { foodname } = req.body;

        if (reaction === "hate") {
          await userDocRef.update({
            hate: admin.firestore.FieldValue.arrayRemove(foodname),
          });
        } else if (reaction === "like") {
          await userDocRef.update({
            like: admin.firestore.FieldValue.arrayRemove(foodname),
          });
        } else {
          throw new Error("Invalid reaction value");
        }

        res.status(200).json({ success: true });
      } catch (error) {
        res
          .status(401)
          .json({ success: false, message: "요청을 처리할 수 없습니다." });
      }
    } else if (req.method === "GET") {
      try {
        const userDoc = await userDocRef.get();
        const userDocData = userDoc.data();

        if (reaction === "hate") {
          res.status(200).json({ hate: userDocData?.hate });
        } else if (reaction === "like") {
          res.status(200).json({ like: userDocData?.like });
        } else {
          throw new Error("Invalid reaction value");
        }
      } catch (error) {
        res
          .status(401)
          .json({ success: false, message: "요청을 처리할 수 없습니다." });
      }
    } else {
      res.setHeader("Allow", "DELETE");
      res.status(405).end("Method Not Allowed");
    }
  });
};

export default handler;
