import {
  Building2,
  Calendar,
  FolderOpen,
  Home,
  Menu,
  MessageCircle,
  User2Icon,
  UserPlus,
  Users2Icon,
  Wallet2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  onLogout?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/' },
  { id: 'candidatures', label: 'Candidatures', icon: UserPlus, path: '/candidatures' },
  { id: 'chat', label: 'Chat interne', icon: MessageCircle, path: '/chat' },
  { id: 'responsables', label: 'Responsables', icon: User2Icon, path: '/responsables' },
  { id: 'agents', label: 'Agents', icon: Users2Icon, path: '/agents' },
  { id: 'plannings', label: 'Plannings', icon: Calendar, path: '/plannings' },
  { id: 'files', label: 'Gestion des fichiers', icon: FolderOpen, path: '/files' },
  { id: 'transactions', label: 'Etat des transactions', icon: Wallet2, path: '/transactions' },
  { id: 'sites', label: 'Gestions des sites', icon: Building2, path: '/sites' },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // 1024px = lg breakpoint
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true); // Toujours ouvert sur desktop
      } else {
        setIsOpen(false); // Fermé par défaut sur mobile
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const filteredItems = menuItems;

  // Contenu de la sidebar
  const sidebarContent = (
    <div className="bg-white shadow-soft-lg h-full flex flex-col w-64" data-tutorial="sidebar">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-bubble-500 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Umbrella</h1>
            <p className="text-xs text-gray-500">Industrial Services</p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  data-tutorial={`${item.id}-menu`}
                  className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-300 ease-in-out rounded-lg
                    ${isActive
                      ? 'bg-gray-100 text-blue-700 shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer avec utilisateur */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-xl">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-sm">
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.roles}</p>
          </div>


        </div>
        <div className="pt-2">
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
            data-tutorial="logout-button"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Bouton menu hamburger pour mobile */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Overlay pour mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar/Drawer */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:flex
      `}>
        {sidebarContent}
      </div>
    </>
  );
}