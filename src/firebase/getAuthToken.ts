import { auth } from "@/firebase/firebasedb";

// 현재 로그인된 사용자의 인증 토큰을 가져오는 함수
const getAuthToken = async (): Promise<string> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("사용자가 로그인하지 않았습니다.");
  }
  return currentUser.getIdToken();
};

export default getAuthToken;
