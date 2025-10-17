// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserService } from "../services/UserService";
import type { User } from "@/types/Types";

interface UserContextType {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  createUser: (data: Omit<User, "id"> & { password: string; password_confirmation: string }) => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleLock: (id: number) => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erreur dans fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: any) => {
    try {
      await UserService.createUser(data);
      await fetchUsers(); // Recharger la liste
    } catch (error) {
      console.error('Erreur dans createUser:', error);
      throw error;
    }
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    try {
      await UserService.updateUser(id, data);
      await fetchUsers();
    } catch (error) {
      console.error('Erreur dans updateUser:', error);
      throw error;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await UserService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Erreur dans deleteUser:', error);
      throw error;
    }
  };

  const toggleLock = async (id: number) => {
    try {
      await UserService.toggleLock(id);
      await fetchUsers();
    } catch (error) {
      console.error('Erreur dans toggleLock:', error);
      throw error;
    }
  };

  // ✅ UserContext se charge automatiquement au montage
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
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