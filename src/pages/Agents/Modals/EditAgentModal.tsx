// src/pages/agents/components/EditAgentModal.tsx
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAgents } from '../../../contexts/AgentContext';
import type { Agent } from "../../../types/Types";

interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
}

export default function EditAgentModal({ isOpen, onClose, agent }: EditAgentModalProps) {
  const { updateAgent } = useAgents();

  const [editFormData, setEditFormData] = useState({
    last_name: "",
    first_name: "",
    phone: "",
    email: "",
    matricule: "",
    site: "",
    responsable: "",
    status: true
  });

  // 🔹 Mettre à jour le formulaire quand l'agent change
  useEffect(() => {
    if (agent) {
      setEditFormData({
        last_name: agent.last_name || "",
        first_name: agent.first_name || "",
        phone: agent.phone || "",
        email: agent.email || "",
        matricule: agent.matricule || "",
        site: agent.site || "",
        status: agent.status || true
      });
    }
  }, [agent]);

  // 🔹 Gestion de la modification
  const handleUpdateAgent = async () => {
    if (!agent) return;

    try {
      await updateAgent(agent.id, editFormData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  if (!isOpen || !agent) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box border-2 border-orange-100 border-dashed rounded-2xl max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900">Modifier l'Agent</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(editFormData).map(([key, value]) => (
            <div key={key}>
              <label className="label text-sm font-medium text-gray-700 capitalize">
                {key.replace('_', ' ')}
              </label>
              {key === 'status' ? (
                <select
                  className="select select-bordered w-full rounded-xl px-4 py-3"
                  value={value.toString()}
                  onChange={(e) => setEditFormData(prev => ({
                    ...prev,
                    [key]: e.target.value === 'true'
                  }))}
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="input input-bordered w-full rounded-xl px-4 py-3"
                  value={value}
                  onChange={(e) => setEditFormData(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }))}
                />
              )}
            </div>
          ))}
        </div>

        <div className="modal-action mt-6">
          <button
            className="btn w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700  border-none rounded-xl py-3 font-semibold shadow-soft-lg flex items-center justify-center gap-2"
            onClick={handleUpdateAgent}
          >
            <CheckCircle className="w-5 h-5" />
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );
}