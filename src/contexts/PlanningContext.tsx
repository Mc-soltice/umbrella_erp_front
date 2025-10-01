// src/contexts/PlanningContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as planningService from '../services/PlanningService';

interface PlanningContextType {
  plannings: any[];
  loading: boolean;
  error: string | null;
  loadPlannings: () => Promise<void>;
  addPlanning: (data: any) => Promise<void>;
  editPlanning: (id: number, data: any) => Promise<void>;
  removePlanning: (id: number) => Promise<void>;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plannings, setPlannings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlannings = async () => {
    setLoading(true);
    try {
      const data = await planningService.fetchPlannings();
      setPlannings(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addPlanning = async (data: any) => {
    try {
      const newPlanning = await planningService.createPlanning(data);
      setPlannings((prev) => [...prev, newPlanning]);
    } catch (err: any) {
      setError(err);
    }
  };

  const editPlanning = async (id: number, data: any) => {
    try {
      const updated = await planningService.updatePlanning(id, data);
      setPlannings((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err: any) {
      setError(err);
    }
  };

  const removePlanning = async (id: number) => {
    try {
      await planningService.deletePlanning(id);
      setPlannings((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    loadPlannings();
  }, []);

  return (
    <PlanningContext.Provider
      value={{ plannings, loading, error, loadPlannings, addPlanning, editPlanning, removePlanning }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) throw new Error("usePlanning doit être utilisé dans un PlanningProvider");
  return context;
};
