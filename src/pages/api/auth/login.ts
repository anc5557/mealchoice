// path : src/api/auth/login.ts

import { setAuthCookies } from "next-firebase-auth";
import initAuth from "@/firebase/initAuth";
import { NextApiRequest, NextApiResponse } from "next";

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await setAuthCookies(req, res, { token: undefined });
  } catch (e: any) {
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ success: true });
};

export default handler;
