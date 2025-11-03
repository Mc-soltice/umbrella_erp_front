// src/components/agents/AgentManagement.tsx
import { Orbit } from 'ldrs/react';
import 'ldrs/react/Orbit.css';
import {
    MapPin, Search,
    Table,
    User,
    User2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAgents } from '../../contexts/AgentContext';
import type { Agent } from "../../types/Types";
import AgentsBySite from './Modals/AgentsBySite';
import AgentTable from './Modals/AgentTable';
import DetailAgentModal from './Modals/DetailAgentModal';
import EditAgentModal from './Modals/EditAgentModal';

export default function AgentManagement() {
    const {
        agents,
        loading,
        hasLoaded,
        fetchAgents,
    } = useAgents();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'sites'>('sites');

    // 🔹 Charger les données au montage du composant
    useEffect(() => {
        console.log('🔹 useEffect - hasLoaded:', hasLoaded, 'loading:', loading);

        if (!hasLoaded && !loading) {
            console.log('🔹 Début du chargement des agents...');
            fetchAgents().catch(err => {
                console.error('❌ Erreur lors du chargement:', err);
            });
        }
    }, [fetchAgents, hasLoaded, loading]);

    // 🔹 S'assurer que agents est toujours un tableau
    const safeAgents = Array.isArray(agents) ? agents : [];

    // 🔹 Filtrer les agents
    const filteredAgents = safeAgents.filter(agent => {
        const searchLower = searchTerm.toLowerCase();
        return (
            agent.last_name?.toLowerCase().includes(searchLower) ||
            agent.first_name?.toLowerCase().includes(searchLower) ||
            agent.email?.toLowerCase().includes(searchLower) ||
            agent.matricule?.toLowerCase().includes(searchLower)
        );
    });

    // 🔹 Afficher l'état pour le débogage
    console.log('🔹 État du contexte:', {
        hasLoaded,
        loading,
        agentsCount: safeAgents.length,
        filteredCount: filteredAgents.length,
        agents: safeAgents // Afficher les données réelles
    });

    // 🔹 Ouvrir le modal de modification
    const handleOpenEditModal = (agent: Agent) => {
        setSelectedAgent(agent);
        setShowEditModal(true);
        setShowDetailModal(false);
    };

    // 🔹 Ouvrir le modal de détail
    const handleViewDetails = (agent: Agent) => {
        setSelectedAgent(agent);
        setShowDetailModal(true);
    };

    // 🔹 Gérer la fermeture des modaux
    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDetailModal(false);
        setSelectedAgent(null);
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
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des Agents</h1>
                        <p className="text-gray-600 mt-1">
                            {loading ? 'Chargement...' : `${filteredAgents.length} agent(s)`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Sélecteur de vue */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('sites')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${viewMode === 'sites'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Par Site
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${viewMode === 'table'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Table className="w-4 h-4 inline mr-2" />
                            Tableau
                        </button>
                    </div>

                    {/* Recherche et bouton d'ajout */}
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un agent..."
                            className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            {loading && !hasLoaded ? (
                <div className="flex justify-center items-center py-20">
                    <div className="text-center">
                        <Orbit size="60" speed="1.5" color="#3b82f6" />
                        <p className="mt-4 text-gray-600 text-lg">Chargement des agents...</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
                    {filteredAgents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-lg">
                                {searchTerm ? 'Aucun agent correspondant' : 'Aucun agent'}
                            </p>
                        </div>
                    ) : viewMode === 'sites' ? (
                        <AgentsBySite
                            agents={filteredAgents}
                            onViewDetails={handleViewDetails}
                            onEdit={handleOpenEditModal}
                        />
                    ) : (
                        <AgentTable
                            agents={filteredAgents}
                            onViewDetails={handleViewDetails}
                            onEdit={handleOpenEditModal}
                        />
                    )}
                </div>
            )}

            {/* Modaux */}

            <DetailAgentModal
                isOpen={showDetailModal}
                onClose={handleCloseModals}
                agent={selectedAgent}
                onEdit={handleOpenEditModal}
            />

            <EditAgentModal
                isOpen={showEditModal}
                onClose={handleCloseModals}
                agent={selectedAgent}
            />
        </div>
    );
}