import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LoginDetails {
  email: string;
  passowrd: string;
}

const initialState: LoginDetails = {
  email: "",
  passowrd: "",
};

export const loginDetailsSlice = createSlice({
  name: "loginDetails",
  initialState,
  reducers: {
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updatePassword: (state, action: PayloadAction<string>) => {
      state.passowrd = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateEmail, updatePassword } = loginDetailsSlice.actions;

export default loginDetailsSlice.reducer;
