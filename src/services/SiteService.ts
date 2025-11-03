// src/services/SiteService.ts
import * as siteAPI from "../api/siteApi";

import type { Site, CreateSiteData, UpdateSiteData } from "../types/Types";

export const SiteService = {
  async getSites(): Promise<Site[]> {
    try {
      const response = await siteAPI.getSites();
      return response.data.data || response.data;
      // return response.data || [];
    } catch (error: any) {
      console.error("Erreur lors du chargement des sites :", error);
      throw error; // ✅ Juste throw, pas de toast
    }
  },



  async getSite(id: number): Promise<Site> {
    try {
      const response = await siteAPI.getSite(id);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors du chargement du site ${id} :`, error);
      throw error;
    }
  },

  async createSite(data: CreateSiteData): Promise<Site> {
    try {
      const response = await siteAPI.createSite(data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la création du site :", error);
      throw error;
    }
  },

  async updateSite(id: number, data: UpdateSiteData): Promise<Site> {
    try {
      const response = await siteAPI.updateSite(id, data);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du site ${id} :`, error);
      throw error;
    }
  },

  async deleteSite(id: number): Promise<void> {
    try {
      await siteAPI.deleteSite(id);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du site ${id} :`, error);
      throw error;
    }
  },
};