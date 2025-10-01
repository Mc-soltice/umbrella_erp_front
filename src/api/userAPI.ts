import axiosClient from './axiosClient';

export const getUsers = () => axiosClient.get('/users/users');
export const getUser = (id: number) => axiosClient.get(`/users/${id}`);
export const updateUser = (id: number, data: any) => axiosClient.patch(`/users/${id}`, data);
export const deleteUser = (id: number) => axiosClient.delete(`/users/${id}`);
export const toggleLock = (id: number) => axiosClient.patch(`/users/${id}/toggle-lock`);
export const getActivity = (id: number) => axiosClient.get(`/users/${id}/activity`);
export const attendanceReport = () => axiosClient.get('/users/attendance/report');
export const attendanceByUser = (user_id: number) => axiosClient.get(`/users/attendance/${user_id}/report`);
export const createUser = (data: any) => axiosClient.post("/users/users", data);
