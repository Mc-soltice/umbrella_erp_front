import axiosClient from './axiosClient';

export const register = (data: any) => axiosClient.post('/auth/register', data);
export const login = (data: any) => axiosClient.post('/auth/login', data);
export const logout = () => axiosClient.post('/users/logout');
export const getMe = () => axiosClient.get('/auth/me');