import type { ReactNode } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ViewResourceDialogProps<TResource> {
  resource: TResource | null;
  onClose: () => void;
  getTitle: (resource: TResource) => ReactNode;
  getDescription?: (resource: TResource) => ReactNode;
  children: (resource: TResource) => ReactNode;
  className?: string;
}

export const ViewResourceDialog = <TResource,>({
  resource,
  onClose,
  getTitle,
  getDescription,
  children,
  className,
}: ViewResourceDialogProps<TResource>) => (
  <Dialog open={resource !== null} onOpenChange={(isOpen) => !isOpen && onClose()}>
    <DialogContent className={cn('sm:max-w-md', className)}>
      {resource && (
        <>
          <DialogHeader>
            <DialogTitle>{getTitle(resource)}</DialogTitle>
            {getDescription && <DialogDescription>{getDescription(resource)}</DialogDescription>}
          </DialogHeader>
          {children(resource)}
        </>
      )}
    </DialogContent>
  </Dialog>
);
