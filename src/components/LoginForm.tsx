"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const LoginForm = () => {
  const [showPassword, setShowPassowrd] = useState(false);
  return (
    <>
      <form className="space-y-4">
        <Input type="email" placeholder="Email" className="py-6 text-md" />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "Password"}
            placeholder="Password"
            className="py-6 text-md "
          />
          <button
            type="button"
            onClick={() => setShowPassowrd(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground"
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </button>
        </div>
        <Button className="w-full text-base " size={"lg"}>
          Login
        </Button>
      </form>
      <div className="flex items-center">
        <hr className="flex-1" />
        <div className="flex-[2_1_0%] text-center text-md text-muted-foreground">
          or continue with
        </div>
        <hr className="flex-1" />
      </div>
      <Button
        className="w-full space-x-3 text-xl"
        variant={"outline"}
        size={"lg"}
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <FcGoogle /> <span className="text-base">Google</span>
      </Button>
    </>
  );
};

export default LoginForm;
