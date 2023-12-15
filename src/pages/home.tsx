// path : mealchoice/src/pages/home.tsx
import React from "react";
import FoodCategory from "@/components/FoodCategory";
import FoodCard from "@/components/FoodCard";
import withAuth from "@/hooks/withAuth";
import { GetServerSideProps } from "next";
import { admin } from "@/firebase/firebaseAdmin";
import nookies from "nookies";

// getServerSideProps로 DB에 api key가 있는지 확인
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // 요청에서 쿠키를 가져옵니다.
    const cookies = nookies.get(context);
    const token = cookies.authToken; // 쿠키에서 토큰 추출

    // 토큰 검증
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 성공하면 DB에서 api key가 있는지 확인
    const userSnapshot = await admin
      .firestore()
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    const userData = userSnapshot.data();

    // 있으면 true, 없으면 false
    const hasApiKey = !!userData?.apiKey;

    return {
      props: {
        hasApiKey,
      },
    };
  } catch (error) {
    return { props: { hasApiKey: false } };
  }
};

// 홈 페이지
const Home = ({ hasApiKey }: { hasApiKey: boolean }) => {
  return (
    <div className="flex flex-col min-h-screen justify-center flex-grow mx-10">
      <div className="text-3xl text-center font-bold mb-3">오늘 뭐 먹지?</div>
      <div className="mt-5">
        <FoodCategory />
      </div>
      <div>
        <FoodCard hasApiKey={hasApiKey} />
      </div>
    </div>
  );
};

export default withAuth(Home);
