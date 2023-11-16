import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logOut } from "../features/userSlice";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

const MyInfoPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  // 로그아웃 핸들러
  const handleLogout = () => {
    dispatch(logOut());
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        {user ? (
          <div className="flex items-center space-x-6 mb-4 mt-4">
            <div className="shrink-0">
              <Image
                src={user.profilePic || ""}
                alt="프로필 사진"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-800">
                {user.displayName}
              </div>
              <div className="text-gray-500 text-sm">{user.email}</div>
            </div>
          </div>
        ) : (
          <div>사용자 정보가 없습니다.</div>
        )}


        <div className="mt-10">
          <label
            htmlFor="exclude-food"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            최근에 먹은 음식 제외 기간
          </label>
          <select
            id="exclude-food"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="1">1일</option>
            <option value="3">3일</option>
            <option value="7">7일</option>
            <option value="14">14일</option>
          </select>
        </div>
        <div className="mt-6">
          <Link href="/favorite-food">
            <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              좋아하는 음식 설정
            </span>
          </Link>
        </div>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4 focus:outline-none"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyInfoPage;
