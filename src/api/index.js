import axiosInstance from "../config/axiosInstance";

export const authApi = {
  login: (payload) => axiosInstance.post("/auth/login", payload),
  refresh: () => axiosInstance.post("/auth/refreshaccessToken"),
  logout: () => axiosInstance.post("/auth/logout"),
  profile: () => axiosInstance.get("/settings/getProfile"),
};

export const folderApi = {
  getFolders: () => axiosInstance.get("/folders/get-folders"),
  createFolder: (payload) =>
    axiosInstance.post("/folders/create-folder", payload),
  updateFolder: (payload, id) =>
    axiosInstance.put(`/folders/folder/${id}`, payload),
  getFolderById: (id) => axiosInstance.get(`/folders/folder/${id}`),
  deleteFolder: (id) => axiosInstance.delete(`/folders/folder/${id}`),
  getRequestedTemplate: () =>
    axiosInstance.get("/request-templates/get-request-templates"),
};

export const activityApi = {
  getActivityLogs: () => axiosInstance.get("/activity-logs/activity-logs"),
};

export const userApi = {
  getUsers: () => axiosInstance.get("/users/get-all-users"),
  updateUser: (payload, id) =>
    axiosInstance.put(`/users/update-user/${id}`, payload),
  deleteUser: (payload, id) => axiosInstance.delete(`/users/delete-user/${id}`),
};

export const reminderApi = {
  getReminderData: () => axiosInstance.get("/reminders/get-reminders-template"),
  createReminder: (payload) =>
    axiosInstance.post("/reminders/create-reminder-template", payload),
  getReminderById: (id) =>
    axiosInstance.get(`/reminders/get-reminder-template/${id}`),
  updateReminder: (payload, id) =>
    axiosInstance.put(`/reminders/update-reminder-template/${id}`, payload),
  deleteReminder: (id) =>
    axiosInstance.delete(`/reminders/delete-reminder-template/${id}`),
};

export const ChangepasswordApi = {
  changePassword: (payload) =>
    axiosInstance.put("/settings/changePassword", payload),
};
