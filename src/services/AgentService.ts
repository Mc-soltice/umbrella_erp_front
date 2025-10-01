
// src/services/AgentService.ts
import * as agentAPI from "../api/agentApi";
import type { Agent } from "../types/Types"; // adapte selon ton modèle
import toast from "react-hot-toast";

export class AgentService  {


  async getAgents(): Promise<Agent[]> {
    try {
  const response = await agentAPI.getAgents();
      toast.success("Agents chargées avec succes")
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw toast.error(`Erreur lors de la récupération des agents: ${message}`)
    }
  }

  async getAgent(id: number): Promise<Agent> {
    try {
    const response = await agentAPI.getAgent(id);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw toast.error(`Erreur lors de la récupération de l'agents: ${message}`)
    }
  }

  async createAgent(data: Partial<Agent>): Promise<Agent> {
    try {
    const response = await agentAPI.createAgent(data);
      toast.success("Agents creer avec succes")
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw toast.error(`Erreur lors de la création de l'agents: ${message}`)
    }
  }

  async updateAgent(id: number, data: Partial<Agent>): Promise<Agent> {
    try {
    const response = await agentAPI.updateAgent(id, data);
      toast.success("Agents modifié avec succes")
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw toast.error(`Erreur lors de la modification de l'agents: ${message}`)
    }
  }

  async deleteAgent(id: number): Promise<void> {
    try {
    await agentAPI.deleteAgent(id);
      toast.success("Agents supprimé avec succes")
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw toast.error(`Erreur lors de la suppression de l'agents: ${message}`)
    }
  }

  async getAgentStats(id: number): Promise<any> {
    try {
    const response = await agentAPI.getAgentStats(id);
      toast.success("Statistiques chargées avec succes")
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw toast.error(`Erreur lors du chargement de l'agents: ${message}`)
    }
  }

};
