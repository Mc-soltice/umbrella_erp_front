// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserService } from "../services/UserService";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  role: string;
  is_locked: boolean;
}

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
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: any) => {
    await UserService.createUser(data);
    await fetchUsers();
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    await UserService.updateUser(id, data);
    await fetchUsers();
  };

  const deleteUser = async (id: number) => {
    await UserService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleLock = async (id: number) => {
    await UserService.toggleLock(id);
    await fetchUsers();
  };

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
