import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { SiteService } from "../services/SiteService";
import type { Site } from "../types/Types";

interface SiteContextType {
  sites: Site[];
  selectedSite: Site | null;
  loading: boolean;
  hasLoaded: boolean;
  error: string | null;
  operationLoading: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  fetchSites: () => Promise<void>;
  fetchSite: (id: number) => Promise<void>;
  createSite: (data: Partial<Site>) => Promise<Site>;
  updateSite: (id: number, data: Partial<Site>) => Promise<Site>;
  deleteSite: (id: number) => Promise<void>;
  clearSites: () => void;
  clearError: () => void;
}

const SiteContext = createContext<SiteContextType>({} as SiteContextType);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const [operationLoading, setOperationLoading] = useState({
    create: false,
    update: false,
    delete: false,
  });

  // ✅ fetchSites : bien fermée
  // ✅ fetchSites : CORRIGÉE avec typage sécurisé
  const fetchSites = useCallback(async () => {
    if (isFetchingRef.current) {
      console.warn("⏳ fetchSites ignoré : déjà en cours");
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await SiteService.getSites();
      console.log("📦 Réponse de getSites:", data);

      // ✅ CORRECTION AVEC TYPAGE SÉCURISÉ
      let sitesArray: Site[] = [];

      if (Array.isArray(data)) {
        sitesArray = data;
      } else if (data && typeof data === 'object' && 'data' in data) {
        // ✅ Vérification type-safe que data a une propriété 'data'
        sitesArray = (data as any).data || [];
      }

      console.log("🏗️ Sites à enregistrer:", sitesArray);
      setSites(sitesArray);
      setHasLoaded(true);

    } catch (err: any) {
      console.error("Erreur lors du chargement des sites :", err);
      const msg = err?.message || "Impossible de charger les sites.";
      setError(msg);
      setSites([]);
      setHasLoaded(true);
    } finally {
      console.log("✅ Fin du fetchSites");
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // ✅ fetchSite
  const fetchSite = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await SiteService.getSite(id);
      setSelectedSite(data || null);
    } catch (err: any) {
      console.error("Erreur lors du chargement du site :", err);
      setError(err?.message || "Erreur lors du chargement du site.");
      setSelectedSite(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ createSite
  const createSite = useCallback(async (data: Partial<Site>) => {
    setOperationLoading(p => ({ ...p, create: true }));
    try {
      const newSite = await SiteService.createSite(data as any);
      setSites(prev => [...prev, newSite]);
      toast.success("Site créé avec succès");
      return newSite;
    } catch (err: any) {
      console.error("Erreur création site :", err);
      throw err;
    } finally {
      setOperationLoading(p => ({ ...p, create: false }));
    }
  }, []);

  // ✅ updateSite
  const updateSite = useCallback(async (id: number, data: Partial<Site>) => {
    setOperationLoading(p => ({ ...p, update: true }));
    try {
      const updated = await SiteService.updateSite(id, data as any);
      setSites(prev => prev.map(s => (Number(s.id) === Number(id) ? updated : s)));
      if (Number(selectedSite?.id) === Number(id)) setSelectedSite(updated);
      toast.success("Site mis a jour avec succès");
      return updated;
    } catch (err: any) {
      console.error("Erreur maj site :", err);
      throw err;
    } finally {
      setOperationLoading(p => ({ ...p, update: false }));
    }
  }, [selectedSite]);

  // ✅ deleteSite
  const deleteSite = useCallback(async (id: number) => {
    setOperationLoading(p => ({ ...p, delete: true }));
    try {
      await SiteService.deleteSite(id);
      setSites(prev => prev.filter(s => Number(s.id) !== Number(id)));
      if (Number(selectedSite?.id) === Number(id)) setSelectedSite(null);
    } catch (err: any) {
      console.error("Erreur suppression site :", err);
      throw err;
    } finally {
      setOperationLoading(p => ({ ...p, delete: false }));
    }
  }, [selectedSite]);

  // ✅ clearSites
  const clearSites = useCallback(() => {
    setSites([]);
    setSelectedSite(null);
    setHasLoaded(false);
  }, []);

  // ✅ clearError
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <SiteContext.Provider
      value={{
        sites,
        selectedSite,
        loading,
        hasLoaded,
        error,
        operationLoading,
        fetchSites,
        fetchSite,
        createSite,
        updateSite,
        deleteSite,
        clearSites,
        clearError,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

// ✅ CORRECTION : Export correct du hook
export function useSites() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSites must be used within a SiteProvider');
  }
  return context;
}