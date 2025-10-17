import {
  Home,
  FolderOpen,
  MessageCircle,
  UserPlus,
  Building2,
  Calendar,
  User2Icon,
  Users2Icon,
  Wallet2,
} from 'lucide-react';
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

  const filteredItems = menuItems; // Tu peux ajouter des filtres plus tard si besoin

  return (
    <div className="bg-white shadow-soft-lg h-full flex flex-col" data-tutorial="sidebar">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-bubble-500 rounded-xl flex items-center justify-center">
            <Building2 className="w-16 h-16 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Umbrella</h1>
            <p className="text-xs text-gray-500">Industrial Services</p>
          </div>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  data-tutorial={`${item.id}-menu`}
                  className={`w-full flex items-center space-x-3 px-4 py-2 transition-all duration-300 ease-in-out
                    ${isActive
                      ? 'bg-gray-100 text-blue-700 border-l-4 border-blue-600 shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
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
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50"
            data-tutorial="logout-button"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}