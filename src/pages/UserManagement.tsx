import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import UserTable from '@/components/UserTable';
import { toast } from '@/components/ui/use-toast';
import { userService } from '@/services/userService';
import type { User } from '@/types/user';

const UserManagement = () => {
  const { currentUser } = useAuth();
  const token = localStorage.getItem('accessToken') || '';
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(token),
    select: (data) => {
      if (!Array.isArray(data)) {
        console.error('La respuesta de la API no es un array:', data);
        return [];
      }
      return data;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (newUser: Omit<User, 'id'>) => userService.createUser(newUser, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Ha ocurrido un error al crear el usuario",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...data }: User) => userService.updateUser(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado exitosamente",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Ha ocurrido un error al actualizar el usuario",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Ha ocurrido un error al eliminar el usuario",
      });
    },
  });

  const handleUserCreate = async (userData: Omit<User, 'id'>) => {
    await createUserMutation.mutateAsync(userData);
  };

  const handleUserUpdate = async (updatedUser: User) => {
    await updateUserMutation.mutateAsync(updatedUser);
  };

  const handleUserDelete = async (userId: number) => {
    await deleteUserMutation.mutateAsync(userId);
  };

  if (!currentUser?.role || currentUser.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-900">Acceso Denegado</h2>
          <p className="mt-2 text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </Layout>
    );
  }

  // Verificación adicional para asegurar que users sea un array
  const safeUsers = Array.isArray(users) ? users : [];

  if (isError) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">No se pudieron cargar los usuarios.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios que tienen acceso al sistema
          </p>
        </div>

        <div className="space-y-4">
          <UserTable 
            users={safeUsers}
            onUserUpdate={handleUserUpdate}
            onUserDelete={handleUserDelete}
            onUserCreate={handleUserCreate}
            loading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
