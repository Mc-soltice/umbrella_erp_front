// src/hooks/useAuthCheck.ts
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthCheck = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Vérifier la présence du token à chaque changement d'authentification
    const token = localStorage.getItem('authToken');
    console.log("🔍 Vérification auth - Token présent:", !!token);
    console.log("🔍 Vérification auth - isAuthenticated:", isAuthenticated);
    console.log("🔍 Vérification auth - isLoading:", isLoading);
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
};