// path : mealchoice/src/pages/api/verifyToken.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { admin } from '@/firebase/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
    }

    // 토큰 검증
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Decoded Token:', decodedToken);

    // 토큰이 유효한 경우 추가 작업 수행
    res.status(200).json({ message: '토큰이 유효합니다.', uid: decodedToken.uid });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
}
