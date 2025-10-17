// src/pages/candidatures/components/EditCandidatureModal.tsx
import { useState, useEffect } from 'react';
import type { Candidature } from "../../../types/Types";
import { useCandidature } from '../../../contexts/CandidatureContext';
import { Orbit } from 'ldrs/react';
import { CheckCircle } from 'lucide-react';

interface EditCandidatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidature: Candidature | null;
}

export default function EditCandidatureModal({ isOpen, onClose, candidature }: EditCandidatureModalProps) {
  const { updateCandidature, operationLoading } = useCandidature();
  
  const [editFormData, setEditFormData] = useState({
    last_name: "",
    first_name: "",
    telephone: "",
    email: "",
    location: ""
  });

  // 🔹 Mettre à jour le formulaire quand la candidature change
  useEffect(() => {
    if (candidature) {
      setEditFormData({
        last_name: candidature.last_name || "",
        first_name: candidature.first_name || "",
        telephone: candidature.telephone || "",
        email: candidature.email || "",
        location: candidature.location || ""
      });
    }
  }, [candidature]);

  // 🔹 Gestion de la modification
  const handleUpdateCandidature = async () => {
    if (!candidature) return;

    try {
      await updateCandidature(candidature.id, editFormData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  if (!isOpen || !candidature) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box border-2 border-orange-100 border-dashed rounded-2xl max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900">Modifier la Candidature</h3>
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
              <input
                type="text"
                className="input input-bordered w-full rounded-xl px-4 py-3"
                value={value}
                onChange={(e) => setEditFormData(prev => ({ 
                  ...prev, 
                  [key]: e.target.value 
                }))}
              />
            </div>
          ))}
        </div>
        
        <div className="modal-action mt-6">
          <button
            className="btn w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none rounded-xl py-3 font-semibold shadow-soft-lg flex items-center justify-center gap-2"
            onClick={handleUpdateCandidature}
            disabled={operationLoading.update === candidature.id}
          >
            {operationLoading.update === candidature.id ? (
              <Orbit size="20" speed="1.5" color="white" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Mettre à jour
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}