"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteFromCloud = async (url: string) => {
  const public_id = url.substring(
    url.lastIndexOf("/", url.lastIndexOf("/") - 1) + 1,
    url.lastIndexOf(".")
  );
  cloudinary.uploader
    .destroy(public_id)
    .then((resp) => console.log(resp))
    .catch((_err) =>
      console.log("Something went wrong, please try again later.")
    );
};

export const uploadToCloudinary = async (file: string) => {
  let imgUrl = "";
  await cloudinary.uploader
    .unsigned_upload(file, "storyspire")
    .then((resp) => {
      imgUrl = resp.secure_url;
    })
    .catch((_err) => console.log(_err));

  return imgUrl;
};
