// src/services/AgentService.ts
import toast from "react-hot-toast";
import * as agentAPI from "../api/agentApi";
import type { Agent, AgentApiResponse, Site } from "../types/Types";
import { extractData } from "../utils/apiHelpers"; // ⚠️ Retirez "type"

export class AgentService {

  private transformAgentData(apiData: AgentApiResponse): Agent {
    return {
      id: apiData.id,
      matricule: apiData.matricule,
      first_name: apiData.first_name,
      last_name: apiData.last_name,
      phone: apiData.phone,
      email: apiData.email,
      location: apiData.location,
      status: true,
      site: apiData.site,
      created_at: new Date(apiData.created_at),
      updated_at: new Date(apiData.updated_at)
    };
  }

  // 🔹 Nouvelle méthode pour grouper les agents par site
  groupAgentsBySite(agents: Agent[]): { site: Site; agents: Agent[] }[] {
    const sitesMap = new Map<number, { site: Site; agents: Agent[] }>();

    agents.forEach(agent => {
      const siteId = agent.site.id;

      if (!sitesMap.has(siteId)) {
        sitesMap.set(siteId, {
          site: {
            id: agent.site.id,
            name: agent.site.name,
            location: agent.site.location,
            responsable: agent.site.responsable,
            agents_count: 0
          },
          agents: []
        });
      }

      const siteGroup = sitesMap.get(siteId)!;
      siteGroup.agents.push(agent);
      siteGroup.site.agents_count = siteGroup.agents.length;
    });

    // 🔹 Trier les sites par nom
    return Array.from(sitesMap.values()).sort((a, b) =>
      a.site.name.localeCompare(b.site.name)
    );
  }

  async getAgents(): Promise<Agent[]> {
    try {

      const response = await agentAPI.getAgents();
      console.log('🔹 Réponse API:', response);

      // 🔹 Utilisez extractData pour obtenir directement le tableau
      const agentsData = extractData<AgentApiResponse[]>(response.data);
      console.log('🔹 Données extraites:', agentsData);

      if (!Array.isArray(agentsData)) {
        console.error('❌ Format de données invalide');
        return [];
      }

      const transformedAgents = agentsData.map(agent => this.transformAgentData(agent));
      console.log('🔹 Agents transformés:', transformedAgents);

      toast.success(`${transformedAgents.length} agent(s) chargé(s)`);
      return transformedAgents;

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('❌ Erreur getAgents:', error);
      toast.error(`Erreur: ${message}`);
      throw error;
    }
  }

  async getAgent(id: number): Promise<Agent> {
    try {
      const response = await agentAPI.getAgent(id);
      const agentData = extractData<AgentApiResponse>(response.data);
      return this.transformAgentData(agentData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur: ${message}`);
      throw error;
    }
  }

  async createAgent(data: Partial<Agent>): Promise<Agent> {
    try {
      const response = await agentAPI.createAgent(data);
      const agentData = extractData<AgentApiResponse>(response.data);
      toast.success("Agent créé avec succès");
      return this.transformAgentData(agentData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur: ${message}`);
      throw error;
    }
  }

  async updateAgent(id: number, data: Partial<Agent>): Promise<Agent> {
    try {
      const response = await agentAPI.updateAgent(id, data);
      const agentData = extractData<AgentApiResponse>(response.data);
      toast.success("Agent modifié avec succès");
      return this.transformAgentData(agentData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur: ${message}`);
      throw error;
    }
  }

  async deleteAgent(id: number): Promise<void> {
    try {
      await agentAPI.deleteAgent(id);
      toast.success("Agent supprimé avec succès");
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur: ${message}`);
      throw error;
    }
  }
}