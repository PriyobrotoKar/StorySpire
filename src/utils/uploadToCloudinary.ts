"use client";
import axios from "axios";

export const uploadToCloud = async (formdata: FormData) => {
  try {
    const uploadResponse = await axios.post(
      "https://api.cloudinary.com/v1_1/drkhfjenh/image/upload",
      formdata
    );
    const imageUrl = uploadResponse.data.secure_url;
    return imageUrl;
    // const imageUrl= uploadResponse
  } catch (error) {
    console.error(error);
  }
};
