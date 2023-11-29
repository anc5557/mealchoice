// path : mealchoice/src/hooks/useFood.ts
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  setExclusionPeriodReducers,
  removeFoodReducers,
} from "../features/userSlice";
import { FIREBASE_ERRORS } from "@/firebase/errors";

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
        // 리덕스 스토어에 저장된 제외 기간 업데이트
        dispatch(setExclusionPeriodReducers(days));

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

  // 음식을 삭제하는 함수
  const removeFood = async (foodname: string, hateOrLike: "like" | "hate") => {
    try {
      const response = await axios.delete(`/api/food/${foodname}`, {
        data: { hateOrLike },
        withCredentials: true,
      });

      if (response.status === 200) {
        // 리덕스 스토어에 저장된 푸드 업데이트
        dispatch(removeFoodReducers({ foodname, type: hateOrLike }));
      } else {
        throw new Error("음식 삭제에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    }
  };

  // 음식 추천 함수
  const handelRecommend = async (category: string, time: string) => {
    try {
      const response = await axios.post(`/api/food/recommendation`, {
        category,
        time
      }, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("음식 추천에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    }
  };



  return { updateExclusionPeriod, removeFood, handelRecommend };
};

export default useFood;
