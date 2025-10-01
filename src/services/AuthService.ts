// src/services/AuthService.ts
import * as authAPI from '../api/authApi';
import type {User}  from '../types/Types';

export const AuthService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      return { token, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const response = await authAPI.register({ name, email, password });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn("Erreur lors du logout :", error);
    } finally {
      localStorage.removeItem("authToken");
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    try {
      const response = await authAPI.getMe();
      return response.data;
    } catch (error) {
      console.error("Token invalide ou expiré");
      localStorage.removeItem("authToken");
      return null;
    }
  },
};
