
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';

const Register = () => {
  const { register, isAuthenticated, loading } = useAuth();

  const handleRegister = (data: { cc: string; email: string; password: string }) => {
    register(data.cc, data.email, data.password);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-secondary/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">CancerVisionHub</h1>
          <p className="mt-2 text-sm text-gray-600">
            Crea una cuenta para acceder a la plataforma
          </p>
        </div>
        
        <div className="mt-8">
          <AuthForm 
            type="register" 
            onSubmit={handleRegister} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
