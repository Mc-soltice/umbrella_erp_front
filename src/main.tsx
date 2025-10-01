import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { UserProvider } from "./contexts/UserContext";
import { SiteProvider } from "./contexts/SiteContext";
import { AgentProvider } from "./contexts/AgentContext";
import { PlanningProvider } from './contexts/PlanningContext';
import { CandidatureProvider } from './contexts/CandidatureContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <UserProvider>
          <SiteProvider>
            <AgentProvider>
              <PlanningProvider>
                <CandidatureProvider>
                  <App />
                </CandidatureProvider>
              </PlanningProvider>
            </AgentProvider>
          </SiteProvider>
        </UserProvider>
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
