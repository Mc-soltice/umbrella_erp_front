// src/services/SiteService.ts
import * as siteAPI from "../api/siteApi";
import type { Site } from "../types/Types";

export const SiteService = {
  async getSites(): Promise<Site[]> {
    const response = await siteAPI.getSites();
    return response.data;
  },

  async getSite(id: number): Promise<Site> {
    const response = await siteAPI.getSite(id);
    return response.data;
  },

  async createSite(data: Partial<Site>): Promise<Site> {
    const response = await siteAPI.createSite(data);
    return response.data;
  },

  async updateSite(id: number, data: Partial<Site>): Promise<Site> {
    const response = await siteAPI.updateSite(id, data);
    return response.data;
  },

  async deleteSite(id: number): Promise<void> {
    await siteAPI.deleteSite(id);
  },
};
