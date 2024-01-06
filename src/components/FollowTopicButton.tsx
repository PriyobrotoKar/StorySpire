"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { deleteFetchAPi, postFetchAPi } from "@/utils/fetchData";

const FollowTopicButton = ({
  category_name,
  isFollowing,
}: {
  category_name: string;
  isFollowing: boolean;
}) => {
  const { data: session } = useSession();
  const [isFollow, setIsFollow] = useState(isFollowing);
  const router = useRouter();
  const handleFollowTopic = async () => {
    if (session) {
      if (isFollowing) {
        setIsFollow(false);
        await deleteFetchAPi(`/api/category/${category_name}/follow`);
      } else {
        setIsFollow(true);
        await postFetchAPi(`/api/category/${category_name}/follow`, {});
      }
      router.refresh();
    } else {
      router.push("/login");
    }
  };

  return (
    <Button
      variant={isFollow ? "secondary" : "default"}
      onClick={handleFollowTopic}
    >
      {isFollow ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowTopicButton;
