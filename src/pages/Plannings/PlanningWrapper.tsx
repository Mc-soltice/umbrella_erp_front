// src/pages/Plannings/PlanningWrapper.tsx - AMÉLIORATION
import { useEffect } from 'react';
import { AgentProvider, useAgents } from '../../contexts/AgentContext';
import { PlanningProvider } from '../../contexts/PlanningContext';
import { SiteProvider, useSites } from '../../contexts/SiteContext';
import PlanningManagement from './PlanningManagement';

// Composant pour précharger les données
function DataPreloader() {
  const { fetchSites, hasLoaded: sitesLoaded } = useSites();
  const { fetchAgents, hasLoaded: agentsLoaded } = useAgents();

  useEffect(() => {
    console.log('🔄 Preloading data...');

    if (!sitesLoaded) {
      fetchSites().catch(console.error);
    }

    if (!agentsLoaded) {
      fetchAgents().catch(console.error);
    }
  }, [sitesLoaded, agentsLoaded, fetchSites, fetchAgents]);

  return null;
}

export default function PlanningWrapper() {
  return (
    <SiteProvider>
      <AgentProvider>
        <PlanningProvider>
          <DataPreloader />
          <PlanningManagement />
        </PlanningProvider>
      </AgentProvider>
    </SiteProvider>
  );
}