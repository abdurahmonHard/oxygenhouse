import axios from "axios";

export const instance = axios.create({
  // baseURL: "http://localhost:3000/api",
   baseURL: "https://oxygenhome.brainsmart.uz/api",
  //  baseURL: "https://api.fuylar.uz/api",
  // baseURL: "https://api.oxygenhouse.uz/api",

  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
