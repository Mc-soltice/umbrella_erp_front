import {
  Home,
  FolderOpen,
  // HelpCircle,
  MessageCircle,
  UserPlus,
  Building2,
  Calendar,
  User2Icon,
  Users2Icon,
  Wallet2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Home },
  { id: 'candidatures', label: 'Candidatures', icon: UserPlus, adminOnly: false },
  { id: 'chat', label: 'Chat interne', icon: MessageCircle },
  { id: 'responsables', label: 'Responsables', icon: User2Icon },
  { id: 'agents', label: 'Agents', icon: Users2Icon },
  { id: 'Plannings', label: 'Plannings', icon: Calendar },
  { id: 'files', label: 'Gestion des fichiers', icon: FolderOpen },
  { id: 'transactions', label: 'Etat des transations', icon: Wallet2 },
];

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const { user } = useAuth();

  const filteredItems = menuItems.filter(item =>
    !item.adminOnly || (user?.role === 'admin' || user?.role === 'coordinateur')
  );

  return (
    <div className="bg-white shadow-soft-lg h-full flex flex-col" data-tutorial="sidebar">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-bubble-500 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Umbrella</h1>
            <p className="text-xs text-gray-500">Industrial Services</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  data-tutorial={`${item.id}-menu`}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl hover:scale-90 transition-all duration-300 ease-in-out ${isActive
                      ? 'bg-gradient-to-r bg-blue-500 to-bubble-500 text-white shadow-soft'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-xl">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 color-white font-semibold text-sm">
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}