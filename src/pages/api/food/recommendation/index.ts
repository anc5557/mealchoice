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

interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    if (req.method === "POST") {
      try {
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

        // history 가져오기
        const historyDocRef = admin
          .firestore()
          .doc(`users/${decodedToken.uid}/history`);

        console.log("historyDocRef : ", historyDocRef);

        console.log("hateFoods : ", hateFoods);
        console.log("exclusionPeriod : ", exclusionPeriod);
        //console.log("history : ", history);
        console.log("category : ", category);
        console.log("time : ", time);


        res.status(200).json({ success: true });
      } catch (error) {
        res
          .status(401)
          .json({ success: false, message: "요청을 처리할 수 없습니다." });
      }
    }
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({
            success: false,
            message: `${req.method} 메서드는 허용되지 않습니다.`,
        });
        }
  });
};

export default handler;
