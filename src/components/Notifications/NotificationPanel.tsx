// import React from 'react';
import { X, Bell, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markNotificationAsRead } = useApp();
  const { user } = useAuth();

  const userNotifications = notifications.filter(n => n.utilisateurId === user?.id);
  const unreadNotifications = userNotifications.filter(n => !n.lue);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  // const markAllAsRead = () => {
  //   unreadNotifications.forEach(notification => {
  //     markNotificationAsRead(notification.id);
  //   });
  // };


  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Slide Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-soft-lg z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-bubble-500 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">
                  {unreadNotifications.length} non lue{unreadNotifications.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {unreadNotifications.length > 0 && (
            <button
              onClick={markNotificationAsRead.bind(null, 'all')}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Marquer tout comme lu
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {userNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Bell className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-500">
                Vous êtes à jour ! Aucune nouvelle notification.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {userNotifications
                .sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime())
                .map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.type);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                        notification.lue 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-white border-primary-200 shadow-soft hover:shadow-soft-lg'
                      }`}
                      onClick={() => !notification.lue && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium ${
                              notification.lue ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.titre}
                            </h4>
                            {!notification.lue && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className={`text-sm ${
                            notification.lue ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.dateCreation.toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {!notification.lue && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Marquer comme lu</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}