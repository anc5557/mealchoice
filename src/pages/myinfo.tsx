import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logOut } from "../features/userSlice";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { useAuth } from "../hooks/useAuth";

const MyInfoPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const { handleEditDisplayName } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");

  // 로그아웃 핸들러
  const handleLogout = () => {
    dispatch(logOut());
    router.push("/");
  };

  const startEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNewDisplayName(user?.displayName || "");
  };

  const confirmEdit = async () => {
    await handleEditDisplayName(newDisplayName);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleEditDisplayName(newDisplayName);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        {user ? (
          <div className="flex items-center space-x-6 mb-4 mt-4">
            <div className="relative shrink-0">
              <Image
                src={user.profilePic || ""}
                alt="프로필 사진"
                width={100}
                height={100}
                className="rounded-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm">사진 변경</span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center mb-1">
                {!isEditing ? (
                  <>
                    <div className="text-2xl font-medium text-gray-800 mr-2">
                      {user.displayName}
                    </div>
                    <button
                      className="rounded-full hover:bg-gray-200 transition-color"
                      onClick={startEdit}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="text-2xl font-medium text-gray-800 mr-2 w-full max-w-full box-border border border-gray-400 rounded-lg mr-2"
                    />
                    <button
                      className="rounded-full hover:bg-gray-200 transition-color"
                      onClick={confirmEdit}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-green-500 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </button>
                    <button
                      className="rounded-full hover:bg-gray-200 transition-color"
                      onClick={cancelEdit}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <div className="text-gray-500 text-sm">{user.email}</div>
            </div>
          </div>
        ) : (
          <div>사용자 정보가 없습니다.</div>
        )}
        <div className="flex justify-end">
          <span
            className="text-red-500 cursor-pointer underline"
            onClick={handleLogout}
          >
            로그아웃
          </span>
        </div>

        <div className="mt-5 mb-10">
          <label
            htmlFor="exclude-food"
            className="block mb-3 text-lg font-medium text-gray-900"
          >
            최근에 먹은 음식 제외 기간
          </label>
          <select
            id="exclude-food"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-1/3 p-2.5"
          >
            <option value="1">1일</option>
            <option value="3">3일</option>
            <option value="7">7일</option>
            <option value="14">14일</option>
          </select>
        </div>
        <div className="mt-6  ">
          <label
            htmlFor="exclude-food"
            className="block mb-3 text-lg font-medium text-gray-900"
          >
            음식 설정
          </label>
          <div className="flex space-x-3">
            <Link href="/favorite-food">
              <span className="px-3 py-2 text-sm  bg-blue-500 text-white rounded hover:bg-blue-600 ">
                좋아하는 음식
              </span>
            </Link>
            <Link href="/hate-food">
              <span className="px-3 py-2 text-sm  bg-red-500 text-white rounded hover:bg-red-600">
                싫어하는 음식
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfoPage;
