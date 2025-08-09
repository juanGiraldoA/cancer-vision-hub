import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { authService } from '@/services/authService';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

interface ResetPasswordParams extends Record<string, string> {
  uidb64: string;
  token: string;
}

const passwordSchema = z.object({
  nueva_password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/\d/, 'Debe contener al menos un número'),
  confirmar_password: z.string(),
}).refine((data) => data.nueva_password === data.confirmar_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmar_password'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ResetPasswordPage: React.FC = () => {
  const { uidb64, token } = useParams<ResetPasswordParams>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      nueva_password: '',
      confirmar_password: '',
    },
  });

  const watchPassword = form.watch('nueva_password');

  useEffect(() => {
    const validateToken = async () => {
      if (!uidb64 || !token) {
        setIsValidToken(false);
        setValidating(false);
        return;
      }

      try {
        const isValid = await authService.validateResetToken(uidb64, token);
        setIsValidToken(isValid);
      } catch (err) {
        setIsValidToken(false);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [uidb64, token]);

  const handleSubmit = async (values: PasswordFormValues) => {
    if (!uidb64 || !token) return;

    setLoading(true);
    setError(null);

    try {
      await authService.changePassword({
        uidb64,
        token,
        nueva_password: values.nueva_password,
        confirmar_password: values.confirmar_password,
      });
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-secondary/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="w-full border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin mx-auto h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                <p className="mt-2 text-sm text-muted-foreground">Validando enlace...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-secondary/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">CancerVisionHub</h1>
          </div>
          
          <Card className="w-full border-0 shadow-lg">
            <CardHeader className="space-y-1 bg-destructive/10">
              <CardTitle className="text-2xl font-bold text-center text-destructive">
                Enlace Inválido
              </CardTitle>
              <CardDescription className="text-center">
                El enlace de recuperación es inválido o ha expirado
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Alert variant="destructive" className="mb-4">
                <XCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  El enlace es inválido o expiró. Solicita un nuevo correo desde el login.
                </AlertDescription>
              </Alert>
              
              <Button asChild className="w-full">
                <Link to="/">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Volver al Login
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-secondary/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">CancerVisionHub</h1>
          <p className="mt-2 text-sm text-gray-600">
            Establece tu nueva contraseña
          </p>
        </div>

        <Card className="w-full border-0 shadow-lg">
          <CardHeader className="space-y-1 bg-secondary/30">
            <CardTitle className="text-2xl font-bold text-center">
              {success ? 'Contraseña Actualizada' : 'Nueva Contraseña'}
            </CardTitle>
            <CardDescription className="text-center">
              {success 
                ? 'Tu contraseña ha sido actualizada correctamente'
                : 'Ingresa tu nueva contraseña'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {success ? (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Contraseña actualizada correctamente. Serás redirigido al login en unos segundos.
                  </AlertDescription>
                </Alert>
                
                <Button asChild className="w-full">
                  <Link to="/">
                    Ir al Login
                  </Link>
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <XCircleIcon className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="nueva_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva Contraseña</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Ingresa tu nueva contraseña" 
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                        <PasswordStrengthIndicator password={watchPassword} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmar_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Contraseña</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirma tu nueva contraseña" 
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Actualizando...
                      </>
                    ) : (
                      'Actualizar Contraseña'
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;