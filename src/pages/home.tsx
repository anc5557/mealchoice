// path : mealchoice/src/pages/home.tsx
import React, { useState } from "react";
import FoodCategory from "@/components/FoodCategory";
import FoodCard from "@/components/FoodCard";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>홈 페이지</h1>

      <FoodCategory />
      <FoodCard />
    </div>
  );
}
