// path : pages/api/food/recommendation/index.ts

// 음식 추천 api
import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";
import { admin } from "@/firebase/firebaseAdmin";
import OpenAI from "openai";

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    if (req.method === "POST") {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        organization: process.env.NEXT_PUBLIC_OPENAI_ORGANIZATION,
      });

      const { category, time } = req.body;
      const decodedToken = req.user;

      // 음식 가져오기
      const foodDocRef = admin
        .firestore()
        .doc(`users/${decodedToken.uid}/foods/${decodedToken.uid}`);
      const foodDoc = await foodDocRef.get();
      const likeFoods = foodDoc.data()?.like; // 좋아요 음식
      const hateFoods = foodDoc.data()?.hate; // 싫어요 음식

      // 제외기간 가져오기
      const exclusionPeriod = foodDoc.data()?.exclusionPeriod;

      // history 컬렉션 가져오기
      const historyCollectionRef = admin
        .firestore()
        .collection(`users/${decodedToken.uid}/history`);
      const historyCollection = await historyCollectionRef.get();
      const history = historyCollection.docs.map((doc) => doc.data());

      // 현재 날짜
      const today = new Date();
      // 제외기간
      const exclusionDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - exclusionPeriod
      );

      const exclusionFoods = history
        .filter((food) => {
          const foodDate = new Date(food.date);
          return foodDate.getTime() > exclusionDate.getTime();
        })
        .map((food) => {
          return food.foodname;
        });

      // gpt4
      // 프롬프트
      const prompt = `최근에 먹은 음식 : ${exclusionFoods}, 싫어하는 음식 : ${hateFoods}, 좋아하는 음식 : ${likeFoods}
      , json 형식 : {menu: "추천 음식 이름", description: "추천 이유 설명"}`;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4-1106-preview",
          messages: [
            {
              role: "system",
              content: prompt,
            },
            {
              role: "user",
              content: `최근에 음식과 싫어하는 음식을 제외하고 좋아하는
               음식을 보고 ${time}에 먹을 ${category}을 추천해주세요.`,
            },
          ],
          response_format: { type: "json_object" },
        });

        return res
          .status(200)
          .json({ success: true, data: response.choices[0].message.content });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({
        success: false,
        message: `${req.method} 메서드는 허용되지 않습니다.`,
      });
    }
  });
};

export default handler;
