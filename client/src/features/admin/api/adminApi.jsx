import axiosInstance from "@/config/axios";

export const updateUser = () => axiosInstance.put("/users");
export const deleteUser = () => axiosInstance.delete("/users");