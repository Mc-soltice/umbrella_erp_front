import axiosClient from './axiosClient';

export const getPlannings = () => axiosClient.get('/plannings');
export const getPlanning = (id: number) => axiosClient.get(`/plannings/${id}`);
export const createPlanning = (data: any) => axiosClient.post('/plannings', data);
export const updatePlanning = (id: number, data: any) => axiosClient.put(`/plannings/${id}`, data);
export const deletePlanning = (id: number) => axiosClient.delete(`/plannings/${id}`);
export const getPlanningsBySite = (site_id: number) => axiosClient.get(`/plannings/${site_id}`);
export const getPlanningsByAgent = (agent_id: number) => axiosClient.get(`/plannings/agent/${agent_id}`);
