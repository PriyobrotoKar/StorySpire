import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextauthProvider from "@/providers/NextauthProvider";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/providers/ReduxProvider";
import ReactCookieProvider from "@/providers/ReactCookieProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | StorySpire`,
    default: "StorySpire",
  },
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <NextauthProvider>
        <ReduxProvider>
          <ReactCookieProvider>
            <body className={`${inter.className} min-h-[100svh]`}>
              {children}
              <Toaster />
            </body>
          </ReactCookieProvider>
        </ReduxProvider>
      </NextauthProvider>
    </html>
  );
}
