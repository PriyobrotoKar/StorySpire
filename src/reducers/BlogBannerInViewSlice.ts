import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = true;

export const BlogBannerInViewSlice = createSlice({
  name: "BlogBannerInView",
  initialState,
  reducers: {
    updateViewStatus: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateViewStatus } = BlogBannerInViewSlice.actions;

export default BlogBannerInViewSlice.reducer;
