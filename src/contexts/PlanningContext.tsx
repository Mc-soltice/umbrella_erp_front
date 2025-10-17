// src/contexts/PlanningContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { PlanningService } from '../services/PlanningService';
import toast from 'react-hot-toast';

interface PlanningContextType {
  plannings: any[];
  loading: boolean;
  error: string | null;
  loadPlannings: () => Promise<void>;
  addPlanning: (data: any) => Promise<void>;
  editPlanning: (id: number, data: any) => Promise<void>;
  removePlanning: (id: number) => Promise<void>;
  clearError: () => void;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plannings, setPlannings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const loadPlannings = async () => {
    setLoading(true);
    clearError();
    try {
      const data = await PlanningService.getAllPlannings(); // ✅ Utilise la méthode existante
      setPlannings(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du chargement des plannings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addPlanning = async (data: any) => {
    clearError();
    try {
      const newPlanning = await PlanningService.createPlanning(data);
      setPlannings((prev) => [...prev, newPlanning]);
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la création du planning';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err; // Propager l'erreur pour la gérer dans le composant
    }
  };

  const editPlanning = async (id: number, data: any) => {
    clearError();
    try {
      const updated = await PlanningService.updatePlanning(id, data);
      setPlannings((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour du planning';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const removePlanning = async (id: number) => {
    clearError();
    try {
      await PlanningService.deletePlanning(id);
      setPlannings((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la suppression du planning';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    loadPlannings();
  }, []);

  return (
    <PlanningContext.Provider
      value={{
        plannings,
        loading,
        error,
        loadPlannings,
        addPlanning,
        editPlanning,
        removePlanning,
        clearError
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

// ✅ Hook personnalisé
export const usePlanning = (): PlanningContextType => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error("usePlanning doit être utilisé à l'intérieur de PlanningProvider");
  }
  return context;
};