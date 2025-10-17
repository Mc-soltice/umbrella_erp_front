// src/pages/candidatures/components/DetailCandidatureModal.tsx
import type { Candidature } from "../../../types/Types";
import { User, Mail, Phone, Calendar, Edit, CheckCircle } from 'lucide-react';

interface DetailCandidatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidature: Candidature | null;
  onEdit: (candidature: Candidature) => void;
}

export default function DetailCandidatureModal({ 
  isOpen, 
  onClose, 
  candidature, 
  onEdit 
}: DetailCandidatureModalProps) {

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

  if (!isOpen || !candidature) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box rounded-2xl max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900">Détails de la Candidature</h3>
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
                {candidature.last_name} {candidature.first_name}
              </div>
              <div className="text-sm text-gray-600">Candidat</div>
            </div>
          </div>
          
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{candidature.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Téléphone</div>
                <div className="font-medium">{candidature.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Localisation</div>
                <div className="font-medium">{candidature.location}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Date de création</div>
                <div className="font-medium">{formatDate(candidature.create_at)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-action mt-6 gap-3">
          <button
            onClick={() => onEdit(candidature)}
            className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl flex-1 gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </button>
          <button className="btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none rounded-xl flex-1 gap-2 shadow-soft-lg">
            <CheckCircle className="w-4 h-4" />
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}