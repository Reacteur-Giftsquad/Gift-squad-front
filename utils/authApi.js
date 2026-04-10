// Auth API helpers: login and signup requests.
import api from "./api";

export const loginUser = async (email, password) => {
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
