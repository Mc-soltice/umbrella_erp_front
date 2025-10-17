import axiosClient from './axiosClient';

// userApi.ts
export const getUsers = () => axiosClient.get('/users');
export const getUser = (id: number) => axiosClient.get(`/users/${id}`);
export const createUser = (data: any) => axiosClient.post('/users', data);
export const updateUser = (id: number, data: any) => axiosClient.patch(`/users/${id}`, data);
export const deleteUser = (id: number) => axiosClient.delete(`/users/${id}`);
export const toggleLock = (id: number) => axiosClient.patch(`/users/${id}/toggle-lock`);
export const getActivity = (id: number) => axiosClient.get(`/users/${id}/activity`);
