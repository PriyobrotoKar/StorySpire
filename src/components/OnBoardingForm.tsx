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

import { fetchDataFromApi, postFetchAPi } from "@/utils/fetchData";
import { Loader2 } from "lucide-react";
import { RootState } from "@/store/store";
import { useCookies } from "react-cookie";
import { DEFAULT_USER_INTRO } from "@/constants/constant";
import { uploadToCloud } from "@/utils/uploadToCloudinary";
import { UserDetailsInput } from "@/types/customTypes";

const OnBoardingForm = () => {
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
  const [input, setInput] = useState<UserDetailsInput>({
    image: {
      url: "",
      file: null,
    },
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
    if (!email && !password && !cookies.email) {
      router.replace("/login");
    } else {
      setInput({
        image: { url: cookies.profile_pic || "", file: null },
        fullname: cookies.fullname || "",
        username: "",
        intro: DEFAULT_USER_INTRO,
      });
    }
  }, []);

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setInput({
        ...input,
        image: {
          url: URL.createObjectURL(e.target.files[0]),
          file: e.target.files[0],
        },
      });
    }
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
        const imageUrl =
          input.image.file && (await uploadToCloud(input.image.file));
        const res = await postFetchAPi("/api/user", {
          fullname: input.fullname,
          username: input.username,
          bio: input.intro,
          email: cookies.email || email,
          password,
          profile_pic: imageUrl || input.image.url,
        });
        if (!session && res.success) {
          signIn("credentials", {
            email: email || cookies.email,
            password,

            callbackUrl: "/",
          }).then((res) => console.log(res?.ok));
        }
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
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-3 p-4">
      <div className="flex items-center gap-6">
        <div className="aspect-square w-[6rem] overflow-hidden rounded-full">
          <Image
            className="h-full w-full object-cover object-center "
            src={input.image.url || "/images/avatarFallback.png"}
            alt="avatar"
            width={90}
            height={90}
          />
        </div>
        <div>
          {input.image.url ? (
            <div className="space-x-2">
              <label
                htmlFor="imageInput"
                className="cursor-pointer rounded-md border px-4 py-2 text-md font-medium transition-colors hover:bg-secondary/50"
              >
                Change
              </label>
              <Button
                className="bg-primary/10  text-primary/80 hover:bg-primary/20 hover:text-primary"
                variant={"secondary"}
                onClick={() =>
                  setInput({
                    ...input,
                    image: {
                      url: "",
                      file: null,
                    },
                  })
                }
              >
                Remove
              </Button>
            </div>
          ) : (
            <>
              <label
                className="cursor-pointer rounded-md bg-secondary/60 px-4 py-2 text-md font-medium transition-colors hover:bg-secondary"
                htmlFor="imageInput"
              >
                Upload
              </label>
            </>
          )}
          <input
            className="hidden"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            name="imageInput"
            onChange={handleImageInput}
            id="imageInput"
          />
        </div>
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
  );
};

export default OnBoardingForm;
