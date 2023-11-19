import { BASE_URL } from "@/constants/constant";
import axios from "axios";
import { ApiError } from "./apiErrorHandler";
import { toast } from "@/components/ui/use-toast";

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
  try {
    const response = await fetch(url, {
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
  } catch (error: any) {
    console.log(error.message);
    toast({
      variant: "destructive",
      title: error.title,
      description: error.description,
    });
  }
};
