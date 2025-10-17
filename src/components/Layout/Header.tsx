import { useState } from 'react';
import { Bell, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import NotificationPanel from '../Notifications/NotificationPanel';
import UserSettingsModal from '@/pages/Users/UserSettingsModal';

export default function Header() {
  const { user, logout } = useAuth();
  const { notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.lue && n.utilisateurId === user?.id).length;

  return (
    <header className="bg-white shadow-soft border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg hover:scale-110 transition  duration-300 ease-in-out"
            data-tutorial="notifications-bell"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>

            <div className="flex items-center space-x-2">
              <div>
                <button className="p-2 text-gray-600 hover:scale-110 transition  duration-300 ease-in-out hover:text-gray-900 hover:bg-gray-100 rounded-lg "
                  onClick={() => setIsOpen(true)}>
                  <User className="w-5 h-5" />
                </button>
                {/* Modal des paramètres */}
                <UserSettingsModal
                 isOpen={isOpen} onClose={() => setIsOpen(false)}/>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:scale-110 transition  duration-300 ease-in-out hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
}