import { BASE_URL } from "@/constants/constant";

export const fetchSingleUser = async (username: string) => {
  const response = await fetch(`${BASE_URL}/api/user/${username}`, {
    method: "GET",
  });
  const user = await response.json();
  return user;
};
