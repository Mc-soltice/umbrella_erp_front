import { Moon, Plus, Save, Sun, Trash2, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAgents } from '../../../contexts/AgentContext';
import { usePlannings } from '../../../contexts/PlanningContext';
import { useSites } from '../../../contexts/SiteContext';
import type { Agent, AttendanceStatus, PlanningAgentInput, ShiftType } from '../../../types/Types';

interface PlanningFormProps {
  onClose: () => void;
}

// ✅ Interface pour le site quand c'est un objet
interface SiteObject {
  id: number;
  name?: string;
  location?: string;
}

export const PlanningForm: React.FC<PlanningFormProps> = ({ onClose }) => {
  const { sites = [] } = useSites(); // ✅ Valeur par défaut pour sites
  const { agents = [] } = useAgents(); // ✅ Valeur par défaut pour agents
  const { createPlanning, operationLoading } = usePlannings();

  console.log('🔍 PlanningForm - Component mounted');
  console.log('🔍 PlanningForm - Sites:', sites);
  console.log('🔍 PlanningForm - Agents:', agents);

  const [formData, setFormData] = useState({
    site_id: 0,
    date: new Date().toISOString().split('T')[0],
  });
  const [shifts, setShifts] = useState({
    MORNING: { agents: [] as PlanningAgentInput[] },
    EVENING: { agents: [] as PlanningAgentInput[] },
  });
  const [submitting, setSubmitting] = useState(false);

  // ✅ CORRECTION : Filtrage robuste des agents par site avec typage strict
  const siteAgents = useMemo(() => {
    console.log('🔍 PlanningForm - Filtering agents for site_id:', formData.site_id);

    if (!formData.site_id || !agents || !Array.isArray(agents)) {
      console.log('🔍 PlanningForm - No site selected or no agents available');
      return [];
    }

    const filtered = agents.filter((agent: Agent) => {
      try {
        // Méthode robuste pour obtenir le site_id de l'agent
        let agentSiteId: number = 0;

        // Cas 1: agent.site est un string numérique (ex: "1")
        if (agent.site && typeof agent.site === 'string') {
          const parsed = parseInt(agent.site, 10);
          agentSiteId = isNaN(parsed) ? 0 : parsed;
        }
        // Cas 2: agent.site est un objet avec propriété id
        else if (agent.site && typeof agent.site === 'object') {
          const siteObj = agent.site as SiteObject;
          if (siteObj.id && typeof siteObj.id === 'number') {
            agentSiteId = siteObj.id;
          }
        }
        // Cas 3: agent a une propriété site_id (au cas où elle existe mais n'est pas dans le type)
        else if ('site_id' in agent && typeof (agent as any).site_id === 'number') {
          agentSiteId = (agent as any).site_id;
        }

        const matches = agentSiteId === formData.site_id;
        console.log(`🔍 PlanningForm - Agent ${agent.id} (site: ${agentSiteId}) matches site ${formData.site_id}: ${matches}`);
        return matches;
      } catch (error) {
        console.warn('Erreur lors du filtrage de l\'agent:', agent, error);
        return false;
      }
    });

    console.log('🔍 PlanningForm - Filtered agents:', filtered);
    return filtered;
  }, [agents, formData.site_id]);

  useEffect(() => {
    console.log('🔍 PlanningForm - siteAgents updated:', siteAgents);
  }, [siteAgents]);

  const addAgent = (shift: ShiftType) => {
    console.log('🔍 PlanningForm - Adding agent to shift:', shift);

    if (siteAgents.length === 0) {
      toast.error('Aucun agent disponible pour ce site');
      return;
    }

    // Prendre le premier agent disponible qui n'est pas déjà dans un shift
    const availableAgent = siteAgents.find(agent =>
      !isAgentInOtherShift(shift, agent.id)
    );

    if (!availableAgent) {
      toast.error('Tous les agents sont déjà assignés à un shift');
      return;
    }

    const newAgent: PlanningAgentInput = {
      agent_id: availableAgent.id,
      status: 'WORKED' as AttendanceStatus,
      reason: '',
      remplacant_id: undefined,
    };

    setShifts(prev => ({
      ...prev,
      [shift]: {
        agents: [...prev[shift].agents, newAgent]
      }
    }));
  };

  const removeAgent = (shift: ShiftType, index: number) => {
    setShifts(prev => ({
      ...prev,
      [shift]: {
        agents: prev[shift].agents.filter((_, i) => i !== index)
      }
    }));
  };

  const updateAgent = (shift: ShiftType, index: number, field: keyof PlanningAgentInput, value: string | number | undefined) => {
    setShifts(prev => ({
      ...prev,
      [shift]: {
        agents: prev[shift].agents.map((agent, i) =>
          i === index ? { ...agent, [field]: value } : agent
        )
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 PlanningForm - Submitting form');

    if (!formData.site_id || !formData.date) {
      toast.error('Le site et la date sont requis');
      return;
    }

    if (shifts.MORNING.agents.length === 0 && shifts.EVENING.agents.length === 0) {
      toast.error('Au moins un agent doit être ajouté dans un des shifts');
      return;
    }

    setSubmitting(true);
    try {
      await createPlanning({
        site_id: formData.site_id,
        date: formData.date,
        shifts,
      });
      toast.success('Planning créé avec succès');
      onClose();
    } catch (error) {
      console.error('Error submitting planning:', error);
      toast.error('Erreur lors de la création du planning');
    } finally {
      setSubmitting(false);
    }
  };

  const isAgentInOtherShift = (shift: ShiftType, agentId: number) => {
    const otherShift = shift === 'MORNING' ? 'EVENING' : 'MORNING';
    return shifts[otherShift].agents.some(agent => agent.agent_id === agentId);
  };

  const getAvailableAgents = (shift: ShiftType, currentAgentId?: number) => {
    if (!siteAgents || siteAgents.length === 0) return [];

    return siteAgents.filter(agent =>
      // Inclure l'agent courant (même s'il est dans l'autre shift)
      agent.id === currentAgentId ||
      // Ou les agents qui ne sont dans aucun shift
      !isAgentInOtherShift(shift, agent.id)
    );
  };

  console.log('🔍 PlanningForm - Rendering form');

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-gray-200 p-2">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl">
          <h2 className="text-2xl font-semibold text-white">Nouveau Planning</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-all duration-200 p-2 rounded-lg hover:bg-blue-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Site
              </label>
              <select
                value={formData.site_id}
                onChange={(e) => {
                  const newSiteId = Number(e.target.value);
                  console.log('🔍 PlanningForm - Site changed to:', newSiteId);
                  setFormData(prev => ({ ...prev, site_id: newSiteId }));
                  // Réinitialiser les shifts quand le site change
                  setShifts({ MORNING: { agents: [] }, EVENING: { agents: [] } });
                }}
                required
                className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value={0}>Sélectionner un site</option>
                {/* ✅ CORRECTION : Vérification que sites est un tableau avant d'utiliser map */}
                {Array.isArray(sites) && sites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.name} - {site.location}
                  </option>
                ))}
              </select>

              {/* Affichage du nombre d'agents disponibles */}
              {formData.site_id > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {siteAgents.length} agent(s) disponible(s) pour ce site
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {formData.site_id > 0 && (
            <div className="space-y-8">
              {/* Shift Matin */}
              <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-orange-800 flex items-center gap-3">
                      <Sun size={24} className="text-orange-600" />
                      Shift Matin (MORNING)
                    </h3>
                    <p className="text-sm text-orange-600 mt-1">
                      {shifts.MORNING.agents.length} agent(s) assigné(s)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addAgent('MORNING')}
                    disabled={siteAgents.length === 0}
                    className="bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700 border-none shadow-soft-lg px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                    Ajouter un agent
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shifts.MORNING.agents.map((agent, index) => (
                    <AgentCard
                      key={index}
                      agent={agent}
                      index={index}
                      shift="MORNING"
                      availableAgents={getAvailableAgents('MORNING', agent.agent_id)}
                      onUpdate={updateAgent}
                      onRemove={removeAgent}
                    />
                  ))}
                </div>

                {shifts.MORNING.agents.length === 0 && (
                  <div className="text-center py-8 text-orange-600 bg-orange-100 rounded-lg border border-orange-200">
                    {siteAgents.length === 0
                      ? 'Aucun agent disponible pour ce site'
                      : 'Aucun agent ajouté au shift matin'
                    }
                  </div>
                )}
              </div>

              {/* Shift Soir */}
              <div className="border-2 border-indigo-200 rounded-xl p-6 bg-indigo-50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-800 flex items-center gap-3">
                      <Moon size={24} className="text-indigo-600" />
                      Shift Soir (EVENING)
                    </h3>
                    <p className="text-sm text-indigo-600 mt-1">
                      {shifts.EVENING.agents.length} agent(s) assigné(s)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addAgent('EVENING')}
                    disabled={siteAgents.length === 0}
                    className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white hover:from-indigo-500 hover:to-indigo-700 border-none shadow-soft-lg px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                    Ajouter un agent
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shifts.EVENING.agents.map((agent, index) => (
                    <AgentCard
                      key={index}
                      agent={agent}
                      index={index}
                      shift="EVENING"
                      availableAgents={getAvailableAgents('EVENING', agent.agent_id)}
                      onUpdate={updateAgent}
                      onRemove={removeAgent}
                    />
                  ))}
                </div>

                {shifts.EVENING.agents.length === 0 && (
                  <div className="text-center py-8 text-indigo-600 bg-indigo-100 rounded-lg border border-indigo-200">
                    {siteAgents.length === 0
                      ? 'Aucun agent disponible pour ce site'
                      : 'Aucun agent ajouté au shift soir'
                    }
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-gray-300">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || operationLoading?.create || !formData.site_id || !formData.date || (shifts.MORNING.agents.length === 0 && shifts.EVENING.agents.length === 0)}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 border-none shadow-soft-lg px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting || operationLoading?.create ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Création...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Créer le planning
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant séparé pour la carte d'agent
interface AgentCardProps {
  agent: PlanningAgentInput;
  index: number;
  shift: ShiftType;
  availableAgents: Agent[];
  onUpdate: (shift: ShiftType, index: number, field: keyof PlanningAgentInput, value: string | number | undefined) => void;
  onRemove: (shift: ShiftType, index: number) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, index, shift, availableAgents, onUpdate, onRemove }) => {
  const currentAgent = availableAgents.find(a => a.id === agent.agent_id);

  return (
    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-800">Agent #{index + 1}</h4>
          {currentAgent && (
            <p className="text-xs text-gray-500">
              {currentAgent.matricule}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onRemove(shift, index)}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Agent
          </label>
          <select
            value={agent.agent_id}
            onChange={(e) => onUpdate(shift, index, 'agent_id', Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {Array.isArray(availableAgents) && availableAgents.map(agentOption => (
              <option key={agentOption.id} value={agentOption.id}>
                {agentOption.first_name} {agentOption.last_name} ({agentOption.matricule})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Statut
          </label>
          <select
            value={agent.status}
            onChange={(e) => onUpdate(shift, index, 'status', e.target.value as AttendanceStatus)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="WORKED">Présent</option>
            <option value="ABSENT">Absent</option>
            <option value="REST">Repos</option>
            <option value="REPLACEMENT">Remplacé</option>
          </select>
        </div>

        {agent.status === 'ABSENT' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Motif d'absence
            </label>
            <input
              type="text"
              value={agent.reason || ''}
              onChange={(e) => onUpdate(shift, index, 'reason', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Maladie, congé, etc."
            />
          </div>
        )}

        {agent.status === 'REPLACEMENT' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Remplaçant
            </label>
            <select
              value={agent.remplacant_id || ''}
              onChange={(e) => onUpdate(shift, index, 'remplacant_id', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Sélectionnez un remplaçant</option>
              {Array.isArray(availableAgents) && availableAgents
                .filter(a => a.id !== agent.agent_id)
                .map(remplacant => (
                  <option key={remplacant.id} value={remplacant.id}>
                    {remplacant.first_name} {remplacant.last_name}
                  </option>
                ))
              }
            </select>
          </div>
        )}
      </div>
    </div>
  );
};