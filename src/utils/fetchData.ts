import { BASE_URL } from "@/constants/constant";
import axios from "axios";

export const fetchDataFromApi = async (url: string) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`);
  return data;
};
