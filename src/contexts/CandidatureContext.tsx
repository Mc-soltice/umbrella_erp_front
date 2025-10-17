// src/contexts/CandidatureContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { CandidatureService } from '../services/CandidatureService';
import type { Candidature, CreateCandidatureData, UpdateCandidatureData } from '../types/Types';

interface CandidatureState {
    candidatures: Candidature[];
    loading: boolean;
    error: string | null;
    operationLoading: {
        create: boolean;
        update: string | null;
        delete: string | null;
    };
}

interface CandidatureContextType extends CandidatureState {
    // CREATE
    addCandidature: (data: CreateCandidatureData) => Promise<void>;
    // READ
    fetchCandidatures: () => Promise<void>;
    getCandidatureById: (id: string) => Candidature | undefined;
    // UPDATE
    updateCandidature: (id: string, data: UpdateCandidatureData) => Promise<void>;
    // DELETE
    deleteCandidature: (id: string) => Promise<void>;
    // UTILS
    clearError: () => void;
    clearCandidatures: () => void;
    hasLoaded: boolean;
}

const CandidatureContext = createContext<CandidatureContextType | undefined>(undefined);

// 🔹 Fonction de transformation des données
const transformCandidatureData = (data: any): Candidature => {
  console.log('🔹 Transformation des données:', data);
  
  // Gestion de la date - plusieurs formats possibles
  let createDate: Date;
  
  if (data.create_at) {
    createDate = new Date(data.create_at);
  } else if (data.createAt) {
    createDate = new Date(data.createAt);
  } else if (data.created_at) {
    createDate = new Date(data.created_at);
  } else if (data.createdAt) {
    createDate = new Date(data.createdAt);
  } else if (data.date_creation) {
    createDate = new Date(data.date_creation);
  } else {
    console.warn('❌ Aucune date trouvée, utilisation de la date actuelle');
    createDate = new Date();
  }

  // Vérifier si la date est valide
  if (isNaN(createDate.getTime())) {
    console.warn('❌ Date invalide détectée:', data.create_at || data.created_at || data.createAt || data.createdAt);
    createDate = new Date(); // Date actuelle comme fallback
  }

  // Gestion du téléphone - s'assurer que c'est une string

  const transformed: Candidature = {
    id: data.id || '',
    last_name: data.last_name || data.lastName || '',
    first_name: data.first_name || data.firstName || '',
    phone: data.phone,
    email: data.email || '',
    location: data.location || '',
    create_at: createDate,
  };

  console.log('✅ Données transformées:', transformed);
  return transformed;
};

// 🔹 Fonction pour transformer un tableau de candidatures
const transformCandidaturesArray = (data: any[]): Candidature[] => {
  if (!Array.isArray(data)) {
    console.error('❌ Les données ne sont pas un tableau:', data);
    return [];
  }

  return data.map(item => transformCandidatureData(item));
};

export const CandidatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<CandidatureState>({
        candidatures: [],
        loading: false,
        error: null,
        operationLoading: {
            create: false,
            update: null,
            delete: null
        }
    });
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    // CREATE
    const addCandidature = async (data: CreateCandidatureData): Promise<void> => {
        setState(prev => ({
            ...prev,
            operationLoading: { ...prev.operationLoading, create: true },
            error: null
        }));

        try {
            const newCandidature = await CandidatureService.createCandidature(data);
            
            // 🔹 Transformer les données reçues
            const transformedCandidature = transformCandidatureData(newCandidature);
            
            setState(prev => ({
                ...prev,
                candidatures: [transformedCandidature, ...prev.candidatures],
                operationLoading: { ...prev.operationLoading, create: false }
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                operationLoading: { ...prev.operationLoading, create: false },
                error: error instanceof Error ? error.message : 'Erreur lors de la création'
            }));
            throw error;
        }
    };

    // READ - VERSION CORRIGÉE AVEC TRANSFORMATION
    const fetchCandidatures = async (): Promise<void> => {
        if (state.loading) {
            console.log('🔹 fetchCandidatures: déjà en cours de chargement, annulation');
            return;
        }

        console.log('🔹 fetchCandidatures: début du chargement');
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const candidaturesData = await CandidatureService.getAllCandidatures();
            console.log('🔹 fetchCandidatures: données brutes reçues de l\'API:', candidaturesData);
            console.log('🔹 fetchCandidatures: type des données:', typeof candidaturesData);
            console.log('🔹 fetchCandidatures: est un tableau?:', Array.isArray(candidaturesData));
            
            // 🔹 TRANSFORMATION CRITIQUE DES DONNÉES
            const transformedCandidatures = transformCandidaturesArray(candidaturesData);
            console.log('✅ fetchCandidatures: données transformées:', transformedCandidatures);
            
            // 🔹 Vérification des données transformées
            transformedCandidatures.forEach((candidature, index) => {
                console.log(`📋 Candidature ${index + 1}:`, {
                    id: candidature.id,
                    nom: `${candidature.first_name} ${candidature.last_name}`,
                    telephone: candidature.phone,
                    date: candidature.create_at,
                    dateValide: !isNaN(candidature.create_at.getTime())
                });
            });
            
            setState(prev => ({
                ...prev,
                candidatures: transformedCandidatures,
                loading: false
            }));
            setHasLoaded(true);
            console.log('✅ fetchCandidatures: chargement terminé avec succès');

        } catch (error) {
            console.error('❌ fetchCandidatures: erreur lors du chargement:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Erreur lors du chargement'
            }));
            setHasLoaded(true);
        }
    };

    const getCandidatureById = (id: string): Candidature | undefined => {
        return state.candidatures.find(candidature => candidature.id === id);
    };

    // UPDATE
    const updateCandidature = async (id: string, data: UpdateCandidatureData): Promise<void> => {
        setState(prev => ({
            ...prev,
            operationLoading: { ...prev.operationLoading, update: id },
            error: null
        }));

        try {
            const updatedCandidature = await CandidatureService.updateCandidature(id, data);
            
            // 🔹 Transformer les données reçues
            const transformedCandidature = transformCandidatureData(updatedCandidature);
            
            setState(prev => ({
                ...prev,
                candidatures: prev.candidatures.map(candidature =>
                    candidature.id === id ? transformedCandidature : candidature
                ),
                operationLoading: { ...prev.operationLoading, update: null }
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                operationLoading: { ...prev.operationLoading, update: null },
                error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
            }));
            throw error;
        }
    };

    // DELETE
    const deleteCandidature = async (id: string): Promise<void> => {
        setState(prev => ({
            ...prev,
            operationLoading: { ...prev.operationLoading, delete: id },
            error: null
        }));

        try {
            await CandidatureService.deleteCandidature(id);
            setState(prev => ({
                ...prev,
                candidatures: prev.candidatures.filter(candidature => candidature.id !== id),
                operationLoading: { ...prev.operationLoading, delete: null }
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                operationLoading: { ...prev.operationLoading, delete: null },
                error: error instanceof Error ? error.message : 'Erreur lors de la suppression'
            }));
            throw error;
        }
    };

    // Méthode pour effacer les erreurs
    const clearError = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    // Méthode pour vider les données
    const clearCandidatures = () => {
        setState({
            candidatures: [],
            loading: false,
            error: null,
            operationLoading: {
                create: false,
                update: null,
                delete: null
            }
        });
        setHasLoaded(false);
    };

    const value: CandidatureContextType = {
        ...state,
        hasLoaded,
        addCandidature,
        fetchCandidatures,
        getCandidatureById,
        updateCandidature,
        deleteCandidature,
        clearError,
        clearCandidatures,
    };

    return (
        <CandidatureContext.Provider value={value}>
            {children}
        </CandidatureContext.Provider>
    );
};

export const useCandidature = (): CandidatureContextType => {
    const context = useContext(CandidatureContext);
    if (!context) {
        throw new Error('useCandidature doit être utilisé dans un CandidatureProvider');
    }
    return context;
};