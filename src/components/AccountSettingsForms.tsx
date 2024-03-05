"use client";
import { BASE_URL } from "@/constants/constant";
import { updateUser } from "@/utils/fetchActions";
import { patchFetchAPi } from "@/utils/fetchData";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

const GeneralSettingsForms = () => {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!session) return;
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
    setError({ username: "", email: "", password: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.email && input.username && session) {
      setIsSubmitting(true);
      const res = await patchFetchAPi("/api/user", input);
      if (res.title) {
        setError({ ...error, [res.field]: res.description });
        setIsSubmitting(false);
        return;
      }
      await updateUser();
      setIsSubmitting(false);
      toast({
        variant: "default",
        title: "Account updated Successfully",
      });
      await update({
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
    <form onSubmit={handleSubmit} className="space-y-1">
      <div className="space-y-1">
        <Label htmlFor="username" className={error.username && " text-red-600"}>
          Username
        </Label>
        <Input
          type="text"
          id="username"
          name="username"
          autoComplete="username"
          value={input.username}
          onChange={handleInputChange}
          className={error.username && "border-red-600 text-red-600"}
          required
        />
        <p className="text-sm text-muted-foreground">
          Your Profile URL: {BASE_URL + "/"}
          <span className="font-medium">{"@" + input.username}</span>
        </p>

        <p
          className={
            "h-5 text-sm text-red-600 " +
            (error.username ? "opacity-100" : "opacity-0")
          }
        >
          {error.username}
        </p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="email" className={error.email && " text-red-600"}>
          Email
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={input.email}
          onChange={handleInputChange}
          className={error.email && "border-red-600 text-red-600"}
          required
        />

        <p
          className={
            "h-5 text-sm text-red-600 " +
            (error.email ? "opacity-100" : "opacity-0")
          }
        >
          {error.email}
        </p>
      </div>
      {session && input.email !== session.user.email && (
        <div className="space-y-1 pb-6">
          <Label
            htmlFor="password"
            className={error.password && " text-red-600"}
          >
            Password (if changing email)
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            autoComplete="password"
            value={input.password}
            className={error.password && "border-red-600 text-red-600"}
            onChange={handleInputChange}
          />

          <p
            className={
              "h-5 text-sm text-red-600 " +
              (error.password ? "opacity-100" : "opacity-0")
            }
          >
            {error.password}
          </p>
        </div>
      )}
      <Button disabled={isSubmitting} className="w-full md:w-fit">
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
