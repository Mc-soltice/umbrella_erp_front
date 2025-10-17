// src/pages/Sites/components/SiteDetailsModal.tsx
import { Edit, MapPin, User, Calendar } from 'lucide-react';
import type { Site } from '../../../types/Types';

interface SiteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site;
  onEdit: () => void;
}

export default function SiteDetailsModal({ isOpen, onClose, site, onEdit }: SiteDetailsModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box rounded-2xl max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900">Détails du Site</h3>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
            <MapPin className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-900 text-lg">{site.name}</div>
              <div className="text-sm text-gray-600">Site</div>
            </div>
          </div>
          
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Localisation</div>
                <div className="font-medium">{site.location}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Responsable</div>
                <div className="font-medium">
                  {site.responsable ? 
                    `${site.responsable.first_name} ${site.responsable.last_name}` : 
                    'Non assigné'
                  }
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Date de création</div>
                <div className="font-medium">{formatDate(site.created_at)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-action mt-6">
          <button
            onClick={onEdit}
            className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl flex-1 gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}
