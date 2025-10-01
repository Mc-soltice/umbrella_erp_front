import type { Candidature, CreateCandidatureData, UpdateCandidatureData } from "../types/Types";
import axiosClient from "./axiosClient";

// api/candidatureApi.ts
export const CandidatureApi = {
  create: (data: CreateCandidatureData) => axiosClient.post<Candidature>('/candidatures', data),
  getAll: () => axiosClient.get<Candidature[]>('/candidatures'),
  getById: (id: string) => axiosClient.get<Candidature>(`/candidatures/${id}`),
  update: (id: string, data: UpdateCandidatureData) => axiosClient.put<Candidature>(`/candidatures/${id}`, data),
  updateStatus: (id: string, status: string) => axiosClient.patch<Candidature>(`/candidatures/${id}/status`, { status }),
  delete: (id: string) => axiosClient.delete(`/candidatures/${id}`),
};