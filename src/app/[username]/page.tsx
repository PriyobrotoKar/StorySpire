import { fetchSingleUser } from "@/utils/fetchActions";
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";

const user = async ({ params }: { params: { username: string } }) => {
  const { username } = params;

  const user = await fetchSingleUser(username.slice(3));
  console.log(user);

  if (!username.includes("%40") || !user) {
    return notFound();
  }
  return (
    <div>
      <section>
        <Image
          src={user.cover_pic}
          alt="cover picture"
          width={1500}
          height={500}
        />
      </section>
      <section></section>
    </div>
  );
};

export default user;
