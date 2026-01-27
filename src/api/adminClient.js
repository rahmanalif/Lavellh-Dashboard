import client from "./client";

let isRefreshing = false;
let refreshQueue = [];

const resolveQueue = (newAccessToken) => {
  refreshQueue.forEach((cb) => cb(newAccessToken));
  refreshQueue = [];
};

const applyTokens = async ({ accessToken, refreshToken, expiresIn, tokenType }) => {
  try {
    const [{ default: store }, { setTokens }] = await Promise.all([
      import("../store"),
      import("../store/adminAuthSlice"),
    ]);
    store.dispatch(
      setTokens({ accessToken, refreshToken, expiresIn, tokenType })
    );
  } catch {
    if (accessToken) {
      localStorage.setItem("adminAccessToken", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("adminRefreshToken", refreshToken);
    }
  }
};

const handleLogout = async () => {
  try {
    const [{ default: store }, { adminLogout }] = await Promise.all([
      import("../store"),
      import("../store/adminAuthSlice"),
    ]);
    store.dispatch(adminLogout());
  } catch {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
  }
  window.location.assign("/signin");
};

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminAccessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;
    const refreshToken = localStorage.getItem("adminRefreshToken");

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/admin/refresh-token")) {
      await handleLogout();
      return Promise.reject(error);
    }

    if ((status === 401 || status === 403) && refreshToken) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((newAccessToken) => {
            if (!newAccessToken) {
              reject(error);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(client(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await client.post("/admin/refresh-token", {
          refreshToken,
        });
        const data = refreshRes?.data?.data || refreshRes?.data;
        const newAccessToken = data?.accessToken;
        const newRefreshToken = data?.refreshToken;

        await applyTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: data?.expiresIn,
          tokenType: data?.tokenType,
        });

        isRefreshing = false;
        resolveQueue(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        resolveQueue(null);
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
