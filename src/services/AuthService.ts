// src/services/AuthService.ts
import * as authAPI from '../api/authApi';
import type { User } from '../types/Types';

export const AuthService = {
  async login(matricule: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response: any = await authAPI.login({ matricule, password });
      const { token, user } = response.data;

      // ✅ Stocker avec les bonnes clés
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      
      console.log("✅ Login réussi - Token stocké:", token.substring(0, 20) + "...");
      
      return { token, user };
    } catch (error: any) {
      console.error("❌ Erreur login:", error);
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  },

  async logout(): Promise<void> {
    try {
      await authAPI.logout();
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
        console.log("❌ Token ou user manquant dans localStorage");
        return null;
      }

      const user = JSON.parse(userStr);
      console.log("✅ User restauré depuis localStorage:", user.first_name);
      
      return user;
    } catch (error) {
      console.error("❌ Erreur getCurrentUser:", error);
      this.logout();
      return null;
    }
  },

  // ✅ Méthode utilitaire pour vérifier l'authentification
  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  },

  // ✅ Méthode pour récupérer le token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }
};