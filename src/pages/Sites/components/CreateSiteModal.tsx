// src/pages/Sites/components/CreateSiteModal.tsx
import { useState } from 'react';
import { useSites } from '../../../contexts/SiteContext';
import { Orbit } from 'ldrs/react';
import { PlusCircle } from 'lucide-react';
import type { User } from '../../../types/Types';

interface CreateSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

export default function CreateSiteModal({ isOpen, onClose, users }: CreateSiteModalProps) {
  const { createSite, loading } = useSites();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    responsable_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSite({
        ...formData,
        responsable_id: parseInt(formData.responsable_id)
      });
      setFormData({ name: '', location: '', responsable_id: '' });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box border-2 border-blue-100 border-dashed rounded-2xl max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900">Nouveau Site</h3>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-sm font-medium text-gray-700">Nom du site</label>
            <input
              type="text"
              required
              placeholder="Entrez le nom du site"
              className="input input-bordered w-full rounded-xl px-4 py-3"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="label text-sm font-medium text-gray-700">Localisation</label>
            <input
              type="text"
              required
              placeholder="Entrez la localisation"
              className="input input-bordered w-full rounded-xl px-4 py-3"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="label text-sm font-medium text-gray-700">Responsable</label>
            <select
              required
              className="select select-bordered w-full rounded-xl px-4 py-3"
              value={formData.responsable_id}
              onChange={(e) => setFormData(prev => ({ ...prev, responsable_id: e.target.value }))}
            >
              <option value="">Sélectionnez un responsable</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="modal-action mt-6">
            <button
              type="submit"
              className="btn w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none rounded-xl py-3 font-semibold shadow-soft-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Orbit size="20" speed="1.5" color="white" />
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Créer le Site
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
