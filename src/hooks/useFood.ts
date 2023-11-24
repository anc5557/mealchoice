// path : mealchoice/src/hooks/useFood.ts
import { useDispatch } from "react-redux";
import axios from "axios";
import {FIREBASE_ERRORS}  from "@/firebase/errors";
import { setExclusionPeriod } from "@/features/userSlice";


interface FirebaseError extends Error {
  code: keyof typeof FIREBASE_ERRORS;
}


export const useFood = () => {
  const dispatch = useDispatch();

  const handleError = (error: any) => {
    console.error("An error occurred:", error.message || error.toString());
  };

  const updateExclusionPeriod = async (days: number) => {
      try {
        const response = await axios.post(
          "/api/food/setExclusionPeriod",
          { days },
          { withCredentials: true }
        );
    
        if (response.status === 200) {
          // 리덕스 스토어에 저장된 사용자 정보 업데이트
          dispatch(setExclusionPeriod(days));

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

  return { updateExclusionPeriod };
};
export default useFood;
