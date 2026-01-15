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
import { useReactivateUser } from '@/features/users/api/admin-reactivate-user';
import { AdminUser } from '@/types/api';

interface ReactivateUserModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
}

export const ReactivateUserModal = ({
  user,
  isOpen,
  onClose,
}: ReactivateUserModalProps) => {
  const reactivateUserMutation = useReactivateUser();

  const handleReactivate = async () => {
    try {
      await reactivateUserMutation.mutateAsync(user.id);
      toast.success('User reactivated successfully');
      onClose();
    } catch (error) {
      console.error('Reactivation failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-10">
        <DialogTitle>
          <H3>Reactivate member</H3>
        </DialogTitle>
        <DialogDescription className="space-y-2 text-left">
          <p>
            Are you sure you want to reactivate{' '}
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            ?
          </p>
          <p className="text-gray-600">
            This will restore the member&apos;s access to their Superpower
            account.
          </p>
        </DialogDescription>
        <DialogFooter className="pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={reactivateUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleReactivate}
            disabled={reactivateUserMutation.isPending}
          >
            {reactivateUserMutation.isPending
              ? 'Reactivating...'
              : 'Reactivate User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
