// src/pages/Sites/SitesManagement.tsx
import { useState, useEffect } from 'react';
import { useSites } from '../../contexts/SiteContext';
import { useUsers } from '../../contexts/UserContext';
import { Orbit } from 'ldrs/react';
import {
  Building2,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  User
} from 'lucide-react';
import CreateSiteModal from './components/CreateSiteModal';
import EditSiteModal from './components/EditSiteModal';
import SiteDetailsModal from './components/SiteDetailsModal';
import type { Site } from '../../types/Types';

export default function SitesManagement() {
  const {
    sites,
    loading,
    hasLoaded,
    fetchSites,
    deleteSite
  } = useSites();

  const { users, } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);



  // 🔹 Charger les données - Version simplifiée
  useEffect(() => {
    console.log('🔄 useEffect triggered - hasLoaded:', hasLoaded, 'loading:', loading);
    if (!hasLoaded && !loading) {
      console.log('🎯 Appel de fetchSites...');
      fetchSites();
    }
  }, [fetchSites, hasLoaded, loading]); // Gardez ces dépendances

  // 🔹 Filtrer les sites
  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (site.responsable?.first_name + ' ' + site.responsable?.last_name)
      .toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Gestion de la suppression
  const handleDeleteSite = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
      try {
        await deleteSite(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du site');
      }
    }
  };

  // 🔹 Ouvrir les modals
  const handleViewDetails = (site: Site) => {
    setSelectedSite(site);
    setShowDetailsModal(true);
  };

  const handleOpenEdit = (site: Site) => {
    setSelectedSite(site);
    setShowEditModal(true);
    setShowDetailsModal(false);
  };

  // 🔹 États d'affichage - AMÉLIORÉS
  const showLoading = loading && sites.length === 0;
  const showEmptyState = !loading && hasLoaded && sites.length === 0;
  const showContent = !loading && sites.length > 0;
  const showSearchEmptyState = !loading && searchTerm && filteredSites.length === 0;

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Sites</h1>
            <p className="text-gray-600 mt-1">
              {showLoading ? 'Chargement...' :
                showEmptyState ? 'Aucun site' :
                  showSearchEmptyState ? 'Aucun résultat' :
                    `${filteredSites.length} site(s)`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un site..."
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-soft-lg px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusCircle className="w-5 h-5" />
            Nouveau Site
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      {showLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Orbit size="60" speed="1.5" color="#3b82f6" />
            <p className="mt-4 text-gray-600 text-lg">Chargement des sites...</p>
          </div>
        </div>
      ) : showEmptyState ? (
        <div className="bg-white rounded-2xl shadow-soft-lg p-12 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun site</h3>
          <p className="text-gray-500 mb-6">
            Commencez par créer votre premier site
          </p>
          <button
            className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-soft-lg px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusCircle className="w-5 h-5" />
            Créer un site
          </button>
        </div>
      ) : showSearchEmptyState ? (
        <div className="bg-white rounded-2xl shadow-soft-lg p-12 text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun résultat</h3>
          <p className="text-gray-500 mb-6">
            Aucun site ne correspond à votre recherche "{searchTerm}"
          </p>
          <button
            className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold"
            onClick={() => setSearchTerm('')}
          >
            Réinitialiser la recherche
          </button>
        </div>
      ) : showContent ? (
        <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="bg-transparent font-semibold text-gray-700 py-4">Site</th>
                  <th className="bg-transparent font-semibold text-gray-700 py-4">Localisation</th>
                  <th className="bg-transparent font-semibold text-gray-700 py-4">Responsable</th>
                  <th className="bg-transparent font-semibold text-gray-700 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="font-semibold text-gray-900">{site.name}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {site.location}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        {site.responsable ?
                          `${site.responsable.first_name} ${site.responsable.last_name}` :
                          'Non assigné'
                        }
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(site)}
                          className="btn btn-ghost btn-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(site)}
                          className="btn btn-ghost btn-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSite(site.id)}
                          className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft-lg p-12 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">État inattendu</h3>
          <p className="text-gray-500 mb-6">
            Veuillez rafraîchir la page
          </p>
          <button
            className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-soft-lg px-6 py-3 rounded-xl font-semibold"
            onClick={() => window.location.reload()}
          >
            Rafraîchir
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateSiteModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        users={users}
      />

      {selectedSite && (
        <>
          <SiteDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            site={selectedSite}
            onEdit={() => handleOpenEdit(selectedSite)}
          />

          <EditSiteModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            site={selectedSite}
            users={users}
          />
        </>
      )}
    </div>
  );
}