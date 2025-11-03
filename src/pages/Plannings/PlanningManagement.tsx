// Dans src/pages/Plannings/PlanningManagement.tsx - CORRECTION
import { Calendar, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAgents } from '../../contexts/AgentContext'; // ✅ Ajout
import { usePlannings } from '../../contexts/PlanningContext';
import { useSites } from '../../contexts/SiteContext'; // ✅ Ajout
import { PlanningForm } from './Modals/PlanningForm';
import { PlanningList } from './Modals/PlanningList';

const PlanningManagementContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { plannings, loading, hasLoaded, fetchPlannings } = usePlannings();
  const { fetchAgents, hasLoaded: agentsLoaded } = useAgents(); // ✅ Récupération agents
  const { fetchSites, hasLoaded: sitesLoaded } = useSites(); // ✅ Récupération sites

  useEffect(() => {
    console.log('🔄 Initial data loading...');

    // Charger les données nécessaires
    const loadInitialData = async () => {
      try {
        if (!sitesLoaded) {
          await fetchSites();
        }
        if (!agentsLoaded) {
          await fetchAgents();
        }
        if (!hasLoaded) {
          await fetchPlannings();
        }
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, [hasLoaded, fetchPlannings, sitesLoaded, agentsLoaded, fetchSites, fetchAgents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg">
                <Calendar size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Gestion des Plannings</h1>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Chargement...' : `${plannings.length} planning(s) au total`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 border-none shadow-soft-lg px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200"
            >
              <PlusCircle size={20} />
              Nouveau Planning
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft-lg p-6 border border-gray-100">
          <PlanningList />
        </div>
      </div>

      {showForm && <PlanningForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default function PlanningManagement() {
  return <PlanningManagementContent />;
}