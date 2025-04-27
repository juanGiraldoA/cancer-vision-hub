
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { UserForm } from './UserForm';
import { UserFormValues } from '@/schemas/userSchema';

interface UserDialogsProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedUser: User | null;
  onEditSubmit: (values: UserFormValues) => void;
  onCreateSubmit: (values: UserFormValues) => void;
  onDeleteConfirm: () => void;
}

export function UserDialogs({
  isEditDialogOpen,
  setIsEditDialogOpen,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedUser,
  onEditSubmit,
  onCreateSubmit,
  onDeleteConfirm,
}: UserDialogsProps) {
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualiza la información del usuario. Deja la contraseña en blanco para mantener la actual.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              onSubmit={onEditSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
              defaultValues={selectedUser}
              submitLabel="Guardar cambios"
              showPassword={true}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Usuario</DialogTitle>
            <DialogDescription>
              Ingresa la información para crear un nuevo usuario
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={onCreateSubmit}
            onCancel={() => setIsCreateDialogOpen(false)}
            submitLabel="Crear Usuario"
            showPassword={true}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al usuario {selectedUser?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
