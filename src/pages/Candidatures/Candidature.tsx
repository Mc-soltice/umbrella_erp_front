// src/components/candidatures/CandidatureManagement.tsx
import { useState, useEffect } from 'react';
import type { Candidature } from "../../types/Types";
import { useCandidature } from '../../contexts/CandidatureContext';
import { Orbit } from 'ldrs/react';
import 'ldrs/react/Orbit.css';
import { 
  PlusCircle, 
  User2, 
  Search,
  User,
} from 'lucide-react';
import AddCandidatureModal from './components/AddCandidatureModal';
import EditCandidatureModal from './components/EditCandidatureModal';
import DetailCandidatureModal from './components/DetailCandidatureModal';
import CandidatureTable from './components/CandidatureTable';

export default function CandidatureManagement() {
  const { 
    candidatures, 
    loading, 
    hasLoaded,
    fetchCandidatures,
    operationLoading,
    error
  } = useCandidature();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // 🔹 Charger les données au montage du composant
  useEffect(() => {
    console.log('🔹 useEffect - hasLoaded:', hasLoaded, 'loading:', loading);
    
    if (!hasLoaded && !loading) {
      console.log('🔹 Début du chargement des candidatures...');
      fetchCandidatures().catch(err => {
        console.error('❌ Erreur lors du chargement:', err);
      });
    }
  }, [fetchCandidatures, hasLoaded, loading]);

  // 🔹 S'assurer que candidatures est toujours un tableau
  const safeCandidatures = Array.isArray(candidatures) ? candidatures : [];

  // 🔹 Filtrer les candidatures
  const filteredCandidatures = safeCandidatures.filter(candidature => {
    const searchLower = searchTerm.toLowerCase();
    return (
      candidature.last_name?.toLowerCase().includes(searchLower) ||
      candidature.first_name?.toLowerCase().includes(searchLower) ||
      candidature.email?.toLowerCase().includes(searchLower)
      // candidature.telephone?.toLowerCase().includes(searchLower)
    );
  });

  // 🔹 Afficher l'état pour le débogage
  console.log('🔹 État du contexte:', {
    hasLoaded,
    loading,
    error,
    candidaturesCount: safeCandidatures.length,
    filteredCount: filteredCandidatures.length,
    candidatures: safeCandidatures // Afficher les données réelles
  });

  // 🔹 Ouvrir le modal de modification
  const handleOpenEditModal = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setShowEditModal(true);
    setShowDetailModal(false);
  };

  // 🔹 Ouvrir le modal de détail
  const handleViewDetails = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setShowDetailModal(true);
  };

  // 🔹 Gérer la fermeture des modaux
  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedCandidature(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <User2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Candidatures</h1>
            <p className="text-gray-600 mt-1">
              {loading ? 'Chargement...' : `${filteredCandidatures.length} candidature(s)`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une candidature..."
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 border-none shadow-soft-lg px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200"
            onClick={() => setShowAddModal(true)}
            disabled={operationLoading.create}
          >
            <PlusCircle className="w-5 h-5" />
            Nouvelle Candidature
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      {loading && !hasLoaded ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Orbit size="60" speed="1.5" color="#3b82f6" />
            <p className="mt-4 text-gray-600 text-lg">Chargement des candidatures...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
          {/* Tableau */}
          {filteredCandidatures.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg">
                {searchTerm ? 'Aucune candidature correspondante' : 'Aucune candidature'}
              </p>
              {searchTerm && (
                <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
              )}
              {safeCandidatures.length > 0 && searchTerm && (
                <p className="text-sm mt-2 text-blue-600">
                  Données disponibles mais filtrées: {safeCandidatures.length} candidature(s) en base
                </p>
              )}
            </div>
          ) : (
            <CandidatureTable
              candidatures={filteredCandidatures}
              onViewDetails={handleViewDetails}
              onEdit={handleOpenEditModal}
            />
          )}
        </div>
      )}

      {/* Modaux */}
      <AddCandidatureModal
        isOpen={showAddModal}
        onClose={handleCloseModals}
      />

      <DetailCandidatureModal
        isOpen={showDetailModal}
        onClose={handleCloseModals}
        candidature={selectedCandidature}
        onEdit={handleOpenEditModal}
      />

      <EditCandidatureModal
        isOpen={showEditModal}
        onClose={handleCloseModals}
        candidature={selectedCandidature}
      />
    </div>
  );
}