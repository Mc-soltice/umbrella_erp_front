import axiosClient from './axiosClient';

export const register = (data: any) => axiosClient.post('/register', data);
export const login = (data: any) => axiosClient.post('/login', data);
export const logout = () => axiosClient.post('/users/logout');
export const getMe = () => axiosClient.get('/auth/me');
export const refreshToken = () => axiosClient.post('/refresh-token');
