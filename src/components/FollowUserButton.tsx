"use client";

import {
  decreaseFollowers,
  increaseFollowers,
} from "@/reducers/UserFollowerCountSlice";
import { updateUserPage } from "@/utils/fetchActions";
import { deleteFetchAPi, postFetchAPi } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";

const FollowUserButton = ({
  isSameUser,
  isFollowing,
  targetUsername,
  followerCount,
  showDesc = true,
}: {
  isSameUser: boolean;
  isFollowing: boolean | null;
  showDesc?: boolean;
  targetUsername: string;
  followerCount: number;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isFollowed, setIsFollowed] = useState(isFollowing);
  const dispatch = useDispatch();
  const isUserPage = /^\/@([a-zA-Z0-9_]+)$/.test(pathname);

  useEffect(() => {
    setIsFollowed(isFollowing);
  }, [isFollowing]);

  const handleFollow = async () => {
    if (!session) {
      router.push("/login");
    }

    if (isFollowing) {
      //TODO: unfollow the user
      setIsFollowed(false);
      dispatch(decreaseFollowers(followerCount));
      await deleteFetchAPi(`/api/user/${targetUsername}/follow`);
    } else {
      setIsFollowed(true);
      dispatch(increaseFollowers(followerCount));
      await postFetchAPi(`/api/user/${targetUsername}/follow`, {});
    }
    isUserPage ? updateUserPage(targetUsername) : router.refresh();
  };

  if (isFollowed === null) {
    return;
  }

  return (
    <div>
      {!isSameUser && (
        <div
          className={
            "flex items-center justify-between rounded-md  " +
            (showDesc ? "  gap-4 border p-4 " : "")
          }
        >
          {showDesc && (
            <div className="text-sm font-medium">
              {isFollowed
                ? "You will be receiving all new updates in your activity feed or start page"
                : "Follow to get new updates in your activity feed or start page"}
            </div>
          )}
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
