import axiosInstance from "@/lib/axios";

export async function loginUser(credentials) {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
}
