
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import UserTable, { User } from '@/components/UserTable';
import { toast } from '@/components/ui/use-toast';

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:00:00',
  },
  {
    id: 2,
    name: 'Test User',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-20T14:30:00',
  },
  {
    id: 3,
    name: 'María González',
    email: 'maria@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-05T09:15:00',
  },
  {
    id: 4,
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-02-10T16:45:00',
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ha ocurrido un error al cargar los usuarios",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const handleUserDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleUserCreate = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const createdUser: User = {
      ...newUser,
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, createdUser]);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            users={users} 
            onUserUpdate={handleUserUpdate} 
            onUserDelete={handleUserDelete}
            onUserCreate={handleUserCreate}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
