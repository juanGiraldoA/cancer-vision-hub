
import { useState } from 'react';
import { User } from '@/types/user';
import { toast } from '@/components/ui/use-toast';
import { UserFormValues } from '@/schemas/userSchema';

export const useUserActions = (
  onUserUpdate: (user: User) => void,
  onUserDelete: (userId: number) => void,
  onUserCreate: (user: Omit<User, 'id'>) => void,
) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      onUserDelete(selectedUser.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Usuario eliminado",
        description: `El usuario ${selectedUser.name} ha sido eliminado`,
      });
    }
  };

  const handleEditSubmit = (values: UserFormValues) => {
    if (selectedUser) {
      onUserUpdate({
        ...selectedUser,
        ...values,
      });
      setIsEditDialogOpen(false);
      toast({
        title: "Usuario actualizado",
        description: `La información de ${values.name} ha sido actualizada`,
      });
    }
  };

  const handleCreateSubmit = (values: UserFormValues) => {
    if (!values.password) {
      throw new Error('La contraseña es obligatoria para nuevos usuarios');
    }
    
    onUserCreate({
      name: values.name,
      email: values.email,
      cc: values.cc,
      role: values.role,
      status: values.status,
    });
    
    setIsCreateDialogOpen(false);
    toast({
      title: "Usuario creado",
      description: `El usuario ${values.name} ha sido creado exitosamente`,
    });
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedUser,
    handleEditUser,
    handleDeleteUser,
    handleDeleteConfirm,
    handleEditSubmit,
    handleCreateSubmit,
  };
};
