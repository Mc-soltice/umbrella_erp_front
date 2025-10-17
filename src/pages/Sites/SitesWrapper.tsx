// src/pages/Sites/SiteWrapper.tsx
import { SiteProvider } from '../../contexts/SiteContext';
import SitesManagement from './SitesManagement';

export default function SitesWrapper() {
  return (
    <SiteProvider>
      <SitesManagement />
    </SiteProvider>
  );
}


