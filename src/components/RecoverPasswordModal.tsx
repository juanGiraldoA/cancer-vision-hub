import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { authService } from '@/services/authService';

interface RecoverPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emailSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const RecoverPasswordModal: React.FC<RecoverPasswordModalProps> = ({ open, onOpenChange }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError(null);
      form.reset();
      // Focus the email input when modal opens
      setTimeout(() => {
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
        if (emailInput) {
          emailInput.focus();
        }
      }, 100);
    }
  }, [open, form]);

  const handleSubmit = async (values: EmailFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.requestPasswordReset(values.email);
      setSuccess(true);
    } catch (err) {
      setError('Ocurrió un error de red. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        aria-describedby="recover-password-description"
      >
        <DialogHeader>
          <DialogTitle>¿Olvidaste tu contraseña?</DialogTitle>
          <DialogDescription id="recover-password-description">
            Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Si el correo existe en nuestro sistema, enviamos instrucciones de recuperación.
                Revisa tu bandeja de entrada y carpeta de spam.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleClose} 
              className="w-full"
              variant="outline"
            >
              Cerrar
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="correo@ejemplo.com" 
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Enviando...
                    </>
                  ) : (
                    'Enviar instrucciones'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecoverPasswordModal;