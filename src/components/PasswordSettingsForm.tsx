"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PasswordSettingsForm = () => {
  const [input, setInput] = useState({
    passwordOld: "",
    passwordNew: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="passwordOld">Old Password</Label>
        <Input
          type="password"
          id="passwordOld"
          name="passwordOld"
          autoComplete="password"
          value={input.passwordOld}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-1 pb-6">
        <Label htmlFor="passwordNew">New Password</Label>
        <Input
          type="password"
          id="passwordNew"
          name="passwordNew"
          autoComplete="password"
          value={input.passwordNew}
          onChange={handleInputChange}
          required
        />
      </div>
      <Button className="w-full">Change Password</Button>
    </form>
  );
};

export default PasswordSettingsForm;
