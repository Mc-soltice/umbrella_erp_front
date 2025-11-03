// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthService } from "../services/AuthService";
import type { User } from "../types/Types";

interface AuthContextType {
  login: (matricule: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Ajout de l'état loading
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initialisé à true

  // ✅ CORRECTION : Persistance de la session au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("authUser");

        console.log("Initialisation auth - Token:", savedToken);
        console.log("Initialisation auth - User:", savedUser);

        if (savedToken && savedUser) {
          // Vérifier si le token est valide en récupérant les infos utilisateur
          const currentUser = await AuthService.getCurrentUser();

          if (currentUser) {
            setToken(savedToken);
            setUser(currentUser);
            setIsAuthenticated(true);
            console.log("Utilisateur connecté restauré:", currentUser.first_name);
          } else {
            // Token invalide, nettoyer
            console.log("Token invalide, nettoyage...");
            await AuthService.logout();
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'authentification:", error);
        // En cas d'erreur, on nettoie pour être sûr
        await AuthService.logout();
      } finally {
        setIsLoading(false);
        console.log("Initialisation auth terminée");
      }
    };

    initializeAuth();
  }, []);

  // ✅ Connexion
  const login = async (matricule: string, password: string): Promise<boolean> => {
    try {
      const { token, user } = await AuthService.login(matricule, password);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      toast.success(`Bienvenue ${user.first_name} !`);
      return true;
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la connexion");
      return false;
    }
  };

  // ✅ Déconnexion
  const logout = async () => {
    try {
      await AuthService.logout();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Déconnexion réussie");
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error);
      // Même en cas d'erreur, on nettoie le state local
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const value = {
    login,
    logout,
    user,
    token,
    isAuthenticated,
    isLoading // N'oubliez pas d'inclure isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};