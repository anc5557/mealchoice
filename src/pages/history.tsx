// path : mealchoice/src/pages/history.tsx

import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import withAuth from "@/hooks/withAuth";
import nookies from "nookies";
import { admin } from "@/firebase/firebaseAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

interface HistoryProps {
  historyData: {
    id: string;
    date: string;
    category: string;
    time: string;
    foodname: string;
    description: string;
    memo: string;
  }[];
  error?: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // 요청에서 쿠키를 가져옵니다.
    const cookies = nookies.get(context);
    const token = cookies.authToken; // 쿠키에서 토큰 추출

    // 토큰이 없으면 에러 처리
    if (!token) {
      return {
        redirect: {
          destination: "/login", // 로그인 페이지로 리디렉션
          permanent: false,
        },
      };
    }

    // 토큰 검증
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 토큰이 유효하면 DB에서 데이터를 가져옵니다.
    const historySnapshot = await admin
      .firestore()
      .collection("users")
      .doc(decodedToken.uid) // 토큰에서 추출한 UID를 사용하여 사용자의 데이터를 가져옴
      .collection("history")
      .get();

    const historyData = historySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 가져온 데이터를 페이지의 props로 넘겨줌
    return {
      props: { historyData },
    };
  } catch (error) {
    // 인증 에러 또는 다른 에러가 발생한 경우 에러 처리
    console.error("Error fetching history", error);

    // 에러 페이지로 리디렉트하거나 에러 메시지를 props로 전달
    return {
      props: { error: "데이터를 불러오는데 실패했습니다." },
    };
  }
};
const History: React.FC<HistoryProps> = ({ historyData, error }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  // 달력에서 월 선택하면 해당 월의 데이터만 보여주기
  const [historydata, setHistorydata] = useState(historyData || []);
  // 달력 드롭다운으로 월 선택(현재)
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  // 달력 드롭다운으로 연도 선택(현재)
  const [year, setYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredHistoryData = historydata.filter(
    (item: { date: string }) =>
      new Date(item.date).getFullYear() === year &&
      new Date(item.date).getMonth() + 1 === month
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h12", // 24시간 표기법 사용
    };

    // 날짜와 시간을 각각 포맷팅
    const formattedDate = date.toLocaleDateString("ko-KR", dateOptions);
    const formattedTime = date.toLocaleTimeString("ko-KR", timeOptions);

    // '오전 8:46' 형식의 시간 문자열을 '8시 46분' 형식으로 변환
    const timeString = formattedTime.replace(":", "시 ") + "분";

    return `${formattedDate} ${timeString}`;
  };

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
        className="absolute top-1/2 left-3 bg-white rounded-full shadow-md"
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </div>
    );
  };

  // 오른쪽 화살표
  const NextArrow = ({ onClick }: { onClick: () => void }) => {
    return (
      <div
        className="absolute top-1/2 right-3 bg-white rounded-full shadow-md"
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faArrowRight} size="lg" />
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-2xl font-bold mt-10 mb-5">히스토리</div>
      <div className="flex justify-center items-center mb-6 space-x-4">
        {/* 연도 */}
        <select
          className="border border-gray-300 p-2 text-sm rounded-lg"
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
          className="border border-gray-300 p-2 text-sm rounded-lg"
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
            <div className="bg-white shadow-md border border-gray-400 rounded-xl px-8 pt-6 pb-8 mb-4 flex flex-col items-center">
              {/* 데이터 내용은 여기에 배치 */}
              <p className="font-bold text-xl mb-4">
                {filteredHistoryData[currentIndex].foodname}
              </p>
              <p className="mb-2">
                {formatDate(filteredHistoryData[currentIndex].date)}
              </p>
              <div className="flex justify-center space-x-2">
                <p>{filteredHistoryData[currentIndex].time} </p>
                <p className="mb-4">
                  {filteredHistoryData[currentIndex].category}
                </p>
              </div>
              <div className="flex justify-center mb-2">
                <p className="mx-2">메모</p>
                <button className="" onClick={() => {}}>
                  <FontAwesomeIcon icon={faPenToSquare} size="xl" />
                </button>
              </div>
              <p className="m-3 p-3 border shadow-md border-gray-300 rounded-xl text-center overflow-y-auto w-auto h-32 scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                {filteredHistoryData[currentIndex].description}
              </p>
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
