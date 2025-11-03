// src/pages/Sites/SiteManagement.tsx
import { useState, useEffect } from 'react';
import type { Site } from "../../types/Types";
import { useSites } from '../../contexts/SiteContext';
import { Orbit } from 'ldrs/react';
import 'ldrs/react/Orbit.css';
import { 
  PlusCircle, 
  Search,
  Building,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import AddSiteModal from './components/AddSiteModal';
import EditSiteModal from './components/EditSiteModal';
import DetailSiteModal from './components/DetailSiteModal';
import SiteTable from './components/SiteTable';

export default function SiteManagement() {
  const { 
    sites, 
    loading, 
    hasLoaded,
    error,
    fetchSites,
    clearError
  } = useSites();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // 🔹 Charger les données au montage - CORRIGÉ
useEffect(() => {
  // n'essaye de charger qu'une seule fois si pas déjà chargé
  if (!hasLoaded && !loading) {
    fetchSites().catch(err => {
      // on loggue localement — l'erreur est stockée dans le contexte (error)
      console.error("Erreur lors du fetchSites (useEffect) :", err);
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [hasLoaded, loading]); 


  // 🔹 S'assurer que sites est toujours un tableau
  const safeSites = Array.isArray(sites) ? sites : [];

  // 🔹 Filtrer les sites
  const filteredSites = safeSites.filter(site => {
    const searchLower = searchTerm.toLowerCase();
    return (
      site.name?.toLowerCase().includes(searchLower) ||
      site.location?.toLowerCase().includes(searchLower) ||
      site.responsable?.first_name?.toLowerCase().includes(searchLower) ||
      site.responsable?.last_name?.toLowerCase().includes(searchLower)
    );
  });

  // 🔹 Réessayer le chargement
  const handleRetry = async () => {
    clearError();
    await fetchSites();
  };

  console.log('🔹 État du contexte:', {
    hasLoaded,
    loading,
    error,
    sitesCount: safeSites.length,
    filteredCount: filteredSites.length
  });

  // 🔹 Ouvrir le modal de modification
  const handleOpenEditModal = (site: Site) => {
    setSelectedSite(site);
    setShowEditModal(true);
    setShowDetailModal(false);
  };

  // 🔹 Ouvrir le modal de détail
  const handleViewDetails = (site: Site) => {
    setSelectedSite(site);
    setShowDetailModal(true);
  };

  // 🔹 Gérer la fermeture des modaux
  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedSite(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-2xl">
            <Building className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Sites</h1>
            <p className="text-gray-600 mt-1">
              {loading ? 'Chargement...' : 
               error ? 'Erreur de chargement' : 
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
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full lg:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading || !!error}
            />
          </div>
          <button
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 border-none shadow-soft-lg px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowAddModal(true)}
            disabled={loading}
          >
            <PlusCircle className="w-5 h-5" />
            Nouveau Site
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Orbit size="60" speed="1.5" color="blue" />
            <p className="mt-4 text-gray-600 text-lg">Chargement des sites...</p>
          </div>
        </div>
      ) : error ? (
        // 🔹 AFFICHAGE DE L'ERREUR - CORRIGÉ
        <div className="flex justify-center items-center py-20">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              Réessayer
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
          {/* Tableau */}
          {filteredSites.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg">
                {searchTerm ? 'Aucun site correspondant' : 'Aucun site disponible'}
              </p>
              {searchTerm ? (
                <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
              ) : (
                <p className="text-sm mt-1">Commencez par créer votre premier site</p>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:from-blue-500 hover:to-blue-700 transition-all duration-200"
              >
                <PlusCircle className="w-5 h-5" />
                Créer un site
              </button>
            </div>
          ) : (
            <SiteTable
              sites={filteredSites}
              onViewDetails={handleViewDetails}
              onEdit={handleOpenEditModal}
            />
          )}
        </div>
      )}

      {/* Modaux */}
      <AddSiteModal
        isOpen={showAddModal}
        onClose={handleCloseModals}
      />

      <DetailSiteModal
        isOpen={showDetailModal}
        onClose={handleCloseModals}
        site={selectedSite}
        onEdit={handleOpenEditModal}
      />

      <EditSiteModal
        isOpen={showEditModal}
        onClose={handleCloseModals}
        site={selectedSite}
      />
    </div>
  );
}