"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { deleteFetchAPi, postFetchAPi } from "@/utils/fetchData";
import { User } from "@/types/schemaTypes";
import { updateUser, updateUserPage } from "@/utils/fetchActions";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  decreaseFollowers,
  increaseFollowers,
} from "@/reducers/UserFollowerCountSlice";

const FollowUserButton = ({
  isSameUser,
  isFollowing,
  targetUser,
  followerCount,
}: {
  isSameUser: boolean;
  isFollowing: boolean;
  targetUser: User;
  followerCount: number;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFollowed, setIsFollowed] = useState(isFollowing);
  const dispatch = useDispatch();

  const handleFollow = async () => {
    if (!session) {
      router.push("/login");
    }

    if (isFollowing) {
      //TODO: unfollow the user
      await deleteFetchAPi(`/api/user/${targetUser.username}/follow`);
      setIsFollowed(false);
      dispatch(decreaseFollowers(followerCount));
    } else {
      await postFetchAPi(`/api/user/${targetUser.username}/follow`, {});
      setIsFollowed(true);
      dispatch(increaseFollowers(followerCount));
    }
    updateUserPage(targetUser.username);
  };

  return (
    <div>
      {!isSameUser && (
        <div className="flex items-center justify-between gap-4 rounded-md border p-4">
          <div className="text-sm font-medium">
            {isFollowed
              ? "You will be receiving all new updates in your activity feed or start page"
              : "Follow to get new updates in your activity feed or start page"}
          </div>
          <Button
            onClick={handleFollow}
            variant={isFollowed ? "secondary" : "default"}
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FollowUserButton;
