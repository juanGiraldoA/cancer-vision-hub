
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';
import RecoverPasswordModal from '@/components/RecoverPasswordModal';

const Index = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [showRecoverModal, setShowRecoverModal] = useState(false);

  const handleLogin = (data: { cc: string; password: string }) => {
    login(data.cc, data.password);
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
                  <strong>Ejemplo de credenciales:</strong>
                  <div className="mt-1">
                    <div><strong>CC:</strong> 1002655874</div>
                    <div><strong>Contraseña:</strong> shaolin22</div>
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
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setShowRecoverModal(true)}
              className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>
        </div>
      </div>

      <RecoverPasswordModal 
        open={showRecoverModal} 
        onOpenChange={setShowRecoverModal} 
      />
    </div>
  );
};

export default Index;
