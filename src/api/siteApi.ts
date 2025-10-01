import axiosClient from './axiosClient';

export const getSites = () => axiosClient.get('/admin/sites');
export const getSite = (id: number) => axiosClient.get(`/admin/sites/${id}`);
export const createSite = (data: any) => axiosClient.post('/admin/sites', data);
export const updateSite = (id: number, data: any) => axiosClient.put(`/admin/sites/${id}`, data);
export const deleteSite = (id: number) => axiosClient.delete(`/admin/sites/${id}`);
