// path: mealchoice/src/components/FoodCard.tsx

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo,
  faCheck,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import useFood from "@/hooks/useFood";
import { toast } from "react-toastify";

interface Food {
  name: string;
  description: string;
}

const FoodCard = () => {
  const reduxfood = useSelector((state: RootState) => state.food);
  const { food, isLoading, recommendFood, addHistory, hateFood, likeFood } =
    useFood();

  // 좋아요, 싫어요 버튼 상태 관리
  const [isOk, setIsOk] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleOK = async () => {
    if (isOk) {
      toast.error("이미 결정하셨습니다.");
      return;
    }

    if (!food) {
      toast.error("음식 정보가 없습니다.");
      return;
    }

    try {
      // addHistory 함수
      await addHistory(
        food.name,
        food.description,
        new Date(),
        reduxfood.category,
        reduxfood.time,
        ""
      );
      setIsLiked(true);
      setIsDisliked(true);
      toast.success("좋아요! 이 음식으로 결정하셨습니다. 기록에서 확인하세요.");
    } catch (error) {
      toast.error("실패했습니다.");
    }
  };

  const handleLike = async () => {
    if (isLiked) {
      toast.error("이미 좋아요를 누르셨습니다.");
      return;
    }

    if (!food) {
      toast.error("음식 정보가 없습니다.");
      return;
    }

    try {
      // likeFood 함수
      await likeFood(food.name);

      setIsOk(true);
      setIsLiked(true);
      setIsDisliked(true);
      toast.success("이 음식을 좋아요 목록에 추가했습니다..");
    } catch (error) {
      toast.error("실패했습니다.");
    }
  };

  const handleDislike = async () => {
    if (isDisliked) {
      toast.error("이미 싫어요를 누르셨습니다.");
      return;
    }

    if (!food) {
      toast.error("음식 정보가 없습니다.");
      return;
    }

    try {
      // hateFood 함수
      await hateFood(food.name);
      setIsOk(true);
      setIsLiked(true);
      setIsDisliked(true);
      toast.success("이 음식을 추천에서 제외했습니다.");
    } catch (error) {
      toast.error("싫어요 실패했습니다.");
    }
  };

  const handleRecommend = () => {
    recommendFood(reduxfood.category, reduxfood.time);
    setIsOk(false);
    setIsLiked(false);
    setIsDisliked(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* 로딩 중 UI */}
      <div className="flex flex-col items-center border-2 border-t-0 border-gray-300 h-80 w-full relative overflow-scroll">
        {isLoading ? (
          // 로딩 상태일 때 보여질 UI
          <div className="absolute inset-0 flex justify-center items-center ">
            <div className="text-lg font-semibold">추천 중...</div>
            <div className="spinner"></div>
          </div>
        ) : food ? (
          // 음식 정보가 있을 때 보여질 UI
          <div className="flex flex-col items-center  px-5">
            <div className="text-xl font-bold mt-10 mb-5">
              {reduxfood.time}으로 {reduxfood.category} 음식 추천
            </div>
            <div className="mb-5">{food.name}</div>
            <div className="mb-10">{food.description}</div>
          </div>
        ) : (
          // 음식 정보가 없을 때 초기 상태 UI
          <div className="flex flex-col items-center px-5">
            <div className="text-2xl font-bold mt-20 mb-5">
              추천 버튼을 눌러주세요
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-center border-2 border-gray-300 border-t-0 rounded-b-lg w-full py-4">
        {!food ? (
          <button
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              isLoading && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleRecommend}
            disabled={isLoading}
          >
            추천받기
          </button>
        ) : (
          <div className="flex space-x-6">
            {/* 결정 버튼 */}
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                (isLoading || isLiked) && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isLoading || isLiked}
              onClick={handleOK}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            {/* 다시 버튼 */}
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleRecommend}
            >
              <FontAwesomeIcon icon={faUndo} />
            </button>
            {/* 좋아요 버튼 */}
            <button
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
                (isLoading || isLiked) && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isLoading || isLiked}
              onClick={handleLike}
            >
              <FontAwesomeIcon icon={faThumbsUp} />{" "}
            </button>

            {/* 싫어요 버튼 */}
            <button
              className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
                (isLoading || isDisliked) && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isLoading || isDisliked}
              onClick={handleDislike}
            >
              <FontAwesomeIcon icon={faThumbsDown} />{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
