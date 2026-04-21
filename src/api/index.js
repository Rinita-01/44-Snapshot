import axiosInstance from "../config/axiosInstance";

export const authApi = {
  login: (payload) => axiosInstance.post("/auth/login", payload),
  refresh: () => axiosInstance.post("/auth/refreshaccessToken"),
  logout: () => axiosInstance.post("/auth/logout"),
  profile: () => axiosInstance.get("/settings/getProfile")
};

export const folderApi = {
  getFolders: () => axiosInstance.get("/folders/get-folders"),
  createFolder: (payload) => axiosInstance.post("/folders/create-folder", payload),
  addEntries: (payload) => axiosInstance.post("/folders/create-folder", payload)
};

export const activityApi = {
  getActivityLogs: () => axiosInstance.get("/activity-logs/activity-logs")
};

export const userApi = {
  getUsers: () => axiosInstance.get("/users/get-all-users"),
  updateUser: (payload,id) => axiosInstance.put(`/users/update-user/${id}`, payload),
  deleteUser: (payload, id) =>
  axiosInstance.delete(`/users/delete-user/${id}`),
};

export const reminderApi = {
  getReminderData: () => axiosInstance.get("/reminders/get-reminders-template"),
  createReminder: (payload) => axiosInstance.post("/reminders/create-reminder-template", payload),
  createReminderTemplate: (payload) => axiosInstance.post("/reminders/create-reminder-template", payload)
};

export const ChangepasswordApi = {
  changePassword: (payload) => axiosInstance.put("/settings/changePassword", payload)
};
