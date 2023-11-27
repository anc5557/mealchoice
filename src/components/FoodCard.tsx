// path: mealchoice/src/components/FoodCard.tsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { PassThrough } from "stream";

interface Food {
  name: string;
  image: string;
}

const FoodCard = () => {
  const dispatch = useDispatch();
  const [food, setFood] = useState<Food | null>(null); // 추천 음식 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 1. 추천 음식 가져오기
  // 1-1. chatgpt에게 추천 음식 문장 생성 요청
  // 2. 추천 음식 결정
  // 3. 추천 음식 싫어요

  return null;
};

export default FoodCard;
