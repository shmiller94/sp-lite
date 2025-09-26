import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { H3 } from '@/components/ui/typography';
import { AdminUser } from '@/types/api';

import { useAdminDeleteUser } from '../api';

interface DeleteUserModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteUserModal = ({
  user,
  isOpen,
  onClose,
}: DeleteUserModalProps) => {
  const deleteUserMutation = useAdminDeleteUser();

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast.success('User deleted successfully');
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-10">
        <DialogTitle>
          <H3>Deactivate member</H3>
        </DialogTitle>
        <DialogDescription className="space-y-2 text-left">
          <p>
            Are you sure you want to delete{' '}
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            ?
          </p>
          <p className="text-red-600">
            This action is irreversible and will set the user as deleted in the
            system.
          </p>
        </DialogDescription>
        <DialogFooter className="pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
