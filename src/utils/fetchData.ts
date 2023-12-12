import { BASE_URL } from "@/constants/constant";
import axios from "axios";
import { ApiError } from "./apiErrorHandler";
import { toast } from "@/components/ui/use-toast";
import { headers } from "next/headers";

export const fetchDataFromApi = async (url: string) => {
  try {
    const response = await fetch(BASE_URL + url, {
      method: "GET",
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

export const postFetchAPi = async (url: string, body: any) => {
  try {
    const response = await fetch(BASE_URL + url, {
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
export const patchFetchAPi = async (url: string, body: any) => {
  try {
    const response = await fetch(BASE_URL + url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    console.log(response.ok);
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
    return error;
  }
};
export const deleteFetchAPi = async (url: string) => {
  try {
    const response = await fetch(BASE_URL + url, {
      method: "DELETE",
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
