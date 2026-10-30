import type { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteResourceDialogProps<TResource> {
  resource: TResource | null;
  resourceLabel: string;
  getResourceName: (resource: TResource) => string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
}

export const DeleteResourceDialog = <TResource,>({
  resource,
  resourceLabel,
  getResourceName,
  isDeleting,
  onConfirm,
  onClose,
  title,
  description,
}: DeleteResourceDialogProps<TResource>) => (
  <AlertDialog open={resource !== null} onOpenChange={(isOpen) => !isOpen && onClose()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title ?? `Delete ${resourceLabel}?`}</AlertDialogTitle>
        <AlertDialogDescription>
          {description ??
            (resource
              ? `"${getResourceName(resource)}" will be permanently removed. This action cannot be undone.`
              : '')}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          disabled={isDeleting}
          onClick={(event) => {
            event.preventDefault();
            onConfirm();
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
