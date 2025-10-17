// src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use(config => {
  // ✅ CORRECTION : Utiliser 'authToken' au lieu de 'token'
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token ajouté à la requête:", token.substring(0, 20) + "...");
  } else {
    console.warn("⚠️ Aucun token trouvé dans le localStorage");
  }
  return config;
});

// ✅ Ajouter un intercepteur de réponse pour gérer les erreurs d'authentification
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ Token expiré ou invalide - Déconnexion automatique");
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;