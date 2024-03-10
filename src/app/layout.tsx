import { Toaster } from "@/components/ui/toaster";
import NextauthProvider from "@/providers/NextauthProvider";
import ReactCookieProvider from "@/providers/ReactCookieProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import globalMetadata from "@/utils/metadata";
import { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#FD5F5F",
};

export const metadata = globalMetadata;

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
            <body className={`${inter.className}  min-h-[100svh] text-base`}>
              <div
                vaul-drawer-wrapper=""
                className="min-h-[inherit] bg-background"
              >
                {children}
              </div>
              <Toaster />
            </body>
          </ReactCookieProvider>
        </ReduxProvider>
      </NextauthProvider>
    </html>
  );
}
