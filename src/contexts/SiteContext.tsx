// src/contexts/SiteContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { SiteService } from "../services/SiteService";
import type { Site } from "../types/Types";

interface SiteContextType {
  sites: Site[];
  selectedSite: Site | null;
  loading: boolean;
  fetchSites: () => Promise<void>;
  fetchSite: (id: number) => Promise<void>;
  createSite: (data: Partial<Site>) => Promise<void>;
  updateSite: (id: number, data: Partial<Site>) => Promise<void>;
  deleteSite: (id: number) => Promise<void>;
}

const SiteContext = createContext<SiteContextType>({} as SiteContextType);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔹 Récupérer tous les sites
  const fetchSites = async () => {
    setLoading(true);
    try {
      const data = await SiteService.getSites();
      setSites(data);
    } catch (error) {
      console.error("Erreur lors du chargement des sites :", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Récupérer un site
  const fetchSite = async (id: number) => {
    setLoading(true);
    try {
      const data = await SiteService.getSite(id);
      setSelectedSite(data);
    } catch (error) {
      console.error("Erreur lors du chargement du site :", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Créer un site
  const createSite = async (data: Partial<Site>) => {
    try {
      const newSite = await SiteService.createSite(data);
      setSites((prev) => [...prev, newSite]);
    } catch (error) {
      console.error("Erreur lors de la création du site :", error);
    }
  };

  // 🔹 Mettre à jour un site
  const updateSite = async (id: number, data: Partial<Site>) => {
    try {
      const updated = await SiteService.updateSite(id, data);
      setSites((prev) => prev.map((s) => (s.id === id ? updated : s)));
      if (selectedSite?.id === id) {
        setSelectedSite(updated);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du site :", error);
    }
  };

  // 🔹 Supprimer un site
  const deleteSite = async (id: number) => {
    try {
      await SiteService.deleteSite(id);
      setSites((prev) => prev.filter((s) => s.id !== id));
      if (selectedSite?.id === id) {
        setSelectedSite(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du site :", error);
    }
  };

  // Charger les sites au montage
  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <SiteContext.Provider
      value={{
        sites,
        selectedSite,
        loading,
        fetchSites,
        fetchSite,
        createSite,
        updateSite,
        deleteSite,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSites = () => useContext(SiteContext);
