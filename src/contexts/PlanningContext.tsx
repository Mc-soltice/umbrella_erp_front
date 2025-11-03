import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { PlanningService } from "../services/PlanningService";
import type { CreatePlanningData, Planning, UpdatePlanningData } from "../types/Types";
import { useAuth } from "./AuthContext";

interface PlanningContextType {
  plannings: Planning[];
  selectedPlanning: Planning | null;
  loading: boolean;
  hasLoaded: boolean;
  error: string | null;
  operationLoading: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  fetchPlannings: () => Promise<void>;
  fetchPlanning: (id: number) => Promise<void>;
  createPlanning: (data: Omit<CreatePlanningData, 'created_by'>) => Promise<Planning>;
  updatePlanning: (id: number, data: Omit<UpdatePlanningData, 'created_by'>) => Promise<Planning>;
  deletePlanning: (id: number) => Promise<void>;
  clearPlannings: () => void;
  clearError: () => void;
}

const PlanningContext = createContext<PlanningContextType>({} as PlanningContextType);

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plannings, setPlannings] = useState<Planning[]>([]);
  const [selectedPlanning, setSelectedPlanning] = useState<Planning | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const [operationLoading, setOperationLoading] = useState({
    create: false,
    update: false,
    delete: false,
  });

  const { user } = useAuth();

  const fetchPlannings = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await PlanningService.getPlannings();

      // ✅ CORRECTION : Type-safe sans 'any'
      let planningsArray: Planning[] = [];
      if (Array.isArray(data)) {
        planningsArray = data;
      } else if (data && typeof data === 'object') {
        // Vérification type-safe pour la propriété 'data'
        const apiResponse = data as { data?: Planning[] };
        planningsArray = apiResponse.data || [];
      }

      setPlannings(planningsArray);
      setHasLoaded(true);
    } catch (err: unknown) {
      // ✅ CORRECTION : Type-safe error handling
      const errorMessage = err instanceof Error ? err.message : "Impossible de charger les plannings.";
      console.error("Erreur lors du chargement des plannings :", err);
      setError(errorMessage);
      setPlannings([]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const createPlanning = useCallback(async (data: Omit<CreatePlanningData, 'created_by'>) => {
    if (!user) throw new Error("Utilisateur non connecté");

    setOperationLoading(prev => ({ ...prev, create: true }));
    try {
      const planningData: CreatePlanningData = {
        ...data,
        created_by: user.id
      };
      const newPlanning = await PlanningService.createPlanning(planningData);
      setPlannings(prev => [...prev, newPlanning]);
      return newPlanning;
    } catch (err: unknown) {
      // ✅ CORRECTION : Type-safe error handling
      console.error("Erreur création planning :", err);
      throw err;
    } finally {
      setOperationLoading(prev => ({ ...prev, create: false }));
    }
  }, [user]);

  const updatePlanning = useCallback(async (id: number, data: Omit<UpdatePlanningData, 'created_by'>) => {
    if (!user) throw new Error("Utilisateur non connecté");

    setOperationLoading(prev => ({ ...prev, update: true }));
    try {
      const planningData: UpdatePlanningData = {
        ...data,
        id,
        created_by: user.id
      };
      const updated = await PlanningService.updatePlanning(id, planningData);
      setPlannings(prev => prev.map(p => (Number(p.id) === Number(id) ? updated : p)));
      if (Number(selectedPlanning?.id) === Number(id)) setSelectedPlanning(updated);
      return updated;
    } catch (err: unknown) {
      // ✅ CORRECTION : Type-safe error handling
      console.error("Erreur maj planning :", err);
      throw err;
    } finally {
      setOperationLoading(prev => ({ ...prev, update: false }));
    }
  }, [user, selectedPlanning]);

  const deletePlanning = useCallback(async (id: number) => {
    setOperationLoading(prev => ({ ...prev, delete: true }));
    try {
      await PlanningService.deletePlanning(id);
      setPlannings(prev => prev.filter(p => Number(p.id) !== Number(id)));
      if (Number(selectedPlanning?.id) === Number(id)) setSelectedPlanning(null);
    } catch (err: unknown) {
      // ✅ CORRECTION : Type-safe error handling
      console.error("Erreur suppression planning :", err);
      throw err;
    } finally {
      setOperationLoading(prev => ({ ...prev, delete: false }));
    }
  }, [selectedPlanning]);

  // ✅ CORRECTION : Suppression du try/catch inutile
  const fetchPlanning = useCallback(async (id: number) => {
    const planning = await PlanningService.getPlanning(id);
    setSelectedPlanning(planning);
  }, []);

  const clearPlannings = useCallback(() => {
    setPlannings([]);
    setSelectedPlanning(null);
    setHasLoaded(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue: PlanningContextType = {
    plannings,
    selectedPlanning,
    loading,
    hasLoaded,
    error,
    operationLoading,
    fetchPlannings,
    fetchPlanning,
    createPlanning,
    updatePlanning,
    deletePlanning,
    clearPlannings,
    clearError,
  };

  return (
    <PlanningContext.Provider value={contextValue}>
      {children}
    </PlanningContext.Provider>
  );
};

// ✅ CORRECTION : Export séparé pour éviter l'erreur React Refresh
function usePlannings() {
  const context = useContext(PlanningContext);
  if (context === undefined) {
    throw new Error('usePlannings must be used within a PlanningProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { usePlannings };

