import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { LogoutSuccess } from "../features/userSlice";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { useAuth } from "../hooks/useAuth";
import { ProfilePicture } from "../components/ProfilePicture";
import { DisplayName } from "../components/DisplayName";
import withAuth from "@/hooks/withAuth";
import { useFood } from "@/hooks/useFood";
import  { parseCookies } from "nookies";

const MyInfoPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const exclusionPeriod = useSelector(
    (state: RootState) => state.user.food.exclusionPeriod
  );
  const dispatch = useDispatch();
  const { handleEditDisplayName } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");
  
  // 로그아웃을 처리합니다.
  const handleLogout = useCallback(() => {
    dispatch(LogoutSuccess());
    router.push("/");
  }, [dispatch]);

  // 닉네임 수정을 시작
  const startEdit = useCallback(() => setIsEditing(true), []);
  // 닉네임 수정을 취소
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setNewDisplayName(user?.displayName || "");
  }, [user]);

  // 수정된 닉네임을 저장
  const confirmEdit = useCallback(async () => {
    if (user && newDisplayName) {
      await handleEditDisplayName(newDisplayName);
      setIsEditing(false);
    }
  }
  , [handleEditDisplayName, newDisplayName, user]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await confirmEdit();
    },
    [confirmEdit]
  );

  const { updateExclusionPeriod } = useFood();

  const handleExclusionPeriodChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("Selected value:", event.target.value);
    const days = parseInt(event.target.value, 10);
    
    // 선택된 기간을 저장합니다.
    await updateExclusionPeriod(days);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        {user ? (
          <div className="flex items-center space-x-6 mb-4 mt-4">
            <ProfilePicture src={user.photoURL || ""} alt="프로필 사진" />
            <div className="flex flex-col justify-center">
              <DisplayName
                isEditing={isEditing}
                name={user.displayName}
                startEdit={startEdit}
                newDisplayName={newDisplayName}
                setNewDisplayName={setNewDisplayName}
                confirmEdit={confirmEdit}
                cancelEdit={cancelEdit}
              />
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
            value={exclusionPeriod} 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-1/3 p-2.5"
            onChange={handleExclusionPeriodChange} 
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

export default withAuth(MyInfoPage);
