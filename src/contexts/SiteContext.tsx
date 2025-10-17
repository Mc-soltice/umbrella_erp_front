// src/contexts/SiteContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { SiteService } from "../services/SiteService";
import type { Site } from "../types/Types";
import toast from "react-hot-toast";

interface SiteContextType {
  sites: Site[];
  selectedSite: Site | null;
  loading: boolean;
  hasLoaded: boolean;
  fetchSites: () => Promise<void>;
  fetchSite: (id: number) => Promise<void>;
  createSite: (data: Partial<Site>) => Promise<Site>;
  updateSite: (id: number, data: Partial<Site>) => Promise<Site>;
  deleteSite: (id: number) => Promise<void>;
  clearSites: () => void;
}

const SiteContext = createContext<SiteContextType>({} as SiteContextType);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);


  // 🔹 Récupérer tous les sites - CORRIGÉ sans dépendance loading
  const fetchSites = useCallback(async () => {
    if (loading) {
      console.log('⏳ Fetch déjà en cours, skip...');
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 Début du chargement des sites...');
      const data = await SiteService.getSites();
      setSites(data);
      setHasLoaded(true);
      console.log('✅ Sites chargés avec succès');
    } catch (error) {
      console.error("❌ Erreur lors du chargement des sites :", error);
      toast.error("Impossible de charger la liste des sites.");
    } finally {
      setLoading(false);
      console.log('🏁 Chargement terminé');
    }
  }, []);

  // 🔹 Récupérer un site
  const fetchSite = async (id: number) => {
    setLoading(true);
    try {
      const data = await SiteService.getSite(id);
      setSelectedSite(data);
    } catch (error) {
      console.error("Erreur lors du chargement du site :", error);
      toast.error("Erreur lors du chargement du site.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Créer un site
  const createSite = async (data: Partial<Site>) => {
    try {
      const newSite = await SiteService.createSite(data);
      setSites((prev) => [...prev, newSite]);
      toast.success("Site créé avec succès !");
      return newSite;
    } catch (error) {
      console.error("Erreur lors de la création du site :", error);
      toast.error("Échec de la création du site.");
      throw error;
    }
  };

  // 🔹 Mettre à jour un site
  const updateSite = async (id: number, data: Partial<Site>) => {
    try {
      const updated = await SiteService.updateSite(id, data);
      setSites((prev) => prev.map((s) => (Number(s.id) === Number(id) ? updated : s)));
      if (Number(selectedSite?.id) === id) {
        setSelectedSite(updated);
      }
      toast.success("Site mis à jour avec succès !");
      return updated;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du site :", error);
      toast.error("Impossible de mettre à jour le site.");
      throw error;
    }
  };

  // 🔹 Supprimer un site
  const deleteSite = async (id: number) => {
    try {
      await SiteService.deleteSite(id);
      setSites((prev) => prev.filter((s) => Number(s.id) !== Number(id)));
      if (Number(selectedSite?.id) === id) {
        setSelectedSite(null);
      }
      toast.success("Site supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du site :", error);
      toast.error("Erreur lors de la suppression du site.");
      throw error;
    }
  };

  // 🔹 Vider les sites
  const clearSites = () => {
    setSites([]);
    setSelectedSite(null);
    setHasLoaded(false);
  };

  return (
    <SiteContext.Provider
      value={{
        sites,
        selectedSite,
        loading,
        hasLoaded,
        fetchSites,
        fetchSite,
        createSite,
        updateSite,
        deleteSite,
        clearSites,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSites = () => useContext(SiteContext);