// hooks/useAuth.ts
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { LoginSuccess } from "../features/userSlice";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { auth, db } from "../firebase/firebasedb";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import axios from "axios";


// 유저, 토큰, 음식 타입 정의
interface Data {
  user: {
    uid: string;
    email: string;
    displayName: string;
    profilePic: string;
  };
  token: string;
  food: {
    exclusionPeriod: number;
    hate: string[];
    like: string[];
  };
}

interface FirebaseError extends Error {
  code: keyof typeof FIREBASE_ERRORS;
}

// 소셜 로그인 타입 정의
type ProviderType = "google" | "github";

// 초기화
const providerMap: {
  [key in ProviderType]: GoogleAuthProvider | GithubAuthProvider;
} = {
  google: new GoogleAuthProvider(),
  github: new GithubAuthProvider(),
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // 음식 데이터 가져오기 
  // 데이터가 없으면 db에 기본값으로 저장
  const getsetFoodData = async (uid: string): Promise<Data["food"]> => {
    const foodsRef = doc(db, "users", uid, "foods", "preferences");
    const foodsSnap = await getDoc(foodsRef);
  
    if (foodsSnap.exists()) {
      return foodsSnap.data() as Data["food"]; // 적절한 타입 캐스팅
    } else {
      // 기본 음식 데이터
      const defaultFoodData: Data["food"] = {
        exclusionPeriod: 1,
        hate: [],
        like: [],
      };
      await setDoc(foodsRef, defaultFoodData);
      return defaultFoodData; // 기본값을 반환
    }
  };
  
  
    
  // 회원가입, 로그인, 소셜 로그인 실패시 실행되는 함수
  const handleError = (error: any) => {
    console.error("An error occurred:", error.message || error.toString());
  };

  // 소셜로그인
  const handleSocialLogin = async (providerType: ProviderType) => {
    const provider = providerMap[providerType];

    if (!provider) {
      console.error("Unsupported social login method.");
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);

      // user 정보
      const user = {
        uid: result.user.uid,
        email: result.user.email ?? "",
        displayName: result.user.displayName ?? "",
        profilePic: result.user.photoURL ?? "",
      };

      // token 정보
      const token = await result.user.getIdToken();

      // food 정보
      const food = await getsetFoodData(result.user.uid);

      // 쿠키에 토큰 저장
      setCookie(null, "access_token", token, {
        maxAge: 3600,
        httpOnly: true,
        path: "/",
      });

      dispatch(
        LoginSuccess({
          isLoggedIn: true,
          user,
          food,
          token,
        })
      );

      router.push("/home");
    } catch (error) {
      console.error("Social login error:", error);
    }
  };

  // email 로그인
  const handleEmailLogin = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // user 정보
      const user = {
        uid: result.user.uid,
        email: result.user.email ?? "",
        displayName: result.user.displayName ?? "",
        profilePic: result.user.photoURL ?? "",
      };

      // token 정보
      const token = await result.user.getIdToken();

      // food 정보
      const food = await getsetFoodData(result.user.uid);

      // 쿠키에 토큰 저장
      setCookie(null, "access_token", token, {
        maxAge: 3600,
        httpOnly: true,
        path: "/",
      });

      dispatch(
        LoginSuccess({
          isLoggedIn: true,
          user,
          food,
          token,
        })
      );

      router.push("/home");
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as FirebaseError;
        const errorMessage =
          FIREBASE_ERRORS[firebaseError.code] ||
          "로그인 처리 중 오류가 발생했습니다.";
        handleError(errorMessage);
      } else {
        handleError("로그인 처리 중 오류가 발생했습니다.");
      }
    }
  };

  // email 회원가입
  // 회원가입만, DB에 저장만 하고 로그인은 안함
  const handleEmailSignup = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 이름과 기본 프로필 사진으로 프로필 업데이트
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: "/default-profile.png",
      });

      // users 컬렉션에 사용자 문서 생성
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        email,
        name,
        profilePic: "/default-profile.png",
      });

      // 해당 사용자의 foods 하위 컬렉션에 문서 생성
      const foodsRef = doc(
        db,
        "users",
        userCredential.user.uid,
        "foods",
        "preferences"
      );
      await setDoc(foodsRef, {
        ExclusionPeriod: 1,
        hate: [],
        like: [],
      });


      router.push("/sigin");
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as FirebaseError;
        const errorMessage =
          FIREBASE_ERRORS[firebaseError.code] ||
          "회원가입 처리 중 오류가 발생했습니다.";
        handleError(errorMessage);
      } else {
        handleError("회원가입 처리 중 오류가 발생했습니다.");
      }
    }
  };

  // displayName 변경 함수
  // API 라우트 사용, axios 사용
  // 입력 : displayName, token
  // 출력 : 성공 메시지
  const handleEditDisplayName  = async (displayName: string, token: string) => {
    try {
      const response = await axios.post(
        "/api/auth/myinfo/editDisplayName",
        { displayName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("사용자 정보 변경에 실패했습니다.");
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as FirebaseError;
        const errorMessage =
          FIREBASE_ERRORS[firebaseError.code] ||
          "사용자 정보 변경에 실패했습니다.";
        handleError(errorMessage);
      } else {
        handleError("사용자 정보 변경에 실패했습니다.");
      }
    }
  };

  return {
    handleSocialLogin,
    handleEmailLogin,
    handleEmailSignup,
    handleEditDisplayName,
  };
};

export default useAuth;
