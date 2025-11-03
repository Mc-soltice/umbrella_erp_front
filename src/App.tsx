// src/App.tsx
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import des wrappers - CORRECTION DU CHEMIN
import AgentsWrapper from './pages/Agents/AgentsWrapper';
import CandidatureWrapper from './pages/Candidatures/CandidatureWrapper';
import PlanningWrapper from './pages/Plannings/PlanningWrapper'; // ✅ Correction
import SitesWrapper from './pages/Sites/SitesWrapper';
import UserWrapper from './pages/Users/UserWrapper';

function AppContent() {
  const { logout } = useAuth(); // ✅ Retirer user si non utilisé

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 flex-shrink-0">
        <Sidebar onLogout={logout} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/candidatures" replace />} />
            <Route path="/candidatures" element={<CandidatureWrapper />} />
            <Route path="/agents" element={<AgentsWrapper />} />
            <Route path="/plannings" element={<PlanningWrapper />} />
            <Route path="/settings" element={<UserWrapper />} />
            <Route path="/sites" element={<SitesWrapper />} />
            <Route path="/chat" element={<div className="p-8 text-center">Chat interne (non implémenté)</div>} />
            <Route path="/responsables" element={<div className="p-8 text-center">Responsables (non implémenté)</div>} />
            <Route path="/files" element={<div className="p-8 text-center">Gestion des fichiers (non implémenté)</div>} />
            <Route path="/transactions" element={<div className="p-8 text-center">État des transactions (non implémenté)</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <AppProvider>

        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AppProvider>
    </Router>
  );
}

export default App;