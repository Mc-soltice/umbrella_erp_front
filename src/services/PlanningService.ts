// src/services/PlanningService.ts
import { PlanningApi } from '../api/planningApi';
import type { CreatePlanningData, Planning, UpdatePlanningData } from '../types/Types';

export class PlanningService {
  // CREATE
  static async createPlanning(data: CreatePlanningData): Promise<Planning> {
    try {
      // ✅ CORRECTION : Vérification adaptée à la nouvelle structure
      if (!data.site_id) throw new Error('Le site est requis');
      if (!data.shifts?.MORNING?.agents || !data.shifts?.EVENING?.agents) {
        throw new Error('Les deux shifts doivent contenir des agents');
      }

      const response = await PlanningApi.createPlanning(data);
      // ✅ Le toast est déjà dans l'API, on peut le retirer ici
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création du planning: ${message}`);
    }
  }

  // READ ALL
  static async getPlannings(): Promise<Planning[]> {
    try {
      const response = await PlanningApi.getPlannings();
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération des plannings: ${message}`);
    }
  }

  // READ BY ID
  static async getPlanning(id: number): Promise<Planning> {
    try {
      const response = await PlanningApi.getPlanning(id);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération du planning: ${message}`);
    }
  }

  // READ BY AGENT
  static async getPlanningsByAgent(agent_id: number): Promise<Planning[]> {
    try {
      const response = await PlanningApi.getPlanningsByAgent(agent_id);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération des plannings de l'agent: ${message}`);
    }
  }

  // UPDATE
  static async updatePlanning(id: number, data: UpdatePlanningData): Promise<Planning> {
    try {
      const response = await PlanningApi.updatePlanning(id, data);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la mise à jour du planning: ${message}`);
    }
  }

  // DELETE
  static async deletePlanning(id: number): Promise<void> {
    try {
      await PlanningApi.deletePlanning(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la suppression du planning: ${message}`);
    }
  }
}