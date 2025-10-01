// src/services/UserService.ts
import * as userApi from "../api/userAPI";

export const UserService = {
  async getUsers() {
    const response = await userApi.getUsers();
    return response.data;
  },

  async getUser(id: number) {
    const response = await userApi.getUser(id);
    return response.data;
  },

  async createUser(data: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
    is_locked?: boolean;
  }) {
    const response = await userApi.createUser(data); // ⚠️ à ajouter dans userApi si pas encore fait
    return response.data;
  },

  async updateUser(id: number, data: Partial<any>) {
    const response = await userApi.updateUser(id, data);
    return response.data;
  },

  async deleteUser(id: number) {
    const response = await userApi.deleteUser(id);
    return response.data;
  },

  async toggleLock(id: number) {
    const response = await userApi.toggleLock(id);
    return response.data;
  },

  async getActivity(id: number) {
    const response = await userApi.getActivity(id);
    return response.data;
  },

  async attendanceReport() {
    const response = await userApi.attendanceReport();
    return response.data;
  },

  async attendanceByUser(user_id: number) {
    const response = await userApi.attendanceByUser(user_id);
    return response.data;
  },
};
