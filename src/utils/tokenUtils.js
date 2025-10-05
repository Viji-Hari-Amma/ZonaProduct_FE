export const getAccessToken = () => localStorage.getItem("accessToken");

export const setTokens = ({ access, refresh }) => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};

export const setAccessToken = (access) => {
  localStorage.setItem("accessToken", access);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("is_superuser");
  localStorage.removeItem("profilePic");
};
