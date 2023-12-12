"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { patchFetchAPi } from "@/utils/fetchData";
import { toast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

const PasswordSettingsForm = () => {
  const [input, setInput] = useState({
    passwordOld: "",
    passwordNew: "",
  });
  const [error, setError] = useState({
    passwordOld: "",
    passwordNew: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.passwordNew) {
      setIsSubmitting(true);
      const res = await patchFetchAPi("/api/user/password", input);
      setIsSubmitting(false);
      if (!res.title) {
        setInput({
          passwordNew: "",
          passwordOld: "",
        });
        toast({
          variant: "default",
          title: res,
        });
      } else {
        setError({
          ...error,
          [res.field]: res.description,
        });
      }
    }
  };

  useEffect(() => {
    setError({ passwordOld: "", passwordNew: "" });
    if (input.passwordNew && input.passwordOld) {
      {
        if (input.passwordNew === input.passwordOld)
          setError({ ...error, passwordNew: "Please provide a new password" });
      }
    }
  }, [input]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label
          htmlFor="passwordOld"
          className={error.passwordOld && "text-red-600"}
        >
          Old Password
        </Label>
        <Input
          type="password"
          id="passwordOld"
          name="passwordOld"
          autoComplete="current-password"
          value={input.passwordOld}
          onChange={handleInputChange}
          className={error.passwordOld && "border-red-600 text-red-600"}
        />
        <div
          className={
            "h-5 text-sm text-red-600 " +
            (error.passwordOld ? "opacity-100" : "opacity-0")
          }
        >
          {error.passwordOld}
        </div>
      </div>

      <div className="space-y-1 pb-6">
        <Label
          htmlFor="passwordNew"
          className={error.passwordNew && "text-red-600"}
        >
          New Password
        </Label>
        <Input
          type="password"
          id="passwordNew"
          name="passwordNew"
          autoComplete="new-password"
          value={input.passwordNew}
          onChange={handleInputChange}
          className={error.passwordNew && "border-red-600 text-red-600"}
          required
        />
        <div
          className={
            "h-5 text-sm text-red-600 " +
            (error.passwordNew ? "opacity-100" : "opacity-0")
          }
        >
          {error.passwordNew}
        </div>
      </div>
      <Button
        disabled={
          Boolean(error.passwordNew || error.passwordOld) || isSubmitting
        }
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </>
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
};

export default PasswordSettingsForm;
