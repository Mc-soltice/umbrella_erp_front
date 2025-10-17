// src/api/planningApi.ts
import axiosClient from './axiosClient';


export const PlanningApi = {
  getPlannings: () => axiosClient.get('/plannings'),
  getPlanning: (id: number) => axiosClient.get(`/plannings/${id}`),
  createPlanning: (data: any) => axiosClient.post('/plannings', data),
  updatePlanning: (id: number, data: any) => axiosClient.put(`/plannings/${id}`, data),
  deletePlanning: (id: number) => axiosClient.delete(`/plannings/${id}`),
  getPlanningsBySite: (site_id: number) => axiosClient.get(`/plannings/site/${site_id}`), // ✅ Corrigé l'URL
  getPlanningsByAgent: (agent_id: number) => axiosClient.get(`/plannings/agent/${agent_id}`),
  getPlanningsByDate: (date: string) => axiosClient.get(`/plannings/date/${date}`),
};