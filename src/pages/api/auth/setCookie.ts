import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";
import { admin } from "@/firebase/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { token } = req.body;

    // 토큰 검증
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // 쿠키 설정
    setCookie({ res }, "authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: "/",
    });

    res.status(200).json({ message: "로그인 성공, 쿠키 설정됨" });
  } catch (error) {
    console.error("Error:", error);
    res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }
}
