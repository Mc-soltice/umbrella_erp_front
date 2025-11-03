// src/services/AuthService.ts
import * as authAPI from '../api/authApi';
import type { User, } from '../types/Types';

// ✅ Ajouter ce type si pas déjà dans vos types
interface LoginResponseData {
  token: string;
  user: User;
}

export const AuthService = {
  async login(matricule: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await authAPI.login({ matricule, password });
      const { token, user } = response.data as LoginResponseData;

      // ✅ Stocker avec les bonnes clés
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));

      console.log("✅ Login réussi - Token stocké:", token.substring(0, 20) + "...");

      return { token, user };
    } catch (error: unknown) {
      console.error("❌ Erreur login:", error);

      // ✅ Nettoyer en cas d'erreur
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      if (error instanceof Error) {
        throw new Error(error.message || "Erreur de connexion");
      } else {
        throw new Error("Erreur de connexion inconnue");
      }
    }
  },

  async logout(): Promise<void> {
    try {
      // ✅ Vérifier si on a un token avant d'appeler l'API
      const token = localStorage.getItem("authToken");
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.warn("⚠️ Erreur lors du logout API :", error);
    } finally {
      // ✅ Nettoyer avec les bonnes clés
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      console.log("✅ LocalStorage nettoyé après logout");
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("authUser");

      if (!token || !userStr) {
        console.log("🔍 Token ou user manquant dans localStorage");
        return null;
      }

      const user = JSON.parse(userStr);
      console.log("✅ User restauré depuis localStorage:", user.first_name);

      return user;
    } catch (error) {
      console.error("❌ Erreur getCurrentUser:", error);
      // Nettoyer les données corrompues
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      return null;
    }
  },

  // ✅ Méthode utilitaire pour vérifier l'authentification
  isAuthenticated(): boolean {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("authUser");

    if (!token || !userStr) return false;

    try {
      JSON.parse(userStr);
      return true;
    } catch {
      return false;
    }
  },

  // ✅ Méthode pour récupérer le token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }
};