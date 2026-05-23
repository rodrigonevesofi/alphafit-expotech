import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pulsefitUser")) || null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData, token) => {
    localStorage.setItem("pulsefitUser", JSON.stringify(userData));
    localStorage.setItem("pulsefitToken", token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("pulsefitUser");
    localStorage.removeItem("pulsefitToken");
    setUser(null);
  }, []);

  const updateUser = useCallback((newData) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...newData };
      localStorage.setItem("pulsefitUser", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
