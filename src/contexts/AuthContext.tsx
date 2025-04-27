
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

interface User {
  cc: string;
  email: string;
  role: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (cc: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user and tokens are in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (cc: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/iniciar-sesion/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cc, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data: AuthTokens = await response.json();
      
      // Decode the JWT token to get user information
      const tokenPayload = JSON.parse(atob(data.access.split('.')[1]));
      
      const user: User = {
        cc: tokenPayload.cc,
        email: tokenPayload.email,
        role: tokenPayload.role,
      };

      // Store tokens and user data
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      setCurrentUser(user);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Credenciales inválidas",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    navigate('/');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
