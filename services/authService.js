import axiosInstance from "@/lib/axios";

export async function loginUser(credentials) {
  const response = await axiosInstance.post("/auth/login", credentials);
  const data = response.data;

  return {
    ...data,
    token: data.token || data.accessToken,
  };
}
