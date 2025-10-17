// src/services/PlanningService.ts
import { PlanningApi } from '../api/planningApi';
import type { Planning, CreatePlanningData, UpdatePlanningData } from '../types/Types';
import toast from "react-hot-toast";

export class PlanningService {

  // CREATE
  static async createPlanning(data: CreatePlanningData): Promise<Planning> {
    try {
      if (!data.site_id) throw new Error('Le site est requis');
      if (!Array.isArray(data.agents)) throw new Error('Les agents doivent être une liste');

      const response = await PlanningApi.createPlanning(data);
      toast.success("Planning créé avec succès");
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création du planning: ${message}`);
    }
  }

  // READ ALL
  static async getAllPlannings(): Promise<Planning[]> {
    try {
      const response = await PlanningApi.getPlannings();
      toast.success("Plannings chargés avec succès");
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération des plannings: ${message}`);
    }
  }

  // READ BY ID
  static async getPlanningById(id: number): Promise<Planning> {
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
      toast.success("Planning mis à jour avec succès");
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
      toast.success("Planning supprimé avec succès");
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la suppression du planning: ${message}`);
    }
  }
}
