// pages/api/food/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/firebasedb";
import { collection, getDocs, doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const foodCollectionRef = collection(db, "food");

  if (req.method === "GET") {
    try {
      const snapshot = await getDocs(foodCollectionRef);
      const foods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { uid, like, hate } = req.body;
      
      const userDocRef = doc(db, "food", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        await setDoc(userDocRef, { like: [], hate: [] });
      }

      // 
      await updateDoc(userDocRef, {
        like: arrayUnion(...like),
        hate: arrayUnion(...hate),
      });

      res.status(201).json({ message: "Food added successfully" });
    } catch (error) {
      res.status(400).json({ error: "Bad Request" });
    }
  }
}
