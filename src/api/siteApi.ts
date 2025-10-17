import axiosClient from './axiosClient';

export const getSites = () => axiosClient.get('/sites/');
export const getSite = (id: number) => axiosClient.get(`/sites/${id}`);
export const createSite = (data: any) => axiosClient.post('/sites/', data);
export const updateSite = (id: number, data: any) => axiosClient.put(`/sites/${id}`, data);
export const deleteSite = (id: number) => axiosClient.delete(`/sites/${id}`);
