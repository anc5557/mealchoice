// pages/api/food/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/firebasedb";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query as { id: string };

  if (req.method === "DELETE") {
    try {
      const { foodName, type } = req.body; // foodName: 삭제할 음식 이름, type: 'like' 또는 'hate'

      const userDocRef = doc(db, "food", id);
      const updateObject = { [type]: arrayRemove(foodName) };

      await updateDoc(userDocRef, updateObject);

      res.status(200).json({ message: "Food deleted successfully" });
    } catch (error) {
      res.status(404).json({ error: "Not Found" });
    }
  }
}
