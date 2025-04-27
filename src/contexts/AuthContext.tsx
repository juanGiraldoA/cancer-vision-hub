import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

interface User {
  cc: string;
  email: string;
  role: string;
  name?: string;
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
  forgotPassword: (email: string) => Promise<void>;
  register: (cc: string, email: string, password: string) => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
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
      
      const tokenPayload = JSON.parse(atob(data.access.split('.')[1]));
      
      const user: User = {
        cc: tokenPayload.cc,
        email: tokenPayload.email,
        role: tokenPayload.role,
        name: tokenPayload.name || 'Usuario',
      };

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

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Correo enviado",
        description: "Se ha enviado un correo con instrucciones para restablecer tu contraseña",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el correo de recuperación",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (cc: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/registrarse/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cc, email, password }),
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada, ahora puedes iniciar sesión",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: "No se pudo completar el registro",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    loading,
    forgotPassword,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
