// path : mealchoice/src/hooks/witAuth.tsx
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/store";
import { auth, db } from "@/firebase/firebasedb"; // 파이어베이스 인증 모듈 임포트
import {
  LoginSuccessReducers,
  LogoutSuccessReducers,
} from "@/features/userSlice";
import { getDoc, doc, setDoc } from "firebase/firestore";

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
const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  needAuth = true
) => {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state: RootState) => state.user);

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

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          // Firebase 인증에서 제공하는 기본 사용자 정보
          const userData = {
            uid: user.uid,
            email: user.email ?? "",
            displayName: user.displayName ?? "",
            photoURL: user.photoURL ?? "",
          };

          // Firestore에서 추가적인 사용자 데이터 가져오기
          const foodData = await getsetFoodData(user.uid);

          dispatch(
            LoginSuccessReducers({
              isLoggedIn: true,
              user: userData,
              food: foodData,
            })
          );
        } else {
          dispatch(LogoutSuccessReducers());
        }
      });

      return () => unsubscribe();
    }, [dispatch]);

    useEffect(() => {
      if (needAuth && !isLoggedIn) {
        router.push("/");
      } else if (!needAuth && isLoggedIn) {
        router.push("/home");
      }
    }, [isLoggedIn, router]);

    return isLoggedIn || !needAuth ? <WrappedComponent {...props} /> : null;
  };

  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthComponent;
};

export default withAuth;
