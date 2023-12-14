"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useSession } from "next-auth/react";
import { User } from "@/types/schemaTypes";
import { patchFetchAPi } from "@/utils/fetchData";
import { Session } from "next-auth";
import { toast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import { updateUser } from "@/utils/fetchActions";

interface Input {
  cover_pic: {
    url: string;
    file: null;
  };
  profile_pic: {
    url: string;
    file: null;
  };
  fullname: string;
  location: string;
  bio: string;
}

const ProfileSettingsForm = ({ userDetails }: { userDetails: User }) => {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState<Input>({
    cover_pic: {
      url: "",
      file: null,
    },
    profile_pic: {
      url: "",
      file: null,
    },
    fullname: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    if (userDetails) {
      setInput({
        cover_pic: { url: userDetails.cover_pic || "", file: null },
        profile_pic: { url: userDetails.profile_pic || "", file: null },
        fullname: userDetails.fullname || "",
        location: userDetails.location || "",
        bio: userDetails.bio,
      });
    }
  }, [userDetails]);

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = function (error) {
        reject(error);
      };
      reader.onloadend = function () {
        resolve(reader.result as string);
      };
    });
  };

  const handleImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setInput({
        ...input,
        [e.target.name]: {
          url: URL.createObjectURL(e.target.files[0]),
          file: await getBase64(e.target.files[0]),
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.fullname && input.bio) {
      setIsSubmitting(true);
      const res = await patchFetchAPi("/api/user/profile", input);
      setIsSubmitting(false);
      if (res && session) {
        toast({
          variant: "default",
          title: "Profile Updated Successfully",
        });
        await updateUser();
        update({
          ...session,
          user: {
            ...session.user,
            image: res.profile_pic,
            name: res.fullname,
          },
        });
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="relative">
        <div className="relative h-[12rem] w-full overflow-hidden rounded-lg">
          <Image
            className="h-full w-full object-cover object-center "
            src={input.cover_pic.url || "/images/avatarFallback.png"}
            alt="Cover Image"
            width={1500}
            height={800}
          />
          <div className="absolute inset-0 h-full w-full bg-white/30 object-cover object-center"></div>
        </div>
        <div>
          {input.cover_pic.url ? (
            <div className="absolute left-1/2  top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2 ">
              <label
                htmlFor="cover_pic"
                className={
                  "rounded-md border bg-secondary/80 px-4 py-2 text-md font-medium transition-colors  " +
                  (isSubmitting
                    ? "cursor-default opacity-60 hover:bg-none"
                    : "cursor-pointer hover:bg-secondary ")
                }
              >
                Change
              </label>
              <Button
                disabled={isSubmitting}
                className="bg-primary/80 text-primary-foreground hover:bg-primary"
                variant={"secondary"}
                onClick={() =>
                  setInput({
                    ...input,
                    cover_pic: {
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
                className={
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-secondary/60 px-4 py-2 text-md font-medium transition-colors  " +
                  (isSubmitting
                    ? "cursor-default opacity-60 hover:bg-none"
                    : "cursor-pointer hover:bg-secondary/50 ")
                }
                htmlFor="cover_pic"
              >
                Upload
              </label>
            </>
          )}
          <input
            disabled={isSubmitting}
            className="hidden"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            name="cover_pic"
            onChange={handleImageInput}
            id="cover_pic"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="aspect-square w-[6rem] overflow-hidden rounded-full">
          <Image
            className="h-full w-full object-cover object-center "
            src={input.profile_pic.url || "/images/avatarFallback.png"}
            alt="avatar"
            width={90}
            height={90}
          />
        </div>
        <div>
          {input.profile_pic.url ? (
            <div className="space-x-2">
              <label
                htmlFor="profile_pic"
                className={
                  "  rounded-md border px-4 py-2 text-md font-medium transition-colors " +
                  (isSubmitting
                    ? "cursor-default opacity-60 hover:bg-none"
                    : "cursor-pointer hover:bg-secondary/50 ")
                }
              >
                Change
              </label>
              <Button
                disabled={isSubmitting}
                className=" bg-primary/10  text-primary/80 hover:bg-primary/20 hover:text-primary"
                variant={"secondary"}
                onClick={() =>
                  setInput({
                    ...input,
                    profile_pic: {
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
                htmlFor="profile_pic"
              >
                Upload
              </label>
            </>
          )}
          <input
            disabled={isSubmitting}
            className="hidden"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            name="profile_pic"
            onChange={handleImageInput}
            id="profile_pic"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="fullname">Fullname</Label>
        <Input
          type="text"
          id="fullname"
          name="fullname"
          value={input.fullname}
          onChange={handleInput}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="location">Location</Label>
        <Input
          type="text"
          id="location"
          name="location"
          value={input.location}
          onChange={handleInput}
        />
      </div>

      <div className="space-y-1 pb-6">
        <Label htmlFor="bio">Introduction</Label>
        <Textarea
          rows={8}
          name="bio"
          id="bio"
          placeholder="Write a brief introduction to show in your profile..."
          onChange={handleInput}
          value={input.bio}
          required
        />
      </div>

      <Button className="w-full " disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
};

export default ProfileSettingsForm;
