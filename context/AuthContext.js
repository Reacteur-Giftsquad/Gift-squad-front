// AuthContext: manages user authentication state across the app.
// Persists token + user data in AsyncStorage so sessions survive after restarting the app.

import { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to restore a previous session from AsyncStorage
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      const savedUser = await AsyncStorage.getItem("user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };
    restoreSession();
  }, []);

  // Save token + user to state and AsyncStorage after login
  const login = async (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    await AsyncStorage.setItem("token", newToken);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  // Update user data (after profile edit) without changing the token
  const updateUser = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  // Clear all auth data from state and storage
  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access auth state from any component
export function useAuth() {
  return useContext(AuthContext);
}
