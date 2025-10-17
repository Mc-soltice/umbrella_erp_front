import React from 'react';
import { usePlanning } from '../contexts/PlanningContext';
import { useSites } from '../contexts/SiteContext';
import { Calendar, MapPin, Users, Trash2, Clock } from 'lucide-react';
import type { Planning, PlanningAgent } from '../types/Types';

interface PlanningListProps {
  onEdit?: (planning: Planning) => void;
}

export const PlanningList: React.FC<PlanningListProps> = ({ }) => {
  const { plannings, loading, removePlanning } = usePlanning();
  const { sites } = useSites();

  const getSiteName = (siteId: number) => {
    const site = sites.find(s => Number(s.id) === siteId);
    return site ? `${site.name} - ${site.location}` : 'Site inconnu';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      repos: 'bg-blue-100 text-blue-800',
      permutation: 'bg-yellow-100 text-yellow-800',
    };

    const labels = {
      present: 'Présent',
      absent: 'Absent',
      repos: 'Repos',
      permutation: 'Permutation',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getShiftBadge = (shift: string) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        shift === 'morning' ? 'bg-orange-100 text-orange-800' : 'bg-indigo-100 text-indigo-800'
      }`}>
        {shift === 'morning' ? 'Matin' : 'Soir'}
      </span>
    );
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce planning ?')) {
      try {
        await removePlanning(id);
      } catch (error) {
        console.error('Error deleting planning:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (plannings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">Aucun planning disponible</p>
        <p className="text-gray-500 text-sm mt-2">Créez votre premier planning pour commencer</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {plannings.map((planning) => (
        <div
          key={planning.id}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span className="font-semibold">{getSiteName(planning.site_id)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{new Date(planning.date).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(planning.id)}
                className="p-2 hover:bg-blue-800 rounded-lg transition"
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <Users size={18} />
              <span className="font-medium">{planning.agents.length} agent(s) planifié(s)</span>
            </div>

            <div className="space-y-3">
              {planning.agents.map((planningAgent: PlanningAgent, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {planningAgent.agent?.first_name?.[0]}{planningAgent.agent?.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {planningAgent.agent?.first_name} {planningAgent.agent?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Matricule: {planningAgent.agent?.matricule}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-500" />
                        {getShiftBadge(planningAgent.shift)}
                      </div>
                      {getStatusBadge(planningAgent.status)}
                    </div>
                  </div>

                  {planningAgent.motif && (
                    <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                      <span className="font-medium">Motif:</span> {planningAgent.motif}
                    </div>
                  )}

                  {planningAgent.remplacant_id && (
                    <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                      <span className="font-medium">Remplaçant:</span> ID {planningAgent.remplacant_id}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
