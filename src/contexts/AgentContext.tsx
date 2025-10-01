// src/contexts/AgentContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { AgentService } from "../services/AgentService";
import type { Agent } from "../types/Types";

interface AgentContextType {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  fetchAgents: () => Promise<void>;
  fetchAgent: (id: number) => Promise<void>;
  createAgent: (data: Partial<Agent>) => Promise<void>;
  updateAgent: (id: number, data: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: number) => Promise<void>;
  getAgentStats: (id: number) => Promise<any>;
}

const AgentContext = createContext<AgentContextType>({} as AgentContextType);

// ✅ Instance unique du service
const agentService = new AgentService();

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔹 Récupérer tous les agents
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await agentService.getAgents();
      setAgents(data);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Récupérer un agent par ID
  const fetchAgent = async (id: number) => {
    setLoading(true);
    try {
      const data = await agentService.getAgent(id);
      setSelectedAgent(data);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Créer un nouvel agent
  const createAgent = async (data: Partial<Agent>) => {
    const newAgent = await agentService.createAgent(data);
    setAgents((prev) => [...prev, newAgent]);
  };

  // 🔹 Mettre à jour un agent existant
  const updateAgent = async (id: number, data: Partial<Agent>) => {
    const updated = await agentService.updateAgent(id, data);
    setAgents((prev) => prev.map((a) => (a.id === id ? updated : a)));
    if (selectedAgent?.id === id) {
      setSelectedAgent(updated);
    }
  };

  // 🔹 Supprimer un agent
  const deleteAgent = async (id: number) => {
    await agentService.deleteAgent(id);
    setAgents((prev) => prev.filter((a) => a.id !== id));
    if (selectedAgent?.id === id) {
      setSelectedAgent(null);
    }
  };

  // 🔹 Récupérer stats d’un agent
  const getAgentStats = async (id: number) => {
    return await agentService.getAgentStats(id);
  };

  // Charger les agents au montage
  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <AgentContext.Provider
      value={{
        agents,
        selectedAgent,
        loading,
        fetchAgents,
        fetchAgent,
        createAgent,
        updateAgent,
        deleteAgent,
        getAgentStats,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

// ✅ Hook custom
export const useAgents = () => useContext(AgentContext);
