// path : src/pages/api/auth/uploadProfileImage.ts

import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "@/middleware/verifyAuthToken";
import { admin } from "@/firebase/firebaseAdmin";
import Multer from "multer";
import { storage } from "@/firebase/firebasedb";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Multer에서 사용되는 파일 타입 정의
interface MulterFile {
  buffer: Buffer;
}

// NextApiRequest를 확장하면서 file 속성 추가
interface NextApiRequestWithUser extends NextApiRequest {
  user: { uid: string };
  file: MulterFile;
}

// multer 설정
const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const config = {
  api: {
    bodyParser: false, // POST 데이터 처리를 위해 false로 설정
  },
};

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  await verifyAuthToken(req, res, async () => {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
      return;
    }

    try {
      // Multer 미들웨어를 Promise로 감싸기
      await new Promise((resolve, reject) => {
        upload.single("file")(req as any, res as any, (err: any) => {
          if (err) reject(err);
          else resolve(null);
        });
      });

      // 토큰에서 uid 가져오기
      const decodedToken = req.user;

      // 파일이 없을 경우
      if (!req.file) {
        res.status(400).json({ error: "파일이 없습니다." });
        return;
      }

      // 파일 이름 설정
      const fileName = `${decodedToken.uid}.png`;
      // 파일 업로드
      const uploadSnapshot = await uploadBytes(
        ref(storage, `users/${decodedToken.uid}/profile/${fileName}`),
        req.file.buffer
      );

      // 업로드된 파일의 URL 가져오기
      const photoURL = await getDownloadURL(uploadSnapshot.ref);

      // 프로필 이미지 업데이트
      await admin.auth().updateUser(decodedToken.uid, { photoURL });

      // users 컬렉션에서 프로필 이미지 업데이트
      await admin
        .firestore()
        .collection("users")
        .doc(decodedToken.uid)
        .update({ photoURL });

      res.status(200).json({ message: "success", photoURL: photoURL });
    } catch (error) {
      // 구체적인 에러 메시지 제공
      res.status(500).json({ error: "파일 업로드 중 오류가 발생했습니다." });
    }
  });
};

export default handler;
