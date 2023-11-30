// path : mealchoice/src/pages/home.tsx
import React from "react";
import FoodCategory from "@/components/FoodCategory";
import FoodCard from "@/components/FoodCard";
import withAuth from "@/hooks/withAuth";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center flex-grow mx-10">
      <div className="text-3xl text-center font-bold mb-3">오늘 뭐 먹지?</div>
      <div className="mt-5">
        <FoodCategory />
      </div>
      <div>
        <FoodCard />
      </div>
    </div>
  );
};

export default withAuth(Home);
