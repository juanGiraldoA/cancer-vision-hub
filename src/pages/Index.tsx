
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Index = () => {
  const { login, isAuthenticated, loading } = useAuth();

  const handleLogin = (data: { email: string; password: string }) => {
    login(data.email, data.password);
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
            Plataforma de detección y análisis de cáncer
          </p>
        </div>
        
        <div className="mt-8">
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <Alert className="bg-transparent border-0 p-0">
                <InfoIcon className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm text-blue-700">
                  <strong>Credenciales de prueba:</strong>
                  <div className="mt-1 grid gap-1">
                    <div><strong>Admin:</strong> admin@example.com / admin123</div>
                    <div><strong>Usuario:</strong> user@example.com / user123</div>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <AuthForm 
            type="login" 
            onSubmit={handleLogin} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
