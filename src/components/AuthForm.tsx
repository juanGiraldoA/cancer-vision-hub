
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthFormProps {
  type: 'login' | 'register' | 'forgotPassword';
  onSubmit: (data: any) => void;
  loading: boolean;
}

// Define schemas for each form type
const loginSchema = z.object({
  cc: z.string().min(8, 'La cédula debe tener al menos 8 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const registerSchema = z.object({
  cc: z.string().min(8, 'La cédula debe tener al menos 8 dígitos'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

// Create a type for all possible form values
type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Union type for all possible form values
type FormValues = LoginFormValues | RegisterFormValues | ForgotPasswordFormValues;

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, loading }) => {
  const schema = 
    type === 'login' ? loginSchema : 
    type === 'register' ? registerSchema :
    forgotPasswordSchema;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: 
      type === 'login' ? {
        cc: '',
        password: '',
      } : type === 'register' ? {
        cc: '',
        email: '',
        password: '',
      } : {
        email: '',
      } as FormValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const getTitle = () => {
    switch (type) {
      case 'login': return 'Iniciar Sesión';
      case 'register': return 'Crear Cuenta';
      case 'forgotPassword': return 'Recuperar Contraseña';
      default: return 'Autenticación';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'login': return 'Ingresa tus credenciales para acceder al sistema';
      case 'register': return 'Ingresa tus datos para crear una cuenta nueva';
      case 'forgotPassword': return 'Ingresa tu correo para recuperar tu contraseña';
      default: return '';
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'login': return 'Iniciar Sesión';
      case 'register': return 'Registrarse';
      case 'forgotPassword': return 'Enviar Correo';
      default: return 'Enviar';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
      <CardHeader className="space-y-1 bg-secondary/30">
        <CardTitle className="text-2xl font-bold text-center">
          {getTitle()}
        </CardTitle>
        <CardDescription className="text-center">
          {getDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {type === 'register' && (
              <>
                <FormField
                  control={form.control}
                  name="cc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula de Ciudadanía</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Ingresa tu cédula" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {type === 'login' && (
              <FormField
                control={form.control}
                name="cc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula de Ciudadanía</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ingresa tu cédula" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === 'forgotPassword' && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(type === 'login' || type === 'register') && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Procesando...
                </>
              ) : (
                getButtonText()
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
