// pages/api/history/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";
import { admin } from "@/firebase/firebaseAdmin";

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    if (req.method === "GET") {
      const decodedToken = req.user;

      try {
        const historyCollectionRef = admin
          .firestore()
          .collection(`users/${decodedToken.uid}/history`);

        const snapshot = await historyCollectionRef.get();
        const history = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        res.status(200).json(history);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.setHeader("Allow", "GET");
      res.status(405).end("Method Not Allowed");
    }
  });
};
