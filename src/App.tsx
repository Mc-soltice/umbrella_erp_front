import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './components/Auth/LoginForm';
import { useAuth } from './contexts/AuthContext';

// Import des wrappers avec leurs propres providers
import CandidatureWrapper from './pages/Candidatures/CandidatureWrapper';
import AgentsWrapper from './pages/Agents/AgentsWrapper';
import PlanningWrapper from './pages/Planninigs/PlanningWrapper';
import UserWrapper from './pages/Users/UserWrapper';
import SitesWrapper from './pages/Sites/SitesWrapper';


function AppContent() {
  const { logout } = useAuth();

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
            {/* Ajoute tes autres routes ici */}
            <Route path="/chat" element={<div>Chat interne (non implémenté)</div>} />
            <Route path="/responsables" element={<div>Responsables (non implémenté)</div>} />
            <Route path="/files" element={<div>Gestion des fichiers (non implémenté)</div>} />
            <Route path="/transactions" element={<div>État des transactions (non implémenté)</div>} />
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
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;