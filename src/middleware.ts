export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/write/:path*", "/bookmarks", "/account/:path*"],
};
