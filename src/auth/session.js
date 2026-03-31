const ACCESS_TOKEN_KEY = "accessToken";

const getLocalStorage = () =>
  typeof window !== "undefined" ? window.localStorage : null;

export const getAccessToken = () => {
  const localStorageRef = getLocalStorage();
  return localStorageRef?.getItem(ACCESS_TOKEN_KEY) || null;
};

export const setAccessToken = (token) => {
  const localStorageRef = getLocalStorage();
  localStorageRef?.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  const localStorageRef = getLocalStorage();
  localStorageRef?.removeItem(ACCESS_TOKEN_KEY);
};
