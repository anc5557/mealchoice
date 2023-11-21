// path : src/features/foodSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";

// Define a type for the slice state
interface FoodState {
  category: string;
  time: string;
}

// Define the initial state using that type
const initialState: FoodState = {
  category: '한식', // 기본값
  time: '점심',     // 기본값
};

export const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    // 카테고리 설정
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    // 시간대 설정
    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
    },
  },
});

// Export the actions
export const { setCategory, setTime } = foodSlice.actions;

const persistConfig = {
    key: "food",
    storage : sessionStorage,
  };

const persistedReducer = persistReducer(persistConfig, foodSlice.reducer);

export default persistedReducer;

  