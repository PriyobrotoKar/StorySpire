"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DEFAULT_USER_INTRO } from "../../constants/constant";
import { toast } from "@/components/ui/use-toast";
import { fetchSingleUser } from "@/utils/fetchActions";
import axios from "axios";
import { fetchDataFromApi } from "@/utils/fetchData";

const onbaording = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState({
    fullname: "",
    username: "",
    intro: "",
  });
  const [usernameExist, setUsernameExist] = useState<boolean | undefined>(
    false
  );
  const router = useRouter();

  useEffect(() => {
    if (session)
      setInput({
        fullname: session.user?.name || "",
        username: "",
        intro: DEFAULT_USER_INTRO,
      });
  }, [session]);

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (usernameExist) {
      toast({
        variant: "destructive",
        title: "Username already exists",
        description: "Try using another username",
      });
    } else {
      try {
        const response = await fetch(`/api/user`, {
          method: "POST",
          body: JSON.stringify({
            fullname: input.fullname,
            username: input.username,
            bio: input.intro,
            email: session?.user?.email,
            profile_pic: session?.user?.image,
          }),
        });
        if (!response.ok) throw new Error(response.statusText);
        router.push("/");
      } catch (error: any) {
        console.error("Profile creation error", error.message);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong",
          description: "There was a problem creating your profile.",
        });
      }
    }
  };

  const fetchUser = async (username: string) => {
    const user = await fetchDataFromApi(`/api/user/${username}`);
    return user;
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (input.username) {
      setUsernameExist(undefined);
      timeout = setTimeout(async () => {
        const user = await fetchUser(input.username);
        setUsernameExist(user ? true : false);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [input.username]);

  return (
    <section className="flex min-h-[inherit] items-center justify-center px-4">
      <main className="rounded-xl border">
        <header className="border-b  p-4">
          <h1 className="text-xl font-bold text-secondary-foreground">
            Choose a username
          </h1>
          <p className="text-md text-muted-foreground">
            Choose a username and write a brief introduction.
          </p>
        </header>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-3 p-4">
          <div>
            <Image
              className="rounded-full "
              src={session?.user?.image || "/images/avatarFallback.png"}
              alt="avatar"
              width={90}
              height={90}
            />
          </div>

          <div>
            <Label htmlFor="fullname">
              Fullname <span className="text-red-600">&#42;</span>
            </Label>
            <Input
              type="text"
              id="fullname"
              name="fullname"
              value={input.fullname}
              onChange={handleInput}
              required
            />
          </div>

          <div>
            <Label htmlFor="username">
              Username <span className="text-red-600">&#42;</span>
            </Label>
            <div className="relative flex items-center rounded-xl border">
              <div className="border-r px-3 text-sm">storyspire.com/@</div>
              <Input
                name="username"
                className="border-none"
                type="text"
                id="username"
                value={input.username}
                onChange={handleInput}
                required
                autoComplete="off"
              />
              {input.username &&
                (usernameExist ? (
                  <MdCancel className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-red-600" />
                ) : usernameExist === false ? (
                  <BsFillCheckCircleFill className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-blue-600" />
                ) : (
                  <img
                    className="absolute right-3 top-1/2 w-5 -translate-y-1/2"
                    src="/images/loader.gif"
                  />
                ))}
            </div>
          </div>

          <div>
            <Label htmlFor="intro">
              Introduction <span className="text-red-600">&#42;</span>
            </Label>
            <Textarea
              rows={8}
              name="intro"
              id="intro"
              placeholder="Write a brief introduction to show in your profile..."
              onChange={handleInput}
              value={input.intro}
              required
            />
          </div>

          <Button
            disabled={usernameExist === undefined ? true : false}
            className="w-full "
          >
            Continue
          </Button>
        </form>
      </main>
    </section>
  );
};

export default onbaording;
