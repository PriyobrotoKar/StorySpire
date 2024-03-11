"use client";
import { updatePassword } from "@/reducers/loginDetailsSlice";
import { RootState } from "@/store/store";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const RegisterForm = () => {
  const router = useRouter();
  const loginEmail = useSelector(
    (state: RootState) => state.LoginDetails.email
  );

  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassowrd] = useState({
    password: false,
    confirmPass: false,
  });
  const [input, setInput] = useState({
    password: "",
    confirmPass: "",
  });
  const [error, setError] = useState(false);

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(false);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (input.password !== input.confirmPass) {
      setError(true);
    } else {
      dispatch(updatePassword(input.password));
      router.push("/onboarding");
    }
  };

  useEffect(() => {
    if (!loginEmail) {
      router.replace("/login");
    }
  }, [loginEmail, router]);

  return (
    <div className="flex min-h-[inherit] items-center justify-center px-6">
      <main className="space-y-4 rounded-xl border p-4">
        <div>
          <h1 className="text-xl font-bold text-secondary-foreground">
            Welcome to StorySpire
          </h1>
          <p className="text-md text-muted-foreground">
            Create a password for your account{" "}
            <span className="font-semibold">{loginEmail}</span>
          </p>
        </div>
        <form className="space-y-3">
          <div>
            <Label htmlFor="password" className={error ? "text-primary" : ""}>
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword.password ? "text" : "password"}
                id="password"
                name="password"
                value={input.password}
                onChange={handleInput}
                required
                autoComplete="new-password"
                className={error ? "border-primary" : ""}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassowrd({
                    ...showPassword,
                    password: !showPassword.password,
                  })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground"
              >
                {showPassword.password ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>
          <div>
            <Label
              htmlFor="confirmPass"
              className={error ? "text-primary" : ""}
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword.confirmPass ? "text" : "password"}
                id="confirmPass"
                name="confirmPass"
                value={input.confirmPass}
                onChange={handleInput}
                autoComplete="new-password"
                required
                className={error ? "border-primary" : ""}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassowrd({
                    ...showPassword,
                    confirmPass: !showPassword.confirmPass,
                  })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground"
              >
                {showPassword.confirmPass ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
            {error && (
              <span className="text-sm text-primary">
                Passwords don&apos;t match
              </span>
            )}
          </div>
          <Button onClick={handleSubmit} className=" w-full">
            Continue
          </Button>
        </form>
      </main>
    </div>
  );
};

export default RegisterForm;
