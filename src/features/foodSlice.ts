// path : src/features/foodSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";

// Define a type for the slice state
interface FoodState {
  category: string;
  time: string;
  exclusionperiod: number;
}

// Define the initial state using that type
const initialState: FoodState = {
  category: '한식',
  time: '점심', 
  exclusionperiod: 1, 

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
    // 제외기간 설정
    setExclusionPeriod: (state, action: PayloadAction<number>) => {
      state.exclusionperiod = action.payload;
    }
  },
});

// Export the actions
export const { setCategory, setTime, setExclusionPeriod} = foodSlice.actions;

const persistConfig = {
    key: "food",
    storage : sessionStorage,
  };

const persistedReducer = persistReducer(persistConfig, foodSlice.reducer);

export default persistedReducer;

  