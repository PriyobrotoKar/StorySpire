"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useSession } from "next-auth/react";
import { User } from "@/types/schemaTypes";

const ProfileSettingsForm = ({ userDetails }: { userDetails: User }) => {
  const [input, setInput] = useState({
    cover_image: {
      url: "",
      file: null,
    },
    profile_image: {
      url: "",
      file: null,
    },
    fullname: "",
    location: "",
    intro: "",
  });

  useEffect(() => {
    if (userDetails) {
      setInput({
        cover_image: { url: userDetails.cover_pic || "", file: null },
        profile_image: { url: userDetails.profile_pic || "", file: null },
        fullname: userDetails.fullname || "",
        location: userDetails.location || "",
        intro: userDetails.bio,
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

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setInput({
        ...input,
        [e.target.name]: {
          url: URL.createObjectURL(e.target.files[0]),
          file: e.target.files[0],
        },
      });
    }
  };

  return (
    <form className="space-y-4">
      <div className="relative">
        <div className="relative h-[12rem] w-full overflow-hidden rounded-lg">
          <Image
            className="h-full w-full object-cover object-center "
            src={input.cover_image.url || "/images/avatarFallback.png"}
            alt="Cover Image"
            width={90}
            height={90}
          />
          <div className="absolute inset-0 h-full w-full bg-white/30 object-cover object-center"></div>
        </div>
        <div>
          {input.cover_image.url ? (
            <div className="absolute left-1/2  top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2 ">
              <label
                htmlFor="cover_image"
                className="cursor-pointer rounded-md border bg-secondary/80 px-4 py-2 text-md font-medium transition-colors hover:bg-secondary/50"
              >
                Change
              </label>
              <Button
                className="bg-primary/80 text-primary-foreground"
                variant={"secondary"}
                onClick={() =>
                  setInput({
                    ...input,
                    cover_image: {
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
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-md bg-secondary/60 px-4 py-2 text-md font-medium transition-colors hover:bg-secondary"
                htmlFor="cover_image"
              >
                Upload
              </label>
            </>
          )}
          <input
            className="hidden"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            name="cover_image"
            onChange={handleImageInput}
            id="cover_image"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="aspect-square w-[6rem] overflow-hidden rounded-full">
          <Image
            className="h-full w-full object-cover object-center "
            src={input.profile_image.url || "/images/avatarFallback.png"}
            alt="avatar"
            width={90}
            height={90}
          />
        </div>
        <div>
          {input.profile_image.url ? (
            <div className="space-x-2">
              <label
                htmlFor="profile_image"
                className=" cursor-pointer rounded-md border px-4 py-2 text-md font-medium transition-colors hover:bg-secondary/50"
              >
                Change
              </label>
              <Button
                className=" bg-primary/10  text-primary/80 hover:bg-primary/20 hover:text-primary"
                variant={"secondary"}
                onClick={() =>
                  setInput({
                    ...input,
                    profile_image: {
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
                htmlFor="profile_image"
              >
                Upload
              </label>
            </>
          )}
          <input
            className="hidden"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            name="profile_image"
            onChange={handleImageInput}
            id="profile_image"
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
          required
        />
      </div>

      <div className="space-y-1 pb-6">
        <Label htmlFor="intro">Introduction</Label>
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

      <Button className="w-full ">Save Changes</Button>
    </form>
  );
};

export default ProfileSettingsForm;
