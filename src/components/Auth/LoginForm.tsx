// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { Building2, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Orbit } from 'ldrs/react';

export default function LoginForm() {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!matricule || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(matricule, password);
      if (!success) {
        // Si login() retourne false, afficher un toast d'erreur
        toast.error("Matricule ou mot de passe incorrect");
      }
      // Si success est true, la redirection se fait automatiquement via le contexte
    } catch (err) {
      // Si une exception est levée dans login()
      toast.error('Une erreur est survenue lors de la connexion');
      console.error("Erreur de connexion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoMatricule: string) => {
    setMatricule(demoMatricule);
    setPassword("password123");
    toast.success(`Compte démo ${demoMatricule} chargé`);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Partie gauche - Design moderne */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-800 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-bubble-500/10"></div>

        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-bubble-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col justify-center items-center px-16 w-full">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-bubble-500 rounded-3xl mb-6 shadow-2xl">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-3">Umbrella</h1>
            <h2 className="text-2xl font-semibold text-blue-300 mb-6">Industrial Services</h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-md">
              Gérez vos projets, coordonnez vos équipes et optimisez vos opérations industrielles avec notre plateforme tout-en-un.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Sécurisé</h3>
                <p className="text-slate-400 text-sm">Protection avancée de vos données</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Professionnel</h3>
                <p className="text-slate-400 text-sm">Outils adaptés à vos besoins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partie droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="max-w-md w-full">
          {/* Header mobile */}
          <div className="mb-8 lg:hidden text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-bubble-500 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Umbrella</h1>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Industrial Services</h2>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
            <p className="text-gray-600 mb-8">Accédez à votre espace de travail</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hidden fields to catch browser autofill and avoid it filling visible inputs */}
              <input type="text" name="__hidden_username" autoComplete="username" style={{ position: 'absolute', left: -9999, top: -9999, opacity: 0, height: 0 }} />
              <input type="password" name="__hidden_password" autoComplete="current-password" style={{ position: 'absolute', left: -9999, top: -9999, opacity: 0, height: 0 }} />
              <div>
                <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-2">
                  Matricule
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="matricule"
                    type="text"
                    name="matricule"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Votre matricule"
                    required
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isLoading ? (
                  <Orbit size="25" speed="1.5" color="white" />
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Comptes de démonstration :</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleDemoLogin("ADMIN001")}
                    disabled={isLoading}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors disabled:opacity-50 border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Administrateur:</span>
                      <span className="text-blue-600 font-mono">ADMIN001</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoLogin("COORD002")}
                    disabled={isLoading}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors disabled:opacity-50 border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Coordinateur:</span>
                      <span className="text-blue-600 font-mono">COORD002</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoLogin("BENE003")}
                    disabled={isLoading}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors disabled:opacity-50 border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Bénévole:</span>
                      <span className="text-blue-600 font-mono">BENE003</span>
                    </div>
                  </button>
                </div>
                <p className="text-gray-500 mt-3 text-sm">Mot de passe: password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}