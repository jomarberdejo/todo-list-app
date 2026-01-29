import { createContext, useContext, useState, type ReactNode } from "react";
import API from "../api/axios";
import type { AuthContextType } from "@/types/auth";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const login = async (email: string, password: string) => {
    const res = await API.post("/auth/login", { email, password });
    const jwt = res.data.tokens.accessToken; 
    const userEmail = res.data.user.email;


    localStorage.setItem("token", jwt);
    localStorage.setItem("user", userEmail);

    setToken(jwt);
    setUser(userEmail);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/login"
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
