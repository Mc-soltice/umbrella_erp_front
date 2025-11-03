// src/pages/Sites/components/SiteTable.tsx
import type { Site } from "../../../types/Types";
import { useSites } from '../../../contexts/SiteContext';
import { Eye, Edit, Trash2, Calendar, MapPin, User, Users, Building } from 'lucide-react';
import { useState } from 'react';

interface SiteTableProps {
  sites: Site[];
  onViewDetails: (site: Site) => void;
  onEdit: (site: Site) => void;
}

export default function SiteTable({ 
  sites, 
  onViewDetails, 
  onEdit 
}: SiteTableProps) {
  const { deleteSite } = useSites();
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // 🔹 Formater la date avec gestion d'erreur améliorée
  const formatDate = (dateInput: string | Date) => {
    try {
      const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      
      if (isNaN(date.getTime())) {
        console.warn('Date invalide:', dateInput);
        return "Date invalide";
      }
      
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error, dateInput);
      return "Date invalide";
    }
  };

  // 🔹 Gestion de la suppression avec confirmation
  const handleDelete = async (id: number, siteName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le site "${siteName}" ?`)) {
      try {
        await deleteSite(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // 🔹 Générer une couleur d'avatar basée sur le nom
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-orange-500 to-orange-600',
      'bg-gradient-to-r from-indigo-500 to-indigo-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // 🔹 Obtenir les initiales
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Tableau amélioré */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-50/40 border-b border-gray-200/60">
              <tr>
                <th className="py-5 px-6 text-left">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Site</span>
                </th>
                <th className="py-5 px-6 text-left">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Localisation</span>
                </th>
                <th className="py-5 px-6 text-left">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Responsable</span>
                </th>
                <th className="py-5 px-6 text-left">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Agents</span>
                </th>
                <th className="py-5 px-6 text-left">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Date de création</span>
                </th>
                <th className="py-5 px-6 text-right">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60">
              {sites.map((site, index) => (
                <tr 
                  key={site.id}
                  className={`transition-all duration-200 ${
                    hoveredRow === site.id.toString() 
                      ? 'bg-green-50/30 transform scale-[1.002]' 
                      : 'bg-white hover:bg-gray-50/80'
                  } ${index === 0 ? 'border-t-0' : ''}`}
                  onMouseEnter={() => setHoveredRow(site.id.toString())}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Colonne Site */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${getAvatarColor(site.name)} flex items-center justify-center text-white font-semibold shadow-sm`}>
                        {getInitials(site.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {site.name}
                          </h3>
                          {index < 2 && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-gray-500">
                          <Building className="w-3.5 h-3.5" />
                          <span className="text-sm">Site #{site.id}</span>
                        </div>
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
                        {site.location || "Non spécifiée"}
                      </span>
                    </div>
                  </td>

                  {/* Colonne Responsable */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {site.responsable ? (
                        <>
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {site.responsable.first_name} {site.responsable.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {site.responsable.email}
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Aucun responsable</span>
                      )}
                    </div>
                  </td>

                  {/* Colonne Agents */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {site.agents?.length || 0} agent(s)
                        </div>
                        <div className="text-sm text-gray-500">
                          Affectés
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Colonne Date de création */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-gray-700 font-medium text-sm">
                          {site.created_at ? formatDate(site.created_at) : "Non définie"}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Création
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Colonne Actions */}
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onViewDetails(site)}
                        className="group p-2.5 rounded-xl transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </button>
                      
                      <button
                        onClick={() => onEdit(site)}
                        className="group p-2.5 rounded-xl transition-all duration-200 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(site.id, site.name)}
                        className="group p-2.5 rounded-xl transition-all duration-200 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* État vide */}
        {sites.length === 0 && (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun site</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Les sites apparaîtront ici lorsqu'ils seront ajoutés au système.
            </p>
          </div>
        )}
      </div>

      {/* Pied de tableau avec informations */}
      {sites.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 rounded-lg border border-gray-200/60">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-semibold text-gray-700">{sites.length}</span> site(s)
          </div>
          <div className="text-xs text-gray-400">
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      )}
    </div>
  );
}