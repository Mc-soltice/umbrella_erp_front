// services/CandidatureService.ts
import { CandidatureApi } from '../api/candidatureApi';
import type { Candidature, CreateCandidatureData, UpdateCandidatureData } from '../types/Types';
import toast from "react-hot-toast";

export class CandidatureService {
  // CREATE
  static async createCandidature(data: CreateCandidatureData): Promise<Candidature> {
    try {
      const response = await CandidatureApi.create(data);
      toast.success("Candidature créée avec succès");
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erreur lors de la création';
      toast.error(message);
      throw error; // ⚠️ IMPORTANT : Relancer l'erreur originale, pas une nouvelle
    }
  }

  // READ
  static async getAllCandidatures(): Promise<Candidature[]> {
    try {
      const response = await CandidatureApi.getAll();
      const resData: unknown = response.data;

      // Cas 1 : API enveloppe les données dans { data: [...] }
      if (
        resData &&
        typeof resData === 'object' &&
        'data' in (resData as object) &&
        Array.isArray((resData as any).data)
      ) {
        const list = (resData as any).data as Candidature[];
      toast.success("Candidature chargées avec succès");
        console.log(`✅ ${list.length} candidature(s) chargée(s)`);
        return list;
      }

      // Cas 2 : API renvoie directement un tableau
      if (Array.isArray(resData)) {
        console.log(`✅ ${resData.length} candidature(s) chargée(s)`);
        return resData as Candidature[];
      }

      // Défaut : log et renvoie tableau vide
      console.warn('⚠️ Structure de réponse inattendue:', resData);
      return [];

    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erreur lors du chargement';
      toast.error(message);
      throw error;
    }
  }




  static async getCandidatureById(id: string): Promise<Candidature> {
    try {
      const response = await CandidatureApi.getById(id);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erreur lors de la récupération';
      toast.error(message);
      throw error;
    }
  }

  // UPDATE
  static async updateCandidature(id: string, data: UpdateCandidatureData): Promise<Candidature> {
    try {
      const response = await CandidatureApi.update(id, data);
      toast.success("Candidature mise à jour avec succès");
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
      toast.error(message);
      throw error;
    }
  }

  // DELETE
  static async deleteCandidature(id: string): Promise<void> {
    try {
      await CandidatureApi.delete(id);
      toast.success("Candidature supprimée avec succès");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      toast.error(message);
      throw error;
    }
  }
}
