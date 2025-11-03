// src/pages/Sites/SitesWrapper.tsx
import { SiteProvider } from '../../contexts/SiteContext';
import { UserProvider } from '../../contexts/UserContext'; // 🔹 IMPORT AJOUTÉ
import SiteManagement from './SitesManagement';

export default function SitesWrapper() {
  return (
    <UserProvider> {/* 🔹 AJOUT DU USER PROVIDER */}
      <SiteProvider>
        <SiteManagement />
      </SiteProvider>
    </UserProvider>
  );
}