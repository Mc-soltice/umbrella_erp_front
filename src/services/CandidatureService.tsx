import { CandidatureApi } from '../api/candidatureApi';
import type { Candidature, CreateCandidatureData, UpdateCandidatureData } from '../types/Types';
import toast from "react-hot-toast";

// services/CandidatureService.ts
export class CandidatureService {

    // CREATE
    static async createCandidature(data: CreateCandidatureData): Promise<Candidature> {
    try {
      const response = await CandidatureApi.create(data);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création de la candidature: ${message}`);
    }
  }

  // READ

    static async getAllCandidatures(): Promise<Candidature[]> {
    try {
      const response = await CandidatureApi.getAll();
      toast.success("Candidature chargées avec succes")
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw toast.error(`Erreur lors de la récupération des candidatures: ${message}`)
    }
  }

  static async getCandidatureById(id: string): Promise<Candidature> {
    try {
      const response = await CandidatureApi.getById(id);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération de la candidature: ${message}`);
    }
  }

  // UPDATE - Correction: accepte UpdateCandidatureData (champs optionnels)
  static async updateCandidature(id: string, data: UpdateCandidatureData): Promise<Candidature> {
    try {
      const response = await CandidatureApi.update(id, data);
      toast.success("Candidature mise a jour avec succes")
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw toast.error(`Erreur lors de la mise a jour de la candidatures: ${message}`)
    }
  }

  // DELETE
  static async deleteCandidature(id: string): Promise<void> {
    try {
      await CandidatureApi.delete(id);
      toast.success("Candidature supprimée avec succes")
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw toast.error(`Erreur lors de la suppression de la candidatures: ${message}`)
    }
  }
}