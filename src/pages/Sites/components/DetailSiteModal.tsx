// src/pages/Sites/components/DetailSiteModal.tsx
import type { Site } from "../../../types/Types";
import { Building, MapPin, User, Users, Calendar, Edit } from 'lucide-react';

interface DetailSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site | null;
  onEdit: (site: Site) => void;
}

export default function DetailSiteModal({ 
  isOpen, 
  onClose, 
  site, 
  onEdit 
}: DetailSiteModalProps) {

  // 🔹 Formater la date avec gestion d'erreur
  const formatDate = (dateInput: string | Date) => {
    try {
      const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      return isNaN(date.getTime()) 
        ? "Date invalide" 
        : date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
    } catch (error) {
      return "Date invalide";
    }
  };

  if (!isOpen || !site) return null;

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
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <Building className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-900 text-lg">
                {site.name}
              </div>
              <div className="text-sm text-gray-600">Site #{site.id}</div>
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
            
            {site.responsable && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-600">Responsable</div>
                  <div className="font-medium">
                    {site.responsable.first_name} {site.responsable.last_name}
                  </div>
                  <div className="text-sm text-gray-500">{site.responsable.email}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Agents affectés</div>
                <div className="font-medium">{site.agents?.length || 0} agent(s)</div>
              </div>
            </div>
            
            {site.created_at && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-600">Date de création</div>
                  <div className="font-medium">{formatDate(site.created_at)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-action mt-6 gap-3">
          <button
            onClick={() => onEdit(site)}
            className="btn bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 rounded-xl flex-1 gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </button>
          <button className="btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none rounded-xl flex-1 gap-2 shadow-soft-lg">
            <Users className="w-4 h-4" />
            Gérer les Agents
          </button>
        </div>
      </div>
    </div>
  );
}