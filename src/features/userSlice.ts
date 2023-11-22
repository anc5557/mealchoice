// features/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";

interface UserState {
  isLoggedIn: boolean;
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
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
        photoURL?: string;
      }>
    ) => {
      // `user` 객체가 null이 아닐 때만 상태를 업데이트
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = {
          uid: action.payload.uid,
          email: action.payload.email,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL || "",
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

    updateDisplayName: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.displayName = action.payload;
      }
    },
  },
});

export const { logIn, logOut, updateUserProfile, updateDisplayName } = userSlice.actions;

const persistConfig = {
  key: "user",
  storage : sessionStorage,
};

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedReducer;
