"use client";

import {
  increaseFollowers,
  receiveFollowers,
} from "@/reducers/UserFollowerCountSlice";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserFollowerCount = ({ followerCount }: { followerCount: number }) => {
  const followCount = useSelector((state: RootState) => state.FollowerCount);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(receiveFollowers(followerCount));
  }, [dispatch, followerCount]);

  return (
    <div className="text-md font-medium text-muted-foreground">
      {followCount || followerCount} Followers
    </div>
  );
};

export default UserFollowerCount;
