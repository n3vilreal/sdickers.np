export const setAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};
export const getToken = () => localStorage.getItem("token");
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};
export const isLoggedIn = () => !!getToken();
export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
