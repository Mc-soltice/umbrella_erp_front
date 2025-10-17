// src/components/Settings/ProfileTab.tsx
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Upload, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../contexts/UserContext';
import { Orbit } from 'ldrs/react';

interface ProfileTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function ProfileTab({ isLoading, setIsLoading }: ProfileTabProps) {
  const { user: currentUser } = useAuth();
  const { updateUser } = useUsers();

  const [isEditing, setIsEditing] = useState(false);
  const [originalUserData, setOriginalUserData] = useState<any>(null);
  const [user, setUser] = useState(currentUser);

  const handleEditToggle = () => {
    if (!isEditing) {
      setOriginalUserData(JSON.parse(JSON.stringify(user)));
    }
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);


      console.log('🔄 Données avant envoi:', {
    id: user?.id,
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    phone: user?.phone,
    location: user?.location,
    roles: user?.roles
  });

    try {
      if (user?.id) {
        // Vérifier que les données ont changé
        const hasChanges =
          user.first_name !== originalUserData?.first_name ||
          user.last_name !== originalUserData?.last_name ||
          user.email !== originalUserData?.email ||
          user.phone !== originalUserData?.phone ||
          user.location !== originalUserData?.location;

        if (!hasChanges) {
          setIsEditing(false);
          setIsLoading(false);
          return;
        }

        await updateUser(user.id, {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          // Ne pas envoyer le rôle car il ne devrait pas être modifiable par l'utilisateur
        });
      }

      setIsEditing(false);
    } catch (error) {
      // En cas d'erreur, on reste en mode édition
      // L'erreur est déjà affichée par le UserService
      console.error('Erreur dans handleProfileUpdate:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleCancel = () => {
    setUser(originalUserData);
    setIsEditing(false);
  };

  return (
    <div>
      {/* En-tête avec bouton d'édition - CACHÉ en mode édition */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Informations personnelles</h1>

        {/* Bouton "Modifier le profil" - visible UNIQUEMENT en mode lecture */}
        {!isEditing && (
          <button
            onClick={handleEditToggle}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-blue-300 to-blue-600 text-white hover:from-primary-600 hover:to-bubble-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier le profil</span>
          </button>
        )}
      </div>

      {/* Photo de profil */}
      <div className="flex items-center space-x-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-bubble-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {user?.first_name?.charAt(0) || 'U'}
          </div>
          {isEditing && (
            <button className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:scale-110">
              <Upload className="w-3 h-3 text-gray-600" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">Photo de profil</h3>
          <p className="text-gray-600 text-sm">PNG, JPG jusqu'à 5MB</p>
          {isEditing && (
            <p className="text-blue-600 text-xs mt-1">Cliquez sur l'icône pour changer la photo</p>
          )}
        </div>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prénom */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={user?.first_name || ''}
                onChange={(e) => setUser(prev => prev ? { ...prev, first_name: e.target.value } : prev)}
                readOnly={!isEditing}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 text-sm ${isEditing
                  ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                placeholder="Votre prénom"
              />
            </div>
          </div>

          {/* Nom */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              value={user?.last_name || ''}
              onChange={(e) => setUser(prev => prev ? { ...prev, last_name: e.target.value } : prev)}
              readOnly={!isEditing}
              className={`w-full px-3 py-3 border rounded-lg transition-all duration-200 text-sm ${isEditing
                ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm'
                : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              placeholder="Votre nom"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={user?.email || ''}
                onChange={(e) => setUser(prev => prev ? { ...prev, email: e.target.value } : prev)}
                readOnly={!isEditing}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 text-sm ${isEditing
                  ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                value={user?.phone || ''}
                onChange={(e) => setUser(prev => prev ? { ...prev, phone: e.target.value } : prev)}
                readOnly={!isEditing}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 text-sm ${isEditing
                  ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>

          {/* Rôle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rôle
            </label>
            <input
              type="text"
              value={user?.roles || ''}
              readOnly
              className="w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
            />
          </div>

          {/* Localisation */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Localisation
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={user?.location || ''}
                onChange={(e) => setUser(prev => prev ? { ...prev, location: e.target.value } : prev)}
                readOnly={!isEditing}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 text-sm ${isEditing
                  ? 'border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                placeholder="Votre localisation"
              />
            </div>
          </div>
        </div>

        {/* Boutons d'action - visibles UNIQUEMENT en mode édition */}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-300 to-blue-600 text-white px-6 py-3 rounded-lg font-medium  flex items-center space-x-2 shadow-lg"
            >
              {isLoading ? (
                <Orbit size="20" speed="1.5" color="blue" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {/* Indicateur visuel du mode */}
      <div className={`mt-6 p-3 rounded-lg border transition-all duration-300 ${isEditing
        ? 'bg-blue-50 border-blue-200'
        : 'bg-blue-50 border-blue-200'
        }`}>
        <p className={`text-sm text-center ${isEditing ? 'text-blue-700' : 'text-blue-700'
          }`}>
          {isEditing
            ? 'Mode édition activé - Vous pouvez modifier vos informations'
            : 'Mode lecture - Cliquez sur "Modifier le profil" pour faire des changements'
          }
        </p>
      </div>
    </div>
  );
}