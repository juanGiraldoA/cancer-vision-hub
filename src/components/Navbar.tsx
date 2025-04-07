
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Image, 
  History,
  LogOut 
} from 'lucide-react';

const Navbar = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/prediction', label: 'Predicción', icon: <Image size={18} /> },
    { path: '/history', label: 'Historial', icon: <History size={18} /> },
  ];

  // Add user management for admin users
  if (currentUser?.role === 'admin') {
    navItems.splice(1, 0, { 
      path: '/users', 
      label: 'Usuarios', 
      icon: <Users size={18} /> 
    });
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">CancerVisionHub</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'text-primary bg-secondary'
                      : 'text-gray-600 hover:text-primary hover:bg-secondary/50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-sm font-medium mr-4 hidden md:block">
              <span className="text-gray-500">Hola, </span>
              <span className="text-primary">{currentUser?.name}</span>
            </div>
            <Button
              variant="ghost" 
              size="sm" 
              onClick={logout} 
              className="text-gray-600 hover:text-destructive"
            >
              <LogOut size={18} className="mr-1" />
              <span className="hidden md:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-gray-600'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex flex-col items-center justify-center py-2 text-gray-600"
          >
            <LogOut size={18} />
            <span className="text-xs mt-1">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
