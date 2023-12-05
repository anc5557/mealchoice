// src/pages/api/auth/destroyCookie.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 쿠키 삭제 (옵션으로 path 설정 추가)
    destroyCookie({ res }, "authToken", { path: "/" });

    // 성공 응답 전송
    res.status(200).json({ message: "로그아웃 성공, 쿠키 삭제됨" });
  } catch (error) {
    // 에러 처리
    res.status(500).json({ message: "서버 에러 발생" });
  }
}
