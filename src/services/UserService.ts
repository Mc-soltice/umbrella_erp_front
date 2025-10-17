// src/services/UserService.ts
import * as userApi from "../api/userAPI";
import toast from 'react-hot-toast';

export const UserService = {
  async getUsers() {
    try {
      const response = await userApi.getUsers();
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
      throw error;
    }
  },

  async getUser(id: number) {
    try {
      const response = await userApi.getUser(id);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement de l\'utilisateur');
      throw error;
    }
  },

  async createUser(data: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
    location: string;
    password: string;
    password_confirmation: string;
    is_locked?: boolean;
  }) {
    try {
      const response = await userApi.createUser(data);
      toast.success('Utilisateur créé avec succès');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      
      // Gestion spécifique des erreurs de validation
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key].join(', ')}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
      }
      throw error;
    }
  },

  async updateUser(id: number, data: Partial<any>) {
    try {
      const response = await userApi.updateUser(id, data);
      toast.success('Utilisateur mis à jour avec succès');
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      
      // Gestion spécifique des erreurs de validation
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key].join(', ')}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
      }
      throw error;
    }
  },

  async deleteUser(id: number) {
    try {
      const response = await userApi.deleteUser(id);
      toast.success('Utilisateur supprimé avec succès');
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
      throw error;
    }
  },

  async toggleLock(id: number) {
    try {
      const response = await userApi.toggleLock(id);
      const message = response.data.is_locked 
        ? 'Utilisateur verrouillé avec succès' 
        : 'Utilisateur déverrouillé avec succès';
      toast.success(message);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors du changement de statut de l'utilisateur ${id}:`, error);
      toast.error(error.response?.data?.message || 'Erreur lors du changement de statut de l\'utilisateur');
      throw error;
    }
  },

  async getActivity(id: number) {
    try {
      const response = await userApi.getActivity(id);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la récupération de l'activité de l'utilisateur ${id}:`, error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement de l\'activité');
      throw error;
    }
  },
};