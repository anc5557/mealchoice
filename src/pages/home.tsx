// path : mealchoice/src/pages/home.tsx
import React, { useState } from "react";
import FoodCategory from "@/components/FoodCategory";
import FoodCard from "@/components/FoodCard";
import withAuth from "@/hooks/withAuth";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>홈 페이지</h1>

      <FoodCategory />
      <FoodCard />
    </div>
  );
};

export default withAuth(Home);
