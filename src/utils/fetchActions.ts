"use server";
import { BASE_URL } from "@/constants/constant";
import { headers } from "next/headers";
import { ApiError } from "./apiErrorHandler";
import { revalidatePath, revalidateTag } from "next/cache";

export const updateUser = async () => {
  revalidateTag("user");
};

export const fetchSingleUser = async (username: string) => {
  const response = await fetch(`${BASE_URL}/api/user/${username}`, {
    method: "GET",
    next: { tags: ["user"] },
  });
  const user = await response.json();
  return user;
};

export const fetchSingleBlog = async (slug: string) => {
  const response = await fetch(`${BASE_URL}/api/blog/${slug}`, {
    method: "GET",
    next: { tags: ["blog"] },
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

export const fetchAllCategories = async (postCount = 0, offset = 0) => {
  const response = await fetch(
    `${BASE_URL}/api/category?offset=${offset}&post_count=${postCount}`,
    {
      method: "GET",
    }
  );
  return await response.json();
};

export const fetchCategory = async (name: string, offset = 0) => {
  const response = await fetch(
    `${BASE_URL}/api/category/${name}?offset=${offset}`,
    {
      method: "GET",
    }
  );
  return await response.json();
};

export const fetchBookmarks = async () => {
  const response = await fetch(`${BASE_URL}/api/user/bookmark`, {
    method: "GET",
    headers: headers(),
  });
  return await response.json();
};
