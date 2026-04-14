export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const err = error;
    return err.response?.data?.message || err.message || fallback;
  }

  return fallback;
}

