"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FcGoogle } from "react-icons/fc";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { updateEmail } from "@/reducers/loginDetailsSlice";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassowrd] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "password") {
      setError(false);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.email) {
      setIsSubmitting(true);
      signIn("credentials", {
        ...input,
        redirect: false,
        callbackUrl: "/",
      }).then((res) => {
        if (res?.ok) {
          window.location.href = "/";
        } else if (res?.status === 401) {
          dispatch(updateEmail(input.email));
          router.push("/register");
        } else {
          setIsSubmitting(false);
          setError(true);
        }
      });
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          value={input.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="py-6 text-md"
          required
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "Password"}
            name="password"
            value={input.password}
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="current-password"
            className={`py-6 text-md ${
              error ? "border-primary text-primary" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassowrd(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground"
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </button>
        </div>
        {error && (
          <span className="mt-2 text-sm text-primary">
            {input.password ? "Invalid Password" : "Please enter your password"}
          </span>
        )}
        <Button
          disabled={isSubmitting}
          className="w-full text-base "
          size={"lg"}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging In
            </>
          ) : (
            "Login"
          )}
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
