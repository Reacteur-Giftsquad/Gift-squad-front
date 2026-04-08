// Auth API helpers: login and signup requests.
import api from "./api";

export const loginUser = async (email, password) => {
  console.log("BASE URL:", api.defaults.baseURL);
  const response = await api.post("/user/login", {
    email,
    password,
  });
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await api.post("/user/signup", userData);
  return response.data;
};
