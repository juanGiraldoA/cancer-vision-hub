
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthFormProps {
  type: 'login' | 'register' | 'forgotPassword';
  onSubmit: (data: any) => void;
  loading: boolean;
}

const loginSchema = z.object({
  email: z.string().email('Correo electrónico invalido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico invalido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electrónico invalido'),
});

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, loading }) => {
  const schema = 
    type === 'login' 
      ? loginSchema 
      : type === 'register' 
        ? registerSchema 
        : forgotPasswordSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: type !== 'forgotPassword' ? '' : undefined,
      name: type === 'register' ? '' : undefined,
      confirmPassword: type === 'register' ? '' : undefined,
    },
  });

  const handleSubmit = (values: z.infer<typeof schema>) => {
    onSubmit(values);
  };

  const titles = {
    login: {
      title: 'Iniciar Sesión',
      description: 'Ingresa tus credenciales para acceder al sistema',
      buttonText: 'Iniciar Sesión',
    },
    register: {
      title: 'Crear Cuenta',
      description: 'Completa el formulario para registrarte',
      buttonText: 'Registrarse',
    },
    forgotPassword: {
      title: 'Recuperar Contraseña',
      description: 'Ingresa tu correo para recibir instrucciones',
      buttonText: 'Enviar Instrucciones',
    },
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {titles[type].title}
        </CardTitle>
        <CardDescription className="text-center">
          {titles[type].description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {type === 'register' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type !== 'forgotPassword' && (
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

            {type === 'register' && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
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
              className="w-full medical-gradient" 
              disabled={loading}
            >
              {loading ? (
                <><span className="animate-spin mr-2">⚪</span> Procesando...</>
              ) : (
                titles[type].buttonText
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {type === 'login' && (
          <>
            <Button variant="link" asChild className="text-sm">
              <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
            </Button>
            <div className="text-sm text-center">
              ¿No tienes una cuenta?{' '}
              <Button variant="link" asChild className="p-0">
                <a href="/register">Regístrate aquí</a>
              </Button>
            </div>
          </>
        )}

        {type === 'register' && (
          <div className="text-sm text-center">
            ¿Ya tienes una cuenta?{' '}
            <Button variant="link" asChild className="p-0">
              <a href="/">Inicia sesión</a>
            </Button>
          </div>
        )}

        {type === 'forgotPassword' && (
          <div className="text-sm text-center">
            <Button variant="link" asChild className="p-0">
              <a href="/">Volver al inicio de sesión</a>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
