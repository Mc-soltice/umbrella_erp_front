import { useState } from 'react';
import './App.css';
import './index.css';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Candidature from './pages/Candidatures/Candidature';
import AgentManagement from './pages/Agents/Agents';

function App() {
  const [activeView, setActiveView] = useState('candidatures');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <div>Tableau de bord (non implémenté)</div>;
      case 'candidatures':
        return <Candidature />;
      case 'agents':
        return <AgentManagement />;
      case 'chat':
        return <div>Chat interne (non implémenté)</div>;
      case 'Plannings':
        return <div>Plannings (non implémenté)</div>;
      case 'files':
        return <div>Gestion des fichiers (non implémenté)</div>;
      default:
        return <Candidature />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 flex-shrink-0">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
