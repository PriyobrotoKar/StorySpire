import BlogBannerInViewSlice from "@/reducers/BlogBannerInViewSlice";
import ShowConfettiSlice from "@/reducers/ShowConfettiSlice";
import FollowerCountSlice from "@/reducers/UserFollowerCountSlice";
import loginDetailsSlice from "@/reducers/loginDetailsSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    LoginDetails: loginDetailsSlice,
    FollowerCount: FollowerCountSlice,
    BlogBannerInView: BlogBannerInViewSlice,
    ShowConfetti: ShowConfettiSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
