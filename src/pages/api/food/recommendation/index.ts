// path : pages/api/food/recommendation/index.ts

// 음식 추천 api
// POST /api/food/recommendation
// gpt4를 이용하여 음식 추천
// 입력으로 카테고리(한식, 중식, 일식, 양식, 분식), 시간대(아침, 점심, 저녁, 야식)을 받는다.
// 현재 날짜를 기준으로 제외기간 안에 있는 음식은 추천하지 않는다.
// 좋아하는 음식은 추천하고 싫어하는 음식은 추천하지 않는다.
// gpt 프롬프트 예시
// 최근에 음식과 싫어하는 음식을 제외하고 좋아하는 음식을 보고 {점심}에 먹을 {한식}을 추천해주세요.
// 최근에 먹은 음식 : "김치찌개", "된장찌개", "김치볶음밥", "김치전"
// 싫어하는 음식 : "콩나물국밥", "라면", "떡볶이"

import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";
import { admin } from "@/firebase/firebaseAdmin";
import OpenAI from "openai";

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

type Food = {
  foodname: string;
  category: string;
  time: string;
  hateFoods: string[];
  exclusionPeriod: number;
  history: string[];
  exclusionFoods: string[];
};

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    if (req.method === "POST") {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        organization: process.env.NEXT_PUBLIC_OPENAI_ORGANIZATION,
      });

      const { category, time } = req.body;
      const decodedToken = req.user;

      // 싫어하는 음식 가져오기
      const foodDocRef = admin
        .firestore()
        .doc(`users/${decodedToken.uid}/foods/${decodedToken.uid}`);
      const foodDoc = await foodDocRef.get();
      const hateFoods = foodDoc.data()?.hate;

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
          const foodDate = food.date.toDate();
          return foodDate.getTime() > exclusionDate.getTime();
        })
        .map((food) => {
          return food.foodname;
        });

      // gpt4
      // 프롬프트
      const prompt = `최근에 먹은 음식 : ${exclusionFoods}, 싫어하는 음식 : ${hateFoods} , json 형식 : {menu: "추천 음식 이름", description: "추천 이유 설명"}`;

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
              content: `최근에 음식과 싫어하는 음식을 제외하고 좋아하는 음식을 보고 ${time}에 먹을 ${category}을 추천해주세요.`,
            },
          ],
          response_format: { type: "json_object" },
        });
        console.log(response.choices[0].message.content);

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
