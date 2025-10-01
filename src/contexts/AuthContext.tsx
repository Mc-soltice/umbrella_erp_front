// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/AuthService";
import type { User } from "../types/Types";

interface AuthContextType {
  login: (matricule: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: any;
  token: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // ✅ Persistance de la session
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Connexion
  const login = async (matricule: string, password: string) => {
  try {
    const { token, user } = await AuthService.login(matricule, password);
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    return true;
  } catch {
    return false;
  }
};


  // ✅ Déconnexion
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, token, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
