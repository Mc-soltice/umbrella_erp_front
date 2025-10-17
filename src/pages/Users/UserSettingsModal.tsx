// src/components/Settings/UserSettingsModal.tsx
import { useState } from 'react';
import { User, Shield, Globe, X } from 'lucide-react';
import ProfileTab from '../../components/Settings/ProfileTab';
import SecurityTab from '../../components/Settings/SecurityTab';
import PreferencesTab from '../../components/Settings/PreferencesTab';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Globe }
  ];

  if (!isOpen) return null;

  return (
    <dialog id="user_settings_modal" className="modal modal-bottom sm:modal-middle backdrop-blur" open={isOpen}>
      <div className="modal-box max-w-2xl lg:max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Paramètres du compte</h3>
            <p className="text-gray-600 text-sm mt-1">Gérez vos informations personnelles</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)]">
          {/* Navigation latérale */}
          <div className="lg:w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeTab === tab.id
                        ? 'bg-white text-primary-600 shadow-sm border border-gray-200'
                        : 'text-gray-700 hover:bg-white hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu principal avec défilement */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <ProfileTab isLoading={isLoading} setIsLoading={setIsLoading} />
            )}
            
            {activeTab === 'security' && (
              <SecurityTab isLoading={isLoading} setIsLoading={setIsLoading} />
            )}
            
            {activeTab === 'preferences' && (
              <PreferencesTab />
            )}
          </div>
        </div>
      </div>
      
      {/* Backdrop pour fermer le modal */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}