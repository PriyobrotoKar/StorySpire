"use client";
import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useSelector, useDispatch } from "react-redux";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";

import { DEFAULT_USER_INTRO } from "../../constants/constant";
import { fetchDataFromApi, postFetchAPi } from "@/utils/fetchData";
import { Loader2 } from "lucide-react";
import { ApiError } from "@/utils/apiErrorHandler";
import { RootState } from "@/store/store";
import { useCookies } from "react-cookie";

const onbaording = () => {
  const email = useSelector((state: RootState) => state.LoginDetails.email);
  const password = useSelector(
    (state: RootState) => state.LoginDetails.passowrd
  );
  const { data: session } = useSession();
  const [cookies, setCookies, removeCookie] = useCookies([
    "fullname",
    "profile_pic",
    "email",
  ]);
  const [input, setInput] = useState({
    image: "",
    fullname: "",
    username: "",
    intro: "",
  });
  const [usernameExist, setUsernameExist] = useState<boolean | undefined>(
    false
  );
  const [btnLoading, setBtnLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setInput({
      image: cookies.profile_pic || "",
      fullname: cookies.fullname || "",
      username: "",
      intro: DEFAULT_USER_INTRO,
    });
  }, []);

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
    setBtnLoading(true);

    //checking if user exists
    if (usernameExist) {
      setBtnLoading(false);
      toast({
        variant: "destructive",
        title: "Username already exists",
        description: "Try using another username",
      });
    } else {
      //creating a new user
      try {
        const res = await postFetchAPi("/api/user", {
          fullname: input.fullname,
          username: input.username,
          bio: input.intro,
          email: cookies.email || email,
          password,
          profile_pic: input.image,
        });
        if (!session && res.status) {
          signIn("credentials", {
            email: email || cookies.email,
            password,
            redirect: false,
          }).then((res) => console.log(res?.ok));
        }
        router.push("/");
      } catch (error: any) {
        console.error("Profile creation error", error);

        setBtnLoading(false);
        toast({
          variant: "destructive",
          title: error.title,
          description: error.description,
        });
      }
    }
  };

  const fetchUser = async (username: string) => {
    try {
      const user = await fetchDataFromApi(`/api/user/${username}`);
      setUsernameExist(user ? true : false);
    } catch (error: any) {
      console.error("GET user", error);
      toast({
        variant: "destructive",
        title: error.title,
        description: error.description,
      });
    }
  };

  useEffect(() => {
    //force conversion to lowercase
    setInput((prev) => ({
      ...prev,
      username: input.username.toLowerCase(),
    }));
    //checking if user exists
    let timeout: NodeJS.Timeout;
    if (input.username) {
      setUsernameExist(undefined);
      timeout = setTimeout(async () => {
        fetchUser(input.username);
      }, 1000);
    } else {
      setUsernameExist(false);
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
              src={input.image || "/images/avatarFallback.png"}
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
                  <Loader2 className="absolute right-3 mr-0.5 h-4 w-4 animate-spin " />
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
            disabled={usernameExist === undefined || btnLoading ? true : false}
            className="w-full "
          >
            {btnLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </main>
    </section>
  );
};

export default onbaording;
