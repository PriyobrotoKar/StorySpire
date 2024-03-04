"use client";
import React from "react";
import { CookiesProvider } from "react-cookie";

const ReactCookieProvider = ({ children }: { children: React.ReactNode }) => {
  return <CookiesProvider>{children}</CookiesProvider>;
};

export default ReactCookieProvider;
