// src/pages/Users/UserWrapper.tsx
import { UserProvider } from '../../contexts/UserContext';
import { SiteProvider } from '../../contexts/SiteContext';
import UserSettings from './User';

export default function UserWrapper() {
  return (
    <UserProvider>
      <SiteProvider>
        <UserSettings />
      </SiteProvider>
    </UserProvider>
  );
}