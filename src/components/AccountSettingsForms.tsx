"use client";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useSession } from "next-auth/react";
import { BASE_URL } from "@/constants/constant";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { patchFetchAPi } from "@/utils/fetchData";
import { toast } from "./ui/use-toast";
import { updateUser } from "@/utils/fetchActions";

const GeneralSettingsForms = () => {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!session) return;
    console.log(session);
    setInput({
      username: session.user.username,
      email: session.user.email,
      password: "",
    });
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.email && input.username && session) {
      setIsSubmitting(true);
      const res = await patchFetchAPi("/api/user/account", input);
      if (res.status >= 400) {
        setIsSubmitting(false);
        return;
      }
      console.log(res);
      await updateUser();
      setIsSubmitting(false);
      toast({
        variant: "default",
        title: "Account updated Successfully",
      });
      update({
        ...session,
        user: {
          ...session.user,
          username: res.username,
          email: res.email,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          name="username"
          autoComplete="username"
          value={input.username}
          onChange={handleInputChange}
          required
        />
        <p className="text-sm text-muted-foreground">
          Your Profile URL: {BASE_URL + "/"}
          <span className="font-medium">{input.username}</span>
        </p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={input.email}
          onChange={handleInputChange}
          required
        />
      </div>
      {session && input.email !== session.user.email && (
        <div className="space-y-1 pb-6">
          <Label htmlFor="password">Password (if changing email)</Label>
          <Input
            type="password"
            id="password"
            name="password"
            autoComplete="password"
            value={input.password}
            onChange={handleInputChange}
          />
        </div>
      )}
      <Button disabled={isSubmitting} className="w-full">
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

export { GeneralSettingsForms };
