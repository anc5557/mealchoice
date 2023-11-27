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
import { LoginSuccess, EditDisplayName } from "../features/userSlice";
import { useRouter } from "next/router";
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
    photoURL: string;
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

  // 음식 데이터 가져오기 및 설정
  const getsetFoodData = async (uid: string): Promise<Data["food"]> => {
    // 문서 참조 생성 (users/{uid}/foods/{uid})
    const foodsRef = doc(db, "users", uid, "foods", uid);

    const foodsSnap = await getDoc(foodsRef);

    if (!foodsSnap.exists()) {
      // 기본 음식 데이터
      const defaultFoodData: Data["food"] = {
        exclusionPeriod: 1,
        hate: [],
        like: [],
      };
      await setDoc(foodsRef, defaultFoodData); // 문서가 없으면 기본 데이터로 문서 생성
    }

    return (await getDoc(foodsRef)).data() as Data["food"]; // 기존 또는 새로 생성된 문서의 데이터 반환
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
        photoURL: result.user.photoURL ?? "",
      };

      // Firestore에 사용자 정보 저장
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        { merge: true }
      );

      // token 정보
      const token = await result.user.getIdToken();

      // food 정보
      const food = await getsetFoodData(result.user.uid);

      // 쿠키에 토큰 저장
      await axios.post("/api/auth/setToken", { token });

      dispatch(
        LoginSuccess({
          isLoggedIn: true,
          user,
          food,
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
        photoURL: result.user.photoURL ?? "",
      };

      // Firestore에 사용자 정보 저장
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        { merge: true }
      ); // 기존 문서가 있으면 업데이트

      // token 정보
      const token = await result.user.getIdToken();

      // food 정보
      const food = await getsetFoodData(result.user.uid);

      // 쿠키에 토큰 저장
      await axios.post("/api/auth/setToken", { token });

      dispatch(
        LoginSuccess({
          isLoggedIn: true,
          user,
          food,
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
        photoURL: "/default-profile.png",
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
  // 입력 : displayName, 쿠키
  // 출력 : 성공 메시지
  const handleEditDisplayName = async (newDisplayName: string) => {
    try {
      const response = await axios.post(
        "/api/auth/editDisplayName",
        { newDisplayName },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // 리덕스 스토어에 저장된 사용자 정보 업데이트
        dispatch(EditDisplayName(newDisplayName));

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
