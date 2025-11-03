// src/pages/agents/components/DetailAgentModal.tsx
import { Calendar, CheckCircle, Edit, IdCard, Mail, MapPin, Phone, User } from 'lucide-react';
import type { Agent } from "../../../types/Types";

interface DetailAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  onEdit: (agent: Agent) => void;
}

export default function DetailAgentModal({
  isOpen,
  onClose,
  agent,
  onEdit
}: DetailAgentModalProps) {

  // 🔹 Formater la date avec gestion d'erreur
  const formatDate = (dateInput: string | Date) => {
    try {
      const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      return isNaN(date.getTime())
        ? "Date invalide"
        : date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
    } catch (error) {
      return "Date invalide";
    }
  };

  if (!isOpen || !agent) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box rounded-2xl max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900">Détails de l'Agent</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
            <User className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-900">
                {agent.last_name} {agent.first_name}
              </div>
              <div className="text-sm text-gray-600">Agent</div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <IdCard className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Matricule</div>
                <div className="font-medium">{agent.matricule}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{agent.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Téléphone</div>
                <div className="font-medium">{agent.phone}</div>
              </div>
            </div>

            {/* Dans DetailAgentModal.tsx */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Site</div>
                <div className="font-medium">{agent.site?.name || "Non spécifié"}</div>
                {agent.site?.location && (
                  <div className="text-xs text-gray-500 mt-1">{agent.site.location}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Localisation</div>
                <div className="font-medium">{agent.location || "Non spécifiée"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Date de création</div>
                <div className="font-medium">{formatDate(agent.created_at)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${agent.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Statut</div>
                <div className="font-medium">{agent.status ? 'Actif' : 'Inactif'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action mt-6 gap-3">
          <button
            onClick={() => onEdit(agent)}
            className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl flex-1 gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </button>
          <button className="btn bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 border-none rounded-xl flex-1 gap-2 shadow-soft-lg">
            <CheckCircle className="w-4 h-4" />
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}