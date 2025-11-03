import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserService } from "../services/UserService";
import type { User } from "@/types/Types";
import toast from "react-hot-toast";

interface UserContextType {
  users: User[];
  loading: boolean;
  hasLoaded: boolean; // ✅ ajouté ici
  fetchUsers: () => Promise<void>;
  createUser: (data: Omit<User, "id"> & { password: string; password_confirmation: string }) => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleLock: (id: number) => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Liste des utilisateurs
  const [users, setUsers] = useState<User[]>([]);

  // Indique si une opération de chargement est en cours
  const [loading, setLoading] = useState(false);

  // ✅ Indique si le premier chargement est terminé (utile pour éviter les boucles)
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchUsers = useCallback(async () => {
  console.log('🔄 fetchUsers appelé');
  setLoading(true);
  try {
    const data = await UserService.getUsers();
    console.log('📦 Données reçues de l\'API:', data);
    console.log('📊 Type de données:', typeof data);
    console.log('🔢 Est un array?:', Array.isArray(data));

    // ✅ CORRECTION ICI : Extraire le tableau de data.data
    const usersArray = Array.isArray(data) ? data : (data.data || []);
    console.log('👥 Users à enregistrer:', usersArray);

    setUsers(usersArray);
    setHasLoaded(true);
  } catch (error) {
    console.error('❌ Erreur chargement users :', error);
    toast.error("Impossible de charger les utilisateurs.");
    setUsers([]);
    setHasLoaded(true);
  } finally {
    setLoading(false);
  }
}, []);

  const createUser = useCallback(async (data: any) => {
    try {
      await UserService.createUser(data);
      toast.success("Utilisateur créé !");
      await fetchUsers();
    } catch (error) {
      console.error("Erreur création user :", error);
      toast.error("Échec de création de l’utilisateur.");
      throw error;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: number, data: Partial<User>) => {
    try {
      await UserService.updateUser(id, data);
      toast.success("Utilisateur mis à jour !");
      await fetchUsers();
    } catch (error) {
      console.error("Erreur maj user :", error);
      throw error;
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: number) => {
    try {
      await UserService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("Utilisateur supprimé !");
    } catch (error) {
      console.error("Erreur suppression user :", error);
      throw error;
    }
  }, []);

  const toggleLock = useCallback(async (id: number) => {
    try {
      await UserService.toggleLock(id);
      toast.success("État du compte mis à jour !");
      await fetchUsers();
    } catch (error) {
      console.error("Erreur toggleLock :", error);
      throw error;
    }
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        hasLoaded,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        toggleLock,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
