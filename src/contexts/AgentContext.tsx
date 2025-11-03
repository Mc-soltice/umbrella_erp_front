// src/contexts/AgentContext.tsx
import React, { createContext, useContext, useState } from "react";
import { AgentService } from "../services/AgentService";
import type { Agent, Site } from "../types/Types";

interface AgentContextType {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  hasLoaded: boolean;
  fetchAgents: () => Promise<void>;
  fetchAgent: (id: number) => Promise<void>;
  createAgent: (data: Partial<Agent>) => Promise<Agent>;
  updateAgent: (id: number, data: Partial<Agent>) => Promise<Agent>;
  deleteAgent: (id: number) => Promise<void>;
  groupAgentsBySite: (agents: Agent[]) => { site: Site; agents: Agent[] }[]; // Ajouté
  clearAgents: () => void;
}

const AgentContext = createContext<AgentContextType>({} as AgentContextType);

const agentService = new AgentService();

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const fetchAgents = async () => {
    if (hasLoaded && agents.length > 0) {
      return;
    }

    setLoading(true);
    try {
      console.log('🔹 Début du fetchAgents...');
      const data = await agentService.getAgents();
      console.log('🔹 Données reçues dans le contexte:', data);
      setAgents(data);
      setHasLoaded(true);
      console.log('🔹 État mis à jour - agents count:', data.length);
    } catch (error) {
      console.error('❌ Erreur dans fetchAgents:', error);
      setHasLoaded(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchAgent = async (id: number) => {
    setLoading(true);
    try {
      const data = await agentService.getAgent(id);
      setSelectedAgent(data);
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (data: Partial<Agent>) => {
    const newAgent = await agentService.createAgent(data);
    setAgents((prev) => [...prev, newAgent]);
    return newAgent;
  };

  const updateAgent = async (id: number, data: Partial<Agent>) => {
    const updated = await agentService.updateAgent(id, data);
    setAgents((prev) => prev.map((a) => (a.id === id ? updated : a)));
    if (selectedAgent?.id === id) {
      setSelectedAgent(updated);
    }
    return updated;
  };

  const deleteAgent = async (id: number) => {
    await agentService.deleteAgent(id);
    setAgents((prev) => prev.filter((a) => a.id !== id));
    if (selectedAgent?.id === id) {
      setSelectedAgent(null);
    }
  };

  const clearAgents = () => {
    setAgents([]);
    setSelectedAgent(null);
    setHasLoaded(false);
  };

  const groupAgentsBySite = (agentsToGroup: Agent[]) => {
    return agentService.groupAgentsBySite(agentsToGroup);
  };

  return (
    <AgentContext.Provider
      value={{
        agents,
        selectedAgent,
        loading,
        hasLoaded,
        fetchAgents,
        fetchAgent,
        createAgent,
        updateAgent,
        deleteAgent,
        groupAgentsBySite,
        clearAgents,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

function useAgents() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useAgents };

