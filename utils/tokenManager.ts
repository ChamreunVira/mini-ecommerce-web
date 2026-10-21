const token = "token";

export const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(token);
};

export const setToken = (authToken: string) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(token, authToken);
};

export const clearToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(token);
};
