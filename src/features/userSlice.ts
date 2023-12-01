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
  food: {
    exclusionPeriod: number;
    hate: string[];
    like: string[];
  };
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
  food: {
    exclusionPeriod: 1,
    hate: [],
    like: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    LoginSuccessReducers: (state, action: PayloadAction<UserState>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
      state.food = action.payload.food;
    },
    LogoutSuccessReducers: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.food = {
        exclusionPeriod: 1,
        hate: [],
        like: [],
      };
    },
    EditDisplayNameReducers: (state, action: PayloadAction<string>) => {
      state.user!.displayName = action.payload; // user가 null이 아닐 때만 작동
    },

    // 제외 기간 설정
    setExclusionPeriodReducers: (state, action: PayloadAction<number>) => {
      state.food.exclusionPeriod = action.payload;
    },

    removeFoodReducers: (
      state,
      action: PayloadAction<{ foodname: string; type: "like" | "hate" }>
    ) => {
      const { foodname, type } = action.payload;
      if (type === "like") {
        // 'like' 배열에 id에 해당하는 음식을 제거합니다.
        state.food.like = state.food.like.filter((food) => food !== foodname);
      } else if (type === "hate") {
        // 'hate' 배열에 id에 해당하는 음식을 제거합니다.
        state.food.hate = state.food.hate.filter((food) => food !== foodname);
      }
    },

    // 음식 추가
    addFoodReducers: (
      state,
      action: PayloadAction<{ foodname: string; type: "like" | "hate" }>
    ) => {
      const { foodname, type } = action.payload;
      if (type === "like") {
        // 'like' 배열에 id에 해당하는 음식을 추가합니다.
        state.food.like.push(foodname);
      } else if (type === "hate") {
        // 'hate' 배열에 id에 해당하는 음식을 추가합니다.
        state.food.hate.push(foodname);
      }
    },
  },
});

export const {
  LoginSuccessReducers,
  LogoutSuccessReducers,
  EditDisplayNameReducers,
  setExclusionPeriodReducers,
  removeFoodReducers,
  addFoodReducers,
} = userSlice.actions;

const persistConfig = {
  key: "user",
  storage: sessionStorage,
};

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedReducer;
