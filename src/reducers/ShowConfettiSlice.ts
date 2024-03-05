import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

export const ShowConfettiSlice = createSlice({
  name: "ShowConfetti",
  initialState,
  reducers: {
    updateShowConfetti: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateShowConfetti } = ShowConfettiSlice.actions;

export default ShowConfettiSlice.reducer;
