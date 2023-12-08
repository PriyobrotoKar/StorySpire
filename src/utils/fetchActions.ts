import { BASE_URL } from "@/constants/constant";
import { headers } from "next/headers";
import { ApiError } from "./apiErrorHandler";

export const fetchSingleUser = async (username: string) => {
  const response = await fetch(`${BASE_URL}/api/user/${username}`, {
    method: "GET",
  });
  const user = await response.json();
  return user;
};

export const fetchSingleBlog = async (slug: string) => {
  const response = await fetch(`${BASE_URL}/api/blog/${slug}`, {
    method: "GET",
    headers: headers(),
  });
  if (!response.ok && response.status !== 404) {
    const { error } = await response.json();
    throw new ApiError("Bad Request", error, response.status);
  }
  if (response.ok) {
    return await response.json();
  }
};

export const fetchUserBlogs = async (username: string) => {
  const response = await fetch(`${BASE_URL}/api/user/${username}/blogs`, {
    method: "GET",
    headers: headers(),
  });
  return await response.json();
};

export const fetchCurrentUserSocialLinks = async () => {
  const response = await fetch(`${BASE_URL}/api/social`, {
    method: "GET",
    headers: headers(),
  });
  return await response.json();
};

export const fetchRecentBlogs = async (limit?: number) => {
  const response = await fetch(`${BASE_URL}/api/blog/recent?limit=${limit}`, {
    method: "GET",
    headers: headers(),
  });
  return await response.json();
};

export const fetchFeaturedBlogs = async () => {
  const response = await fetch(`${BASE_URL}/api/blog/featured`, {
    method: "GET",
    headers: headers(),
  });
  return await response.json();
};
