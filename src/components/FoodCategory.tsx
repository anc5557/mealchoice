import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCategoryReducers, setTimeReducers } from "../features/foodSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const FoodCategory = () => {
  const category = useSelector((state: RootState) => state.food.category);
  const time = useSelector((state: RootState) => state.food.time);

  const [localCategory, setLocalCategory] = useState(category);
  const [localTime, setLocalTime] = useState(time);

  const dispatch = useDispatch();

  const categories = ["한식", "중식", "일식", "양식", "분식"];
  const times = ["아침", "점심", "저녁", "야식"];

  const onClickCategory = (newCategory: string) => {
    setLocalCategory(newCategory);
    dispatch(setCategoryReducers(newCategory));
  };

  const onClickTime = (newTime: string) => {
    setLocalTime(newTime);
    dispatch(setTimeReducers(newTime));
  };

  return (
    <div className="flex flex-col justify-center items-center border-2 border-gray-300 rounded-t-lg w-full">
      <div className="flex flex-row my-4">
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
      <div className="flex flex-row mb-4">
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
  );
};

export default FoodCategory;
