import axiosClient from './axiosClient';

export const getAgents = () => axiosClient.get('/gestion/agents');
export const getAgent = (id: number) => axiosClient.get(`/gestion/agents/${id}`);
export const createAgent = (data: any) => axiosClient.post('/gestion/agents', data);
export const updateAgent = (id: number, data: any) => axiosClient.patch(`/gestion/agents/${id}`, data);
export const deleteAgent = (id: number) => axiosClient.delete(`/gestion/agents/${id}`);
export const getAgentStats = (id: number) => axiosClient.get(`/gestion/agents/${id}/stats`);
