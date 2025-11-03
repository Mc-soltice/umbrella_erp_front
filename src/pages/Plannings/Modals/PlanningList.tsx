import { Calendar, Clock, Edit, MapPin, Trash2, Users } from 'lucide-react';
import React from 'react';
import { usePlannings } from '../../../contexts/PlanningContext';
import type { Planning, PlanningAgent } from '../../../types/Types';

interface PlanningListProps {
  onEdit?: (planning: Planning) => void;
}

export const PlanningList: React.FC<PlanningListProps> = ({ onEdit }) => {
  const { plannings, loading, deletePlanning } = usePlannings();

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce planning ?')) {
      try {
        await deletePlanning(id);
      } catch (error) {
        console.error('Error deleting planning:', error);
      }
    }
  };

  if (loading && plannings.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (plannings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
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
          className="bg-white rounded-xl shadow-soft-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
        >
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-blue-100" />
                  <span className="font-semibold text-lg">{planning.site}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-blue-100" />
                  <span className="text-blue-50">
                    {new Date(planning.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-blue-100" />
                  <span className="text-blue-50">
                    {planning.shifts.day.length + planning.shifts.evening.length} agent(s)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(planning)}
                    className="p-2 hover:bg-blue-700 rounded-lg transition-all duration-200"
                    title="Modifier"
                  >
                    <Edit size={18} className="text-blue-100" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(planning.id)}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-all duration-200"
                  title="Supprimer"
                >
                  <Trash2 size={18} className="text-blue-100" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Shift Matin */}
            {planning.shifts.day.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-orange-500" />
                  Shift Matin ({planning.shifts.day.length} agent(s))
                </h3>
                <div className="grid gap-3">
                  {planning.shifts.day.map((planningAgent: PlanningAgent) => (
                    <PlanningAgentCard
                      key={planningAgent.id}
                      planningAgent={planningAgent}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Shift Soir */}
            {planning.shifts.evening.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-indigo-500" />
                  Shift Soir ({planning.shifts.evening.length} agent(s))
                </h3>
                <div className="grid gap-3">
                  {planning.shifts.evening.map((planningAgent: PlanningAgent) => (
                    <PlanningAgentCard
                      key={planningAgent.id}
                      planningAgent={planningAgent}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Créé par: <span className="font-medium">{planning.created_by}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant séparé pour la carte d'agent
const PlanningAgentCard: React.FC<{ planningAgent: PlanningAgent }> = ({ planningAgent }) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      WORKED: 'bg-green-100 text-green-800 border border-green-200',
      ABSENT: 'bg-red-100 text-red-800 border border-red-200',
      REST: 'bg-blue-100 text-blue-800 border border-blue-200',
      REPLACEMENT: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    };

    const labels = {
      WORKED: 'Présent',
      ABSENT: 'Absent',
      REST: 'Repos',
      REPLACEMENT: 'Remplacé',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getShiftBadge = (shift: string) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${shift === 'morning' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
        }`}>
        {shift === 'morning' ? 'Matin' : 'Soir'}
      </span>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-sm">
            {planningAgent.agent?.first_name?.[0]}{planningAgent.agent?.last_name?.[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {planningAgent.agent?.first_name} {planningAgent.agent?.last_name}
            </p>
            <p className="text-sm text-gray-500">
              Matricule: {planningAgent.agent?.matricule}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-500" />
            {getShiftBadge(planningAgent.shift)}
          </div>
          {getStatusBadge(planningAgent.status)}
        </div>
      </div>

      {planningAgent.motif && (
        <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
          <span className="font-medium">Motif:</span> {planningAgent.motif}
        </div>
      )}

      {planningAgent.remplacant && (
        <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <span className="font-medium">Remplaçant:</span> {planningAgent.remplacant.first_name} {planningAgent.remplacant.last_name}
          {planningAgent.remplacant.matricule && ` (${planningAgent.remplacant.matricule})`}
        </div>
      )}
    </div>
  );
};