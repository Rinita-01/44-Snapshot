import axiosInstance from "../config/axiosInstance";

export const authApi = {
  login: (payload) => axiosInstance.post("/auth/login", payload),

  refresh: () => axiosInstance.post("/auth/refreshaccessToken"),

  logout: () => axiosInstance.post("/auth/logout"),

  profile: () => axiosInstance.get("/settings/getProfile")
  
};



