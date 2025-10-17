import React, { useState } from 'react';
import { useSites } from '../contexts/SiteContext';
import { usePlanning } from '../contexts/PlanningContext';
import { X, Plus, Trash2 } from 'lucide-react';
import type { PlanningAgent } from '../types/Types';

interface PlanningFormProps {
  onClose: () => void;
}

export const PlanningForm: React.FC<PlanningFormProps> = ({ onClose }) => {
  const { sites } = useSites();
  const { addPlanning } = usePlanning();

  const [siteId, setSiteId] = useState<number | ''>('');
  const [date, setDate] = useState<string>('');
  const [agents, setAgents] = useState<Omit<PlanningAgent, 'agent'>[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const selectedSite = sites.find(s => s.id === siteId);

  const addAgent = () => {
    if (!selectedSite?.agents || selectedSite.agents.length === 0) return;

    setAgents([
      ...agents,
      {
        agent_id: selectedSite.agents[0].id,
        shift: 'morning',
        status: 'present',
        motif: '',
        remplacant_id: undefined,
      }
    ]);
  };

  const removeAgent = (index: number) => {
    setAgents(agents.filter((_, i) => i !== index));
  };

  const updateAgent = (index: number, field: keyof PlanningAgent, value: any) => {
    const updated = [...agents];
    updated[index] = { ...updated[index], [field]: value };
    setAgents(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!siteId || !date || agents.length === 0) {
      return;
    }

    setSubmitting(true);
    try {
      await addPlanning({
        site_id: Number(siteId),
        date,
        agents,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting planning:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6  bg-blue-400">
          <h2 className="text-2xl font-semibold text-white">Nouveau Planning</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site
              </label>
              <select
                value={siteId}
                onChange={(e) => {
                  setSiteId(Number(e.target.value));
                  setAgents([]);
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un site</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.name} - {site.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-800">Agents</h3>
              <button
                type="button"
                onClick={addAgent}
                disabled={!siteId || !selectedSite?.agents || selectedSite.agents.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
                Ajouter un agent
              </button>
            </div>

            <div className="space-y-3">
              {agents.map((agent, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Agent
                      </label>
                      <select
                        value={agent.agent_id}
                        onChange={(e) => updateAgent(index, 'agent_id', Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        {selectedSite?.agents?.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.first_name} {a.last_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Shift
                      </label>
                      <select
                        value={agent.shift}
                        onChange={(e) => updateAgent(index, 'shift', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="morning">Matin</option>
                        <option value="evening">Soir</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Statut
                      </label>
                      <select
                        value={agent.status}
                        onChange={(e) => updateAgent(index, 'status', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="present">Présent</option>
                        <option value="absent">Absent</option>
                        <option value="repos">Repos</option>
                        <option value="permutation">Permutation</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeAgent(index)}
                        className="w-full px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center gap-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {agent.status === 'absent' && (
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Motif d'absence
                      </label>
                      <input
                        type="text"
                        value={agent.motif || ''}
                        onChange={(e) => updateAgent(index, 'motif', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Maladie, congé, etc."
                      />
                    </div>
                  )}

                  {(agent.status === 'absent' || agent.status === 'permutation') && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Remplaçant
                      </label>
                      <select
                        value={agent.remplacant_id || ''}
                        onChange={(e) => updateAgent(index, 'remplacant_id', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Aucun remplaçant</option>
                        {selectedSite?.agents?.filter(a => a.id !== agent.agent_id).map(a => (
                          <option key={a.id} value={a.id}>
                            {a.first_name} {a.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}

              {agents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun agent ajouté. Cliquez sur "Ajouter un agent" pour commencer.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-300">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || !siteId || !date || agents.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Création...' : 'Créer le planning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
