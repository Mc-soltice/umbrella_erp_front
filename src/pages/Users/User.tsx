// src/pages/Settings/UserSettings.tsx
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Save, 
  Upload, 
  Shield,
  Bell,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  matricule: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  avatar?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  securityAlerts: boolean;
  projectUpdates: boolean;
}

export default function UserSettings() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Données utilisateur simulées (à remplacer par vos appels API)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    matricule: currentUser?.matricule || 'USER001',
    name: currentUser?.first_name || 'Utilisateur',
    email: currentUser?.email || 'user@umbrella.fr',
    phone: '+33 1 23 45 67 89',
    department: 'Ressources Humaines',
    position: 'Coordinateur',
    location: 'Paris, France',
    avatar: '/api/placeholder/100/100'
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    securityAlerts: true,
    projectUpdates: false
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici, vous ferez votre appel API pour mettre à jour le profil
      // await userAPI.updateProfile(userProfile);
      
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici, vous ferez votre appel API pour changer le mot de passe
      // await userAPI.changePassword(passwordForm);
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Mot de passe modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Préférences', icon: Globe }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres du compte</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Navigation latérale */}
          <div className="lg:w-64 bg-gray-50 border-r border-gray-200 p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-primary-600 shadow-sm border border-gray-200'
                        : 'text-gray-700 hover:bg-white hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-8">
            {/* Onglet Profil */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
                
                {/* Photo de profil */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-bubble-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {userProfile.name.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Photo de profil</h3>
                    <p className="text-gray-600 text-sm">PNG, JPG jusqu'à 5MB</p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="Votre nom complet"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Matricule
                      </label>
                      <input
                        type="text"
                        value={userProfile.matricule}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Département
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={userProfile.department}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, department: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="Votre département"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Poste
                      </label>
                      <input
                        type="text"
                        value={userProfile.position}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, position: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Votre poste"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={userProfile.location}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Votre localisation"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{isLoading ? 'Mise à jour...' : 'Sauvegarder'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Onglet Sécurité */}
            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité du compte</h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors pr-12"
                        placeholder="Entrez votre mot de passe actuel"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors pr-12"
                        placeholder="Entrez votre nouveau mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors pr-12"
                        placeholder="Confirmez votre nouveau mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Changement...' : 'Changer le mot de passe'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Onglet Notifications */}
            {activeTab === 'notifications' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Préférences de notifications</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications par email</h3>
                      <p className="text-sm text-gray-600">Recevez les mises à jour importantes par email</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('emailNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.emailNotifications ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications push</h3>
                      <p className="text-sm text-gray-600">Recevez des notifications en temps réel</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('pushNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.pushNotifications ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Alertes de sécurité</h3>
                      <p className="text-sm text-gray-600">Soyez informé des activités suspectes</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('securityAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.securityAlerts ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Mises à jour de projet</h3>
                      <p className="text-sm text-gray-600">Notifications sur l'avancement des projets</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('projectUpdates')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.projectUpdates ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.projectUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Préférences */}
            {activeTab === 'preferences' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Préférences générales</h2>
                <p className="text-gray-600 mb-8">Cette section est en cours de développement.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    D'autres options de préférences seront disponibles prochainement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}