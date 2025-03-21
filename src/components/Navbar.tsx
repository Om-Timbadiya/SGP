import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  LayoutDashboard, 
  UserCircle, 
  LogOut,
  MessageSquare,   
  HelpCircle,
  Award,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const getNavItems = () => {
    const commonItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/assessment', icon: Brain, label: 'Assessment' },
      { path: '/discussion', icon: MessageSquare, label: 'Discussion' },
      { path: '/help', icon: HelpCircle, label: 'Help Center' },
      { path: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    if (user?.role === 'admin') {
      return commonItems;
    }

    return [
      ...commonItems,
      { path: '/certificates', icon: Award, label: 'Certificates' },
      { path: '/badges', icon: Shield, label: 'Badges' },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Brain className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold text-gray-800">AI-Chintu</span>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-4 w-52">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3 px-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
