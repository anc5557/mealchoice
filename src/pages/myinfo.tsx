// path : mealchoice/src/pages/myinfo.tsx

// 내 정보 페이지
// 로그인한 사용자의 정보를 보여주고, 로그아웃을 할 수 있습니다.
// 사용자 정보에는 이메일, 닉네임, 프로필 사진이 있습니다.
// 좋아하는 음식 메뉴를 선택할 수 있는 페이지로 이동할 수 있는 버튼이 있습니다.
// 최근에 먹은 음식을 제외할 수 있는 기능이 있는데 며칠간 제외할지 선택할 수 있습니다. select 태그를 사용합니다.

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logOut } from '../features/userSlice'; // 가정: logout 액션 생성자가 있다고 가정함
import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';

const MyInfoPage = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    // 로그아웃 핸들러
    const handleLogout = () => {
        dispatch(logOut());
        router.push('/');        
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-6 mb-4">
                    <div className="shrink-0">
                        <Image
                            src={(user as { profilePic?: string }).profilePic || '/default-profile.png'}
                            alt="Profile Picture"
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                    </div>
                    {/* <div>
                        <div className="font-bold text-lg">{user?.displayName || 'No Name'}</div>
                        <div className="text-gray-500">{user?.email || 'No Email'}</div>
                    </div> */}
                </div>
                <div>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={handleLogout}
                    >
                        로그아웃
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <Link href="/favorite-food">
                    <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">좋아하는 음식 설정</span>
                </Link>
            </div>

            <div className="mt-6">
                <label htmlFor="exclude-food" className="block mb-2 text-sm font-medium text-gray-900">최근에 먹은 음식 제외 기간</label>
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
        </div>
    );
};

export default MyInfoPage;
