import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { User } from '@/types/user';
import { useUserActions } from '@/hooks/useUserActions';
import { UserDialogs } from './users/UserDialogs';

interface UserTableProps {
  users: User[];
  onUserUpdate: (user: User) => void;
  onUserDelete: (userId: number) => void;
  onUserCreate: (user: Omit<User, 'id'>) => void;
  loading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onUserUpdate, 
  onUserDelete,
  onUserCreate,
  loading = false
}) => {
  const {
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
  } = useUserActions(onUserUpdate, onUserDelete, onUserCreate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Usuarios del Sistema</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="medical-gradient">
          <UserPlus size={16} className="mr-2" />
          Nuevo Usuario
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cc}</TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                  </span>
                </TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditUser(user)} 
                    className="text-blue-600"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteUser(user)} 
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserDialogs
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        onEditSubmit={handleEditSubmit}
        onCreateSubmit={handleCreateSubmit}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default UserTable;
