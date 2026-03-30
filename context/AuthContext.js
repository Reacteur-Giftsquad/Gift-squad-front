import { createContext, useState } from "react";

export const AuthContext = createContext();

// provider
export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = async (token, userId) => {
    setToken(token);
    setUserId(id);
  };

  const logout = async (token, userId) => {};
}
