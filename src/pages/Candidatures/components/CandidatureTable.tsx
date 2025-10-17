// src/pages/candidatures/components/CandidatureTable.tsx
import type { Candidature } from "../../../types/Types";
import { useCandidature } from '../../../contexts/CandidatureContext';
import { Eye, Edit, Trash2, Calendar, Phone, MapPin, Mail, User } from 'lucide-react';
import { useState } from 'react';

interface CandidatureTableProps {
  candidatures: Candidature[];
  onViewDetails: (candidature: Candidature) => void;
  onEdit: (candidature: Candidature) => void;
}

export default function CandidatureTable({ 
  candidatures, 
  onViewDetails, 
  onEdit 
}: CandidatureTableProps) {
  const { deleteCandidature, operationLoading } = useCandidature();
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // 🔹 Formater la date avec gestion d'erreur améliorée
  const formatDate = (dateInput: string | Date) => {
    try {
      // Si c'est une string, la convertir en Date
      const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        console.warn('Date invalide:', dateInput);
        return "Date invalide";
      }
      
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error, dateInput);
      return "Date invalide";
    }
  };



  // 🔹 Gestion de la suppression avec confirmation moderne
  const handleDelete = async (id: string, candidateName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la candidature de ${candidateName} ?`)) {
      try {
        await deleteCandidature(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // 🔹 Générer une couleur d'avatar basée sur le nom
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-orange-500 to-orange-600',
      'bg-gradient-to-r from-pink-500 to-pink-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // 🔹 Obtenir les initiales
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}


      {/* Tableau amélioré */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-50/40 border-b border-gray-200/60">
              <tr>
                <th className="py-5 px-6 text-left">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Candidat</span>
                </th>
                <th className="py-5 px-6 text-left">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contact</span>
                </th>
                <th className="py-5 px-6 text-left">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Localisation</span>
                </th>
                <th className="py-5 px-6 text-left">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Date</span>
                </th>
                <th className="py-5 px-6 text-right">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60">
              {candidatures.map((candidature, index) => (
                <tr 
                  key={candidature.id}
                  className={`transition-all duration-200 ${
                    hoveredRow === candidature.id 
                      ? 'bg-blue-50/30 transform scale-[1.002]' 
                      : 'bg-white hover:bg-gray-50/80'
                  } ${index === 0 ? 'border-t-0' : ''}`}
                  onMouseEnter={() => setHoveredRow(candidature.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Colonne Candidat */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${getAvatarColor(candidature.last_name)} flex items-center justify-center text-white font-semibold shadow-sm`}>
                        {getInitials(candidature.first_name, candidature.last_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {candidature.last_name} {candidature.first_name}
                          </h3>
                          {index < 3 && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-gray-500">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="text-sm truncate">{candidature.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Colonne Contact - CORRIGÉ */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="flex items-center gap-2 bg-gray-100/80 px-3 py-2 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm">
                          {(candidature.phone)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Colonne Localisation */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {candidature.location || "Non spécifiée"}
                      </span>
                    </div>
                  </td>

                  {/* Colonne Date - CORRIGÉ */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-gray-700 font-medium text-sm">
                          {formatDate(candidature.create_at)}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {(() => {
                            try {
                              const date = typeof candidature.create_at === "string" 
                                ? new Date(candidature.create_at) 
                                : candidature.create_at;
                              return isNaN(date.getTime()) 
                                ? "Jour invalide" 
                                : date.toLocaleDateString('fr-FR', { weekday: 'short' });
                            } catch (error) {
                              return "Jour invalide";
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Colonne Actions */}
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onViewDetails(candidature)}
                        className="group p-2.5 rounded-xl transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </button>
                      
                      <button
                        onClick={() => onEdit(candidature)}
                        className="group p-2.5 rounded-xl transition-all duration-200 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(candidature.id, `${candidature.first_name} ${candidature.last_name}`)}
                        className="group p-2.5 rounded-xl transition-all duration-200 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25"
                        title="Supprimer"
                        disabled={operationLoading.delete === candidature.id}
                      >
                        {operationLoading.delete === candidature.id ? (
                          <div className="loading loading-spinner loading-sm text-gray-400"></div>
                        ) : (
                          <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* État vide */}
        {candidatures.length === 0 && (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune candidature</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Les candidatures apparaîtront ici lorsqu'elles seront ajoutées au système.
            </p>
          </div>
        )}
      </div>

      {/* Pied de tableau avec informations */}
      {candidatures.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-semibold text-gray-700">{candidatures.length}</span> candidature(s)
          </div>
          <div className="text-xs text-gray-400">
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      )}
    </div>
  );
}