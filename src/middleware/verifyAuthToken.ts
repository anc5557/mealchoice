// path: mealchoice/src/middleware/verifyAuthToken.ts

import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import admin from "@/firebase/firebaseAdmin";

// NextApiRequest에 user 추가
interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
}

// 인증 토큰이 쿠키에 있는지 확인
export const verifyAuthToken = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next?: () => Promise<void>
) => {
  const cookies = parseCookies({ req }); // 쿠키 파싱
  const token = cookies.authToken; // 쿠키에서 토큰 추출

  // 토큰이 없으면 401 에러 반환
  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 쿠키에 없습니다." });
  }

  // 토큰이 유효한지 확인
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid }; // req.user에 uid 추가

    // next가 있으면 실행
    if (next) {
      await next();
    }
  } catch (error) {
    return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }
  // next가 없으면 200 반환
  if (!next) {
    res.status(200).end();
  }
};
