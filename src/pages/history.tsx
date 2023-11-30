// path : mealchoice/src/pages/history.tsx

import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import withAuth from "@/hooks/withAuth";

const testhistorydata = [
  {
    historyId: 1,
    date: "2023-11-01",
    category: "한식",
    time: "아침",
    menu: "김치찌개",
    memo: "맛있게 먹었어요3",
  },
  {
    historyId: 2,
    date: "2023-11-02",
    category: "중식",
    time: "점심",
    menu: "된장찌개",
    memo: "맛있게 먹었어요2",
  },
  {
    historyId: 3,
    date: "2023-11-03",
    category: "일식",
    time: "저녁",
    menu: "초밥",
    memo: "맛있게 먹었어요1",
  },
];

const History = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  // 달력에서 월 선택하면 해당 월의 데이터만 보여주기
  const [historydata, setHistorydata] = useState(testhistorydata);
  // 달력 드롭다운으로 월 선택(현재)
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  // 달력 드롭다운으로 연도 선택(현재)
  const [year, setYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();

  const filteredHistoryData = historydata.filter(
    (item) =>
      new Date(item.date).getFullYear() === year &&
      new Date(item.date).getMonth() + 1 === month
  );

  // 필터링된 히스토리 데이터가 없을 때 보여줄 메시지
  const renderEmptyMessage = () => (
    <div className="text-center py-10">
      <p className="text-gray-600">선택하신 날짜에 대한 히스토리가 없습니다.</p>
    </div>
  );

  const [slideIn, setSlideIn] = useState(false);

  // 왼쪽 화살표를 눌렀을 때의 동작
  const handlePrevClick = () => {
    setSlideIn(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex - 1);
      setSlideIn(false);
    }, 250); // 애니메이션 지속 시간에 맞춰 타이머 설정
  };

  // 오른쪽 화살표를 눌렀을 때의 동작
  const handleNextClick = () => {
    setSlideIn(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setSlideIn(false);
    }, 250); // 애니메이션 지속 시간에 맞춰 타이머 설정
  };

  // 왼쪽 화살표
  const PrevArrow = ({ onClick }: { onClick: () => void }) => {
    return (
      <div
        className="absolute top-1/2 left-4 bg-white rounded-full shadow-md"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>
    );
  };

  // 오른쪽 화살표
  const NextArrow = ({ onClick }: { onClick: () => void }) => {
    return (
      <div
        className="absolute top-1/2 right-4 bg-white rounded-full shadow-md"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="text-2xl font-bold mt-10 mb-5">히스토리</div>
      <div className="flex justify-center items-center mb-20 space-x-4 ">
        {/* 연도 */}
        <select
          className="border border-gray-300 p-2 text-sm"
          value={year}
          onChange={(e) => {
            setYear(Number(e.target.value));
          }}
        >
          {Array.from({ length: 21 }, (_, i) => (
            <option key={currentYear - i} value={currentYear - i}>
              {currentYear - i}년
            </option>
          ))}
        </select>

        {/* 월 */}
        <select
          className="border border-gray-300 p-2 text-sm"
          value={month}
          onChange={(e) => {
            setMonth(Number(e.target.value));
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}월
            </option>
          ))}
        </select>
      </div>

      {/* 카드 목록 */}
      <div className="w-full max-w-2xl px-5 overflow-hidden mb-20">
        {filteredHistoryData.length === 0 ? (
          renderEmptyMessage()
        ) : (
          <div className="relative grid grid-cols-1 gap-4">
            {/* 왼쪽 화살표 (첫 데이터가 아닐 때만 표시) */}
            {currentIndex > 0 && (
              <div
                className="absolute left-0 z-10"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <PrevArrow onClick={handlePrevClick} />
              </div>
            )}

            {/* 현재 인덱스의 데이터를 보여줌 */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center">
              {/* 데이터 내용은 여기에 배치 */}
              <p className="font-bold text-xl mb-2">
                {filteredHistoryData[currentIndex].menu}
              </p>
              <p className="mb-2">{filteredHistoryData[currentIndex].date}</p>
              <p className="mb-2">{filteredHistoryData[currentIndex].time}</p>
              <p className="mb-2">
                {filteredHistoryData[currentIndex].category}
              </p>
              <p className="mb-2">{filteredHistoryData[currentIndex].memo}</p>
            </div>

            {/* 오른쪽 화살표 (마지막 데이터가 아닐 때만 표시) */}
            {currentIndex < filteredHistoryData.length - 1 && (
              <div
                className="absolute right-0 z-10"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <NextArrow onClick={handleNextClick} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(History);
