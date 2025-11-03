// src/pages/agents/Modals/AgentsBySite.tsx
import { useAgents } from "@/contexts/AgentContext";
import { Edit, Eye, IdCard, Mail, MapPin, Phone, Users } from 'lucide-react';
import type { Agent } from "../../../types/Types";

interface AgentsBySiteProps {
  agents: Agent[];
  onViewDetails: (agent: Agent) => void;
  onEdit: (agent: Agent) => void;
}

export default function AgentsBySite({
  agents,
  onViewDetails,
  onEdit
}: AgentsBySiteProps) {
  const { groupAgentsBySite } = useAgents();

  // 🔹 Grouper les agents par site
  const sitesWithAgents = groupAgentsBySite(agents);

  // 🔹 Obtenir les initiales
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // 🔹 Générer une couleur d'avatar basée sur le nom
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-orange-500 to-orange-600',
      'bg-gradient-to-r from-pink-500 to-pink-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (sitesWithAgents.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Aucun agent trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sitesWithAgents.map(({ site, agents: siteAgents }) => (
        <div key={site.id} className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          {/* En-tête du site - Inspiré de SiteTable */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/60 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{site.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{site.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{site.agents_count} agent(s)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des agents du site */}
          <div className="divide-y divide-gray-200/60">
            {siteAgents.map((agent) => (
              <div
                key={agent.id}
                className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  {/* Informations de l'agent */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl ${getAvatarColor(agent.last_name)} flex items-center justify-center text-white font-semibold shadow-sm`}>
                      {getInitials(agent.first_name, agent.last_name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {agent.last_name} {agent.first_name}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${agent.status
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}>
                          {agent.status ? 'Actif' : 'Inactif'}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <IdCard className="w-4 h-4" />
                          <span>{agent.matricule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-[200px]">{agent.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{agent.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onViewDetails(agent)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onEdit(agent)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}