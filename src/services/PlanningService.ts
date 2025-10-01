// src/services/planningService.ts
import * as planningApi from '../api/planningApi';

export const fetchPlannings = async () => {
  try {
    const res = await planningApi.getPlannings();
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const fetchPlanning = async (id: number) => {
  try {
    const res = await planningApi.getPlanning(id);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const createPlanning = async (data: any) => {
  try {
    // 💡 On peut valider ici avant d’envoyer
    if (!data.site_id) throw new Error('Le site est requis');
    if (!Array.isArray(data.agents)) throw new Error('Les agents doivent être une liste');

    const res = await planningApi.createPlanning(data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updatePlanning = async (id: number, data: any) => {
  try {
    const res = await planningApi.updatePlanning(id, data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deletePlanning = async (id: number) => {
  try {
    await planningApi.deletePlanning(id);
    return true;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
