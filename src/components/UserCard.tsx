import { User } from "@/types/schemaTypes";
import { checkIsFollowing } from "@/utils/fetchActions";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FollowUserButton from "./FollowUserButton";

type UserCardProps = {
  user: User;
  session: Session | null | undefined;
};

const UserCard = ({ user, session }: UserCardProps) => {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const isSameUser = session ? session.user.username === user.username : false;
  useEffect(() => {
    const getIsFollowing = async () => {
      const data =
        session && !isSameUser
          ? await checkIsFollowing(session.user.username, user.username)
          : { isFollowing: false };

      setIsFollowing(data.isFollowing);
    };

    getIsFollowing();
  }, [isSameUser, session, user.username]);

  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl p-4 transition-all hover:bg-muted">
      <Link className="flex-1" href={`/@${user.username}`}>
        <div className="flex gap-4">
          <div className="h-14 min-w-[3.5rem] overflow-hidden rounded-full transition-shadow group-hover:shadow-xl">
            <Image
              src={user.profile_pic || "/images/avatarFallback.png"}
              alt="user_profile_pic"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-medium">{user.fullname}</h2>
            <p className="line-clamp-2 text-md">{user.bio}</p>
          </div>
        </div>
      </Link>
      <FollowUserButton
        isSameUser={isSameUser}
        isFollowing={isFollowing}
        showDesc={false}
        targetUsername={user.username}
        followerCount={user._count.follower}
      />
    </div>
  );
};

export default UserCard;
