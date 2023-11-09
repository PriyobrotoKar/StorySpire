import { BASE_URL } from "@/constants/constant";
import axios from "axios";
import { ApiError } from "./apiErrorHandler";

export const fetchDataFromApi = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
  });
  if (!response.ok && response.status !== 404) {
    const { error } = await response.json();
    throw new ApiError("Bad Request", error, response.status);
  }
  if (response.ok) {
    return await response.json();
  }
};

export const postFetchAPi = async (url: string, body: any) => {
  const response = await fetch(`/api/user`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok && response.status !== 404) {
    const { error } = await response.json();
    throw new ApiError("Bad Request", error, response.status);
  }
  if (response.ok) {
    return await response.json();
  }
};
