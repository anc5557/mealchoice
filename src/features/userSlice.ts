// features/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface UserState {
  isLoggedIn: boolean;
  user: {
    uid: string;
    email: string;
    displayName: string;
    profilePic?: string;
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null, // 초기 상태에서 user를 null로 설정
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (
      state,
      action: PayloadAction<{
        uid: string;
        email: string;
        displayName: string;
        profilePic?: string;
      }>
    ) => {
      // `user` 객체가 null이 아닐 때만 상태를 업데이트
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = {
          uid: action.payload.uid,
          email: action.payload.email,
          displayName: action.payload.displayName,
          profilePic: action.payload.profilePic || "",
        };
      }
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.user = null; // 로그아웃 시 user를 null로 설정
    },
    // 사용자 프로필 업데이트를 위한 추가 액션
    updateUserProfile: (state, action: PayloadAction<UserState["user"]>) => {
      if (state.isLoggedIn && state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { logIn, logOut, updateUserProfile } = userSlice.actions;

const persistConfig = {
  key: "user",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedReducer;
