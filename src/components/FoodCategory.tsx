import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCategory, setTime } from "../features/foodSlice";

const FoodCategory = () => {
  const [localCategory, setLocalCategory] = useState("한식");
  const [localTime, setLocalTime] = useState("점심");

  const dispatch = useDispatch();

  const categories = ["한식", "중식", "일식", "양식", "분식", "카페"];
  const times = ["아침", "점심", "저녁", "야식"];

  const onClickCategory = (newCategory: string) => {
    setLocalCategory(newCategory);
    dispatch(setCategory(newCategory));
  };

  const onClickTime = (newTime: string) => {
    setLocalTime(newTime);
    dispatch(setTime(newTime));
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>음식 카테고리</h1>
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-lg p-4">
          <div className="flex flex-row justify-center items-center mb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${
                  localCategory === cat ? "bg-blue-500" : "bg-gray-400"
                } text-white font-bold py-1 px-2 rounded mr-1`}
                onClick={() => onClickCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-row justify-center items-center">
            {times.map((t) => (
              <button
                key={t}
                className={`${
                  localTime === t ? "bg-red-500" : "bg-gray-400"
                } text-white font-bold py-1 px-2 rounded mr-1`}
                onClick={() => onClickTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCategory;
