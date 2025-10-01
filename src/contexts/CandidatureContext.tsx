// context/CandidatureContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
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
}

const CandidatureContext = createContext<CandidatureContextType | undefined>(undefined);

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

    // Effet pour charger les candidatures au montage
    useEffect(() => {
        fetchCandidatures();
    }, []);

    // CREATE

    const addCandidature = async (data: CreateCandidatureData): Promise<void> => {
        setState(prev => ({
            ...prev,
            operationLoading: { ...prev.operationLoading, create: true },
            error: null
        }));

        const newCandidature = await CandidatureService.createCandidature(data);

        setState(prev => ({
            ...prev,
            candidatures: [newCandidature, ...prev.candidatures],
            operationLoading: { ...prev.operationLoading, create: false }
        }));
    };

    // READ
    const fetchCandidatures = async (): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const candidaturesData = await CandidatureService.getAllCandidatures();
        setState(prev => ({
            ...prev,
            candidatures: candidaturesData,
            loading: false
        }));

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

        const updatedCandidature = await CandidatureService.updateCandidature(id, data);
        setState(prev => ({
            ...prev,
            candidatures: prev.candidatures.map(candidature =>
                candidature.id === id ? updatedCandidature : candidature
            ),
            operationLoading: { ...prev.operationLoading, update: null }
        }));
    };

    // DELETE
    const deleteCandidature = async (id: string): Promise<void> => {
        setState(prev => ({
            ...prev,
            operationLoading: { ...prev.operationLoading, delete: id },
            error: null
        }));

        await CandidatureService.deleteCandidature(id);
        setState(prev => ({
            ...prev,
            candidatures: prev.candidatures.filter(candidature => candidature.id !== id),
            operationLoading: { ...prev.operationLoading, delete: null }
        }));

    };

    // Méthode pour effacer les erreurs
    const clearError = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    const value: CandidatureContextType = {
        ...state,
        addCandidature,
        fetchCandidatures,
        getCandidatureById,
        updateCandidature,
        deleteCandidature,
        clearError,
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