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
  token: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
  food: {
    exclusionPeriod: 1,
    hate: [],
    like: [],
  },
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    LoginSuccess: (state, action: PayloadAction<UserState>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
      state.food = action.payload.food;
      state.token = action.payload.token;
    },
    LogoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.food = {
        exclusionPeriod: 1,
        hate: [],
        like: [],
      };
      state.token = "";
    },
    EditDisplayName: (state, action: PayloadAction<string>) => {
      state.user!.displayName = action.payload; // user가 null이 아닐 때만 작동
    }
  },
});

export const {LoginSuccess, LogoutSuccess, EditDisplayName } = userSlice.actions;

const persistConfig = {
  key: "user",
  storage : sessionStorage,
};

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedReducer;
