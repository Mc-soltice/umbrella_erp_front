import axiosClient from './axiosClient';

export const getAgents = () => axiosClient.get('/agents/');
export const getAgent = (id: number) => axiosClient.get(`/agents/${id}`);
export const createAgent = (data: any) => axiosClient.post('/agents/', data);
export const updateAgent = (id: number, data: any) => axiosClient.patch(`/agents/${id}`, data);
export const deleteAgent = (id: number) => axiosClient.delete(`/agents/${id}`);
