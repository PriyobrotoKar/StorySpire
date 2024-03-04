import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: number = -1;

export const FollowerCountSlice = createSlice({
  name: "followCount",
  initialState,
  reducers: {
    receiveFollowers: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
    decreaseFollowers: (state, action: PayloadAction<number>) => {
      return action.payload - 1;
    },
    increaseFollowers: (state, action: PayloadAction<number>) => {
      return action.payload + 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { decreaseFollowers, increaseFollowers, receiveFollowers } =
  FollowerCountSlice.actions;

export default FollowerCountSlice.reducer;
