// path: mealchoice/src/middleware/verifyAuthToken.ts

import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { admin } from "@/firebase/firebaseAdmin";

// 미들웨어 함수를 생성합니다. next는 선택적으로 사용할 수 있습니다.
export const verifyAuthToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next?: () => void
) => {
  const cookies = parseCookies({ req });
  const token = cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 쿠키에 없습니다." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next && next();
  } catch (error) {
    return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }
};
