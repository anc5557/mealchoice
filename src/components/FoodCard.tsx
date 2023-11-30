// path: mealchoice/src/components/FoodCard.tsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo,
  faCheck,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import useFood from "@/hooks/useFood";

interface Food {
  name: string;
  description: string;
}

const FoodCard = () => {
  const reduxfood = useSelector((state: RootState) => state.food);

  const { food, isLoading, handelRecommend } = useFood();

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
            onClick={() => handelRecommend(reduxfood.category, reduxfood.time)}
            disabled={isLoading}
          >
            추천받기
          </button>
        ) : (
          <div className="flex space-x-6">
            {/* 결정 버튼 */}
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                isLoading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            {/* 다시 버튼 */}
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={() =>
                handelRecommend(reduxfood.category, reduxfood.time)
              }
            >
              <FontAwesomeIcon icon={faUndo} />
            </button>
            {/* 싫어요 버튼 */}
            <button
              className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
                isLoading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isLoading}
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
