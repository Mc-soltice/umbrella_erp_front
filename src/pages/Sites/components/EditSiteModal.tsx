// src/pages/Sites/components/EditSiteModal.tsx
import { useState, useEffect } from 'react';
import { useSites } from '../../../contexts/SiteContext';
import { Orbit } from 'ldrs/react';
import { CheckCircle } from 'lucide-react';
import type { Site, User } from '../../../types/Types';

interface EditSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site;
  users: User[];
}

export default function EditSiteModal({ isOpen, onClose, site, users }: EditSiteModalProps) {
  const { updateSite, loading } = useSites();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    responsable_id: ''
  });

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name || '',
        location: site.location || '',
        responsable_id: site.responsable_id?.toString() || ''
      });
    }
  }, [site]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSite(site.id, {
        ...formData,
        responsable_id: parseInt(formData.responsable_id)
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box border-2 border-orange-100 border-dashed rounded-2xl max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900">Modifier le Site</h3>
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
              className="btn w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none rounded-xl py-3 font-semibold shadow-soft-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Orbit size="20" speed="1.5" color="white" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Mettre à jour
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
