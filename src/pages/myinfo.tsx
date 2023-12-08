//path : src/pages/myinfo.tsx

import React, { useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  LogoutSuccessReducers,
  EditProfileImageReducers,
} from "../features/userSlice";
import router from "next/router";
import { useAuth } from "../hooks/useAuth";
import { ProfilePicture } from "../components/ProfilePicture";
import { DisplayName } from "../components/DisplayName";
import withAuth from "@/hooks/withAuth";
import { useFood } from "@/hooks/useFood";
import FoodModal from "../components/FoodModal"; // 모달창
import "../styles/globals.css";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebasedb";
import axios from "axios";

const MyInfoPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const exclusionPeriod = useSelector(
    (state: RootState) => state.user.food.exclusionPeriod
  );
  const dispatch = useDispatch();
  const { handleEditDisplayName, handleEditProfileImage } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");
  const { removeFood } = useFood();

  // 모달창
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"like" | "hate">("like");
  const likeFoodList = useSelector((state: RootState) => state.user.food.like);
  const hateFoodList = useSelector((state: RootState) => state.user.food.hate);

  // 모달창 열기
  const openModal = useCallback((type: "like" | "hate") => {
    setModalType(type);
    setIsModalOpen(true);
  }, []);

  // 모달창 닫기
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // 모달에서 음식을 삭제하는 함수
  const handleRemoveFood = async (foodname: string) => {
    await removeFood(foodname, modalType);
    toast.success("삭제했습니다.");
  };

  // 로그아웃을 처리합니다.
  const handleLogout = useCallback(async () => {
    try {
      // Firebase에서 로그아웃
      await signOut(auth);
      await axios.post("/api/auth/destroyCookie");

      // 리덕스 스토어 업데이트
      dispatch(LogoutSuccessReducers());

      // 홈페이지로 리디렉션
      router.push("/");

      // 로그아웃 성공 메시지를 표시
      toast.success("로그아웃 되었습니다.");
    } catch (error) {
      // 로그아웃 실패 메시지를 표시
      toast.error("로그아웃에 실패했습니다.");
      console.error("로그아웃 실패:", error);
    }
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
    setIsLoading(true); // 로딩 시작
    try {
      if (user && newDisplayName) {
        await handleEditDisplayName(newDisplayName);
        setIsEditing(false);
        toast.success("닉네임이 변경되었습니다.");
      }
    } catch (error) {
      toast.error("닉네임 변경에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  }, [handleEditDisplayName, newDisplayName, user]);

  const { updateExclusionPeriod } = useFood();

  const handleExclusionPeriodChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const days = parseInt(event.target.value, 10);

    // 선택된 기간을 저장합니다.
    await updateExclusionPeriod(days);
    toast.success("설정이 저장되었습니다.");
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await handleEditProfileImage(file);
        if (response && response.data && response.data.photoURL) {
          dispatch(EditProfileImageReducers(response.data.photoURL)); // 스토어 업데이트
          toast.success("프로필 이미지가 업데이트 되었습니다.");
        }
      } catch (error) {
        toast.error("이미지 업로드에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="container mx-auto p-4">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="spinner"></div>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
      <div className="bg-white shadow rounded-lg p-6">
        {user ? (
          <div className="flex items-center space-x-6 mb-4 mt-4">
            <ProfilePicture
              src={user.photoURL || ""}
              alt="프로필 사진"
              onClick={handleProfilePictureClick}
            />
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
        <div className="mt-6">
          <label
            htmlFor="food-settings"
            className="block mb-3 text-lg font-medium text-gray-900"
          >
            음식 설정
          </label>
          <div className="flex space-x-3">
            {/* 좋아하는 음식 설정 버튼 */}
            <button
              onClick={() => openModal("like")}
              className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              좋아하는 음식
            </button>
            {/* 싫어하는 음식 설정 버튼 */}
            <button
              onClick={() => openModal("hate")}
              className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              싫어하는 음식
            </button>
          </div>
        </div>
        {isModalOpen && (
          <FoodModal
            type={modalType}
            isOpen={isModalOpen}
            onClose={closeModal}
            foodList={modalType === "like" ? likeFoodList : hateFoodList}
            onRemoveFood={handleRemoveFood}
          />
        )}
      </div>
    </div>
  );
};

export default withAuth(MyInfoPage);
