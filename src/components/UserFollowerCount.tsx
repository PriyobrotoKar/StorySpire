"use client";

import { receiveFollowers } from "@/reducers/UserFollowerCountSlice";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserFollowerCount = ({ followerCount }: { followerCount: number }) => {
  const followCount = useSelector((state: RootState) => state.FollowerCount);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(receiveFollowers(followerCount));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followerCount]);

  return (
    <div className="text-md font-medium text-muted-foreground">
      {followCount !== -1 ? followCount : followerCount} Followers
    </div>
  );
};

export default UserFollowerCount;
