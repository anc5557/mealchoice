// path : mealchoice/src/hooks/useFood.ts
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  setExclusionPeriodReducers,
  addFoodReducers,
  removeFoodReducers,
} from "../features/userSlice";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { useState } from "react";

interface FirebaseError extends Error {
  code: keyof typeof FIREBASE_ERRORS;
}

export const useFood = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [food, setFood] = useState<{
    name: string;
    description: string;
  } | null>(null);

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

  // 음식 가져오는 함수
  const getFood = async (reaction: "like" | "hate") => {
    try {
      const response = await axios.get(`/api/food/${reaction}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("음식 가져오기에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    }
  };

  // 음식을 삭제하는 함수
  const removeFood = async (foodname: string, reaction: "like" | "hate") => {
    try {
      const response = await axios.delete(`/api/food/${reaction}`, {
        data: { foodname },
        withCredentials: true,
      });

      if (response.status === 200) {
        dispatch(removeFoodReducers({ foodname, type: reaction }));
        return response.data;
      } else {
        throw new Error("음식 삭제에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    }
  };

  // 음식 추천 함수
  const recommendFood = async (category: string, time: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/food/recommendation`,
        {
          category,
          time,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.success) {
        const responseData = JSON.parse(response.data.data);
        setFood({
          name: responseData.menu,
          description: responseData.description,
        });
      } else {
        throw new Error("음식 추천에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 음식 결정 함수
  const addHistory = async (
    foodname: string,
    description: string,
    date: Date,
    category: string,
    time: string,
    memo: string
  ) => {
    try {
      const response = await axios.post(
        `/api/food/recommendation/decsion`,
        {
          foodname,
          description,
          date,
          category,
          time,
          memo,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("음식 추가에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    }
  };

  // 을식 싫어요 함수
  const hateFood = async (foodname: string) => {
    try {
      const response = await axios.post(
        `/api/food/recommendation/hate`,
        {
          foodname,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        dispatch(addFoodReducers({ foodname, type: "hate" }));
        return response.data;
      } else {
        throw new Error("음식 추가에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const likeFood = async (foodname: string) => {
    try {
      const response = await axios.post(
        `/api/food/recommendation/like`,
        {
          foodname,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        dispatch(addFoodReducers({ foodname, type: "like" }));
        return response.data;
      } else {
        throw new Error("음식 추가에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return {
    food,
    isLoading,
    updateExclusionPeriod,
    removeFood,
    recommendFood,
    addHistory,
    hateFood,
    getFood,
    likeFood,
    
  };
};

export default useFood;
