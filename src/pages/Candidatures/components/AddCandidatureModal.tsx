// src/page/candidatures/components/AddCandidatureModal.tsx
import { useState } from 'react';
import { useCandidature } from '../../../contexts/CandidatureContext';
import { Orbit } from 'ldrs/react';
import { Save } from 'lucide-react';

interface AddCandidatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCandidatureModal({ isOpen, onClose }: AddCandidatureModalProps) {
  const { addCandidature, operationLoading } = useCandidature();
  
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    phone: "",
    email: "",
    location: ""
  });

  // 🔹 Gestion de l'ajout
  const handleAddCandidature = async () => {
    try {
      await addCandidature({ ...formData, phone: Number(formData.phone) });
      setFormData({ last_name: "", first_name: "", phone: "", email: "", location: "" });
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box border-2 border-blue-100 rounded-2xl max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900">Nouvelle Candidature</h3>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="label text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              placeholder="Entrez le nom"
              className="input input-bordered w-full rounded-xl px-4 py-3"
              value={formData.last_name}
              onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="label text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              placeholder="Entrez le prénom"
              className="input input-bordered w-full rounded-xl px-4 py-3"
              value={formData.first_name}
              onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="label text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Entrez l'email"
              className="input input-bordered w-full rounded-xl px-4 py-3"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="label text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              placeholder="Entrez le téléphone"
              className="input input-bordered w-full rounded-xl px-4 py-3"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
            />
          </div>

          <div>
            <label className="label text-sm font-medium text-gray-700">Localisation</label>
            <input
              type="text"
              placeholder="Entrez le lieu de résidence"
              className="input input-bordered w-full rounded-xl px-4 py-3"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="modal-action mt-6">
          <button
            className="w-full bg-gradient-to-r from-blue-300 to-blue-600 text-white hover:from-blue-400 hover:to-blue-700 border-none rounded-xl py-3 font-semibold shadow-soft-lg flex items-center justify-center gap-2"
            onClick={handleAddCandidature}
            disabled={operationLoading.create}
          >
            {operationLoading.create ? (
              <Orbit size="20" speed="1.5" color="white" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer 
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}