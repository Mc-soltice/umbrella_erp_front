// src/pages/Sites/components/AddSiteModal.tsx
import { useState, useEffect } from 'react';
import { useSites } from '../../../contexts/SiteContext';
import { useUsers } from '../../../contexts/UserContext';
import { Orbit } from 'ldrs/react';
import { Save, Users } from 'lucide-react';
import type { CreateSiteData } from '../../../types/Types';
import { toast } from 'react-hot-toast';

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSiteModal({ isOpen, onClose }: AddSiteModalProps) {
  const { createSite, operationLoading } = useSites();
  const { users, loading: usersLoading, hasLoaded: usersHasLoaded } = useUsers();

  const [formData, setFormData] = useState<CreateSiteData>({
    name: "",
    location: "",
    responsable_id: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Filtrer les utilisateurs avec le rôle "responsable"
  const responsables = users?.filter(user =>
    user.roles?.some(role =>
      role.toLowerCase().includes('responsable')
    )
  ) || [];

  // 🔹 Reset du formulaire à la fermeture
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", location: "", responsable_id: undefined });
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // 🔹 Gestion de l'ajout - CORRIGÉ avec CreateSiteData
  const handleAddSite = async () => {
    if (isSubmitting) return;

    // Validation de base
    if (!formData.name.trim() || !formData.location.trim()) {
      console.error('Nom et localisation sont requis');
      toast.error('Le nom et la localisation sont requis');
      return;
    }

    setIsSubmitting(true);
    try {
      // 🔹 Préparer les données avec responsable_id si sélectionné
      const siteData: CreateSiteData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        responsable_id: formData.responsable_id || undefined
      };

      await createSite(siteData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      // L'erreur est déjà gérée dans le contexte
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Gérer la soumission avec la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleAddSite();
    }
  };

  if (!isOpen) return null;

  return (

    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box border-2 border-green-100 rounded-2xl max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900">Nouveau Site</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-gray-100"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4" onKeyPress={handleKeyPress}>
          <div>
            <label className="label text-sm font-medium text-gray-700">Nom du site</label>
            <input
              type="text"
              placeholder="Entrez le nom du site"
              className="input input-bordered w-full rounded-xl px-4 py-3"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="label text-sm font-medium text-gray-700">Localisation</label>
            <input
              type="text"
              placeholder="Entrez la localisation"
              className="input input-bordered w-full rounded-xl px-4 py-3"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="label text-sm font-medium text-gray-700">Responsable</label>
            {usersLoading && !usersHasLoaded ? (
              <div className="flex items-center justify-center py-4">
                <Orbit size="35" speed="1.5" color="hsl(220 84% 55%)" />
                <span className="ml-2 text-sm text-gray-600">Chargement...</span>
              </div>
            ) : (
              <select
                className="select select-bordered w-full rounded-xl px-4 py-3"
                value={formData.responsable_id || ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  responsable_id: e.target.value ? Number(e.target.value) : undefined
                }))}
                disabled={isSubmitting}
              >
                <option value="">Sélectionnez un responsable</option>
                {responsables.map((responsable) => (
                  <option key={responsable.id} value={responsable.id}>
                    {responsable.first_name} {responsable.last_name}
                  </option>
                ))}
              </select>
            )}
            {!usersLoading && responsables.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-amber-600 mt-2">
                <Users className="w-4 h-4" />
                <span>Aucun responsable trouvé</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-action mt-6">
          <button
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 border-none rounded-xl py-3 font-semibold shadow-soft-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddSite}
            disabled={isSubmitting || operationLoading.create || !formData.name.trim() || !formData.location.trim()}
          >
            {isSubmitting || operationLoading.create ? (
              <>
                <Orbit size="20" speed="1.5" color="white" />
                Création en cours...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Créer le Site
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}